// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var mysql = require('msnodesql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./config');
//var connstring = dbconfig.SQL_CONN;
var connstring = dbconfig.localDB;
//var connection = mysql.createConnection(dbconfig.connection);

module.exports = function (passport) {
    
    
    // expose this function to our app using module.exports

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //console.log(user);
        done(null, user.Id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        mysql.open(connstring, function(err, conn){
            conn.query("select * from usuariosWeb where id = " + id, function(err, user){
                done(err, user);
            });
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            mysql.open(connstring, function(err, conn){
            conn.query("select * from usuariosWeb where usuario = '" + username + "'", function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'El usuario ya existe.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUsersql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
                

                    var insertQuery = "INSERT INTO usuariosWeb ( Usuario, password ) values ('" + newUsersql.username + "','" + newUsersql.password + "')";
                    //console.log(insertQuery);

                    conn.query(insertQuery,function(err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        conn.query("SELECT * from usuariosWeb WHERE usuario ='" + newUsersql.username + "'", function(err, newuser){
                            if (err) {
                                console.log(err);
                               return;
                            }
                            //console.log(newuser[0]);
                           // console.log(newUsersql);
                            //newUsersql.id = newuser[0].Id;

                            return done(null, newuser[0]);
                            //console.log(newuser[0]);
                            //console.log(newUsersql);
                        });
                    });
                }
            });
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            // allows us to pass back the entire request to the callback
            passReqToCallback : true 
        },
        // callback with email and password from our form                  
        function(req, username, password, done) { 
            mysql.open(connstring, function(err, conn){
            conn.query("select * from usuariosWeb where Usuario = '" + username + "'",function(err, user){
                //console.log(rows);
                if (err)
                    return done(err);
                if (!user.length) {
                     // req.flash is the way to set flashdata using connect-flash
                    return done(null, false, req.flash('loginMessage', 'El ususario no existe.'));
                }
                var  hash = ''
                if(user[0].Password === password){
                        // all is well, return successful user
                                        
                       return done(null, user[0]);
                    
                 } else {
                     var encrypted_length = user[0].Password.length;

                     if(encrypted_length != 60) {
                           //throw "Not a valid BCrypt hash.";
                        hash = bcrypt.hashSync(user[0].Password);
	                } else {
                        hash = user[0].Password;
                    }
                        
                       // if the user is found but the password is wrong
                     if (!bcrypt.compareSync(password, hash ))
                         //console.log(user[0].password);
                        // create the loginMessage and save it to session as flashdata
                        return done(null, false, req.flash('loginMessage', 'Oops! Contraseña incorrecta.'));
                     
                     return done(null, user[0]);
                 }
                        
            }); 
        });
        })
    );
};
