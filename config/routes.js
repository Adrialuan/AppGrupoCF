// app/routes.js

var mysql = require('msnodesql');
var dbconfig = require('./config');
//var connstring = dbconfig.SQL_CONN;
var connstring = dbconfig.localDB;
var Drive = dbconfig.DriveN;


module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		//res.render('index', { title: 'APPCF' }); // load the index.ejs file
        res.redirect('/login');
    });
    app.get('/Orden',orden, function (req, res) {
        //res.render('Orden');
    });

    app.get('/empleados', empleados, function (req, res) {
        //res.render('Orden');  
    });
    app.get('/respuesta', function (req, res) {
        //console.log(req);
        var vista = req.query.respuesta;
        var venta = (req.query.venta).trim();
        
        if (venta < 1) {
            venta = 0;
        }
        
        if (vista === 'reparacion') {
           
            mysql.open(connstring, function (err, conn) {
                
                conn.query("SELECT  PARTVTA.ARTICULO AS 'ARTICULO', PARTVTA.CANTIDAD AS 'CANTIDAD', PARTVTA.PRECIO AS 'PRECIO' ,PARTVTA.OBSERV AS 'OBSERV' , VENTAS.IMPORTE  AS 'IMPORTE', VENTAS.IMPUESTO AS 'IMPUESTO' from PARTVTA INNER JOIN VENTAS ON PARTVTA.VENTA = VENTAS.VENTA WHERE PARTVTA.VENTA = ?" , [venta] , function (err, partidas) {
                    if (err)
                        console.log(err);
                    //console.log(empleado)
                    console.log(partidas);
                    
                    res.render(vista, { 'partidas': partidas });
                });
            
            });
        } else {
        //console.log(req.query.respuesta);
            res.render(vista);
        }
        
    });
    
    
    app.get('/tables/ordenes', function (req, res) {
        if (req.user[0].admon === 0) {
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ from ordenes where Asignado = '" + req.user[0].Usuario + "' OR Cliente = '" + req.user[0].Usuario + "'";
        } else {
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ from ordenes where estatus <> 'Cancelada'";
        }
        mysql.open(connstring, function (err, conn) {
            conn.query(Consulta, function (err, orden) {
                if (err)
                    return done(err);
                // console.log(orden);
                res.send(orden);            
            });
        }); 
        
    });
    
    app.get('/tables/prods', function (req, res) {
        
        
        if (req.user[0].admon === 0) {
            Consulta = "select ARTICULO, DESCRIP, PRECIO1 FROM PRODS";
        } else {
            Consulta = "select ARTICULO, DESCRIP, PRECIO1 FROM PRODS";
        }
        mysql.open(connstring, function (err, conn) {
            conn.query(Consulta, function (err, prods) {
                if (err)
                    console.log(err);
                // console.log(orden);
                res.send(prods);
                           
            });
        });
        
        
    });
    app.post('/partida', function (req, res) {
        console.log(req.body);
        var venta = (req.body.ventas).trim();
        var articulo = (req.body.articulos).trim(); 
        var descripcion = (req.body.descripcions).trim();
        var precio = req.body.precios;
        var cantidad = 1;
        var usuario = "ADRIAN";
        var fecha = new Date();
        var hora = "11:22";
        var almacen = 1;
        var caja = "ESTACION01";
        console.log("todo va bien");
        
        mysql.open(connstring, function (err, conn) {
                
                var queryString = "INSERT INTO PARTVTA (VENTA, ARTICULO, CANTIDAD, PRECIO, COSTO, DESCUENTO, IMPUESTO, OBSERV, USUARIO, UsuFecha, UsuHora, ALMACEN, "
                queryString += " LISTA, PRCANTIDAD, estado, precioBase, CAJA, Devolucion, DevConf, Id_Entrada, Invent, importe, kit, costo_u, iespecial, "
                queryString += " puntadas, colores, verificado, donativo, A01 )"
                queryString += " VALUES(?, ?, ? , ? , 0 , 0, 16, ?, ?, ?, ?, ?, 1, NULL , 'CO', ?, ?, 0, 0, 0, 1, 0, 0, 0 , 0, 0, 0, 0, 0, 0) "
            
            console.log(queryString);
                var valores = [venta, articulo, cantidad, precio, descripcion, usuario, fecha, hora, almacen, precio, caja]
                conn.query(queryString, valores , function (err, partidas) {
                    if (err)
                        console.log(err);
                    
                    //console.log(partidas);
                    
                    res.end('ok');
                });
            });
            
    });
    app.get('/prods', function (req, res) {
        
        var like = '%' + (req.query.filtro).replace(' ', '%' ) + '%';

        if (req.query.filtro != "")
            mysql.open(connstring, function (err, conn) {
            
                conn.query("select top 10 ARTICULO, DESCRIP, PRECIO1  from prods where ARTICULO LIKE ? OR DESCRIP LIKE ? " , [like, like] , function (err, prods) {
                    if (err)
                        console.log(err);
                    //console.log(empleado)
                    console.log(prods);
                    res.render('prods', { 'prods' : prods });
                });
            });

        //console.log(req.query.respuesta);
      
        
    });

	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {
    
		// render the page and pass in any flash data if it exists
		res.render('login', { message: req.flash('loginMessage') });
	});
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/servicio', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
    
    app.post('/OrdenRes', function (req, res) {
        console.log(req);
     
    });

	// SIGNUP =============================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('Registrar', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/servicio', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/servicio', isLoggedIn, ordeness , function(req, res) {
       // ordeness(req.user[0].Usuario);
        
    });
    
    function ordeness(req, res, next) {
        console.log(req.user)
        if (req.user[0].admon === 0) {
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ from ordenes where Asignado = '" + req.user[0].Usuario + "' OR Cliente = '" + req.user[0].Usuario + "'";
        } else {
            Consulta = "select id, Serie, Orden, estatus, ClienteNom, TipoEquipo, Registro, Pro_Observ from ordenes where estatus <> 'Cancelada'";
        }
        console.log(Consulta);        
        mysql.open(connstring, function (err, conn) {
                conn.query(Consulta, function (err, orden) {
                    if (err)
                        return done(err);
                    
                   // console.log(orden);
                    res.render('perfil', {'ordenes' : orden, imagen : Drive});
                           
            });
        }); 
        
    };
    function orden(req, res, next) {
        
        //console.log('aqui esta bien');
        //console.log(req.query.orden);
        mysql.open(connstring, function (err, conn) {

            conn.query("select * from ordenes where id =" + req.query.orden + "", function (err, ordens) {
                if (err)
                    return done(err);

                conn.query("select * from pendient where id =" + ordens[0].ID_pendiente + "", function (err, pendient) {
                    if (err)
                        return done(err);
                    console.log(pendient);
                    conn.query("select * from respues where IdPendiente =" + pendient[0].ID + "", function (err, respues) {
                        if (err)
                            return done(err);
                        console.log(respues);
                        res.render('Orden', { 'orden' : ordens[0], 'pendiente': pendient[0], 'respuesta': respues });
                    });      
                });         
            }); 
        });   
    }    ;
    function empleados(req, res, next) {
        mysql.open(connstring, function (err, conn) {
            
            conn.query("select USUARIO from usuarios ", function (err, empleado) {
                if (err)
                    return done(err);
                //console.log(empleado)
                res.render('empleados', { 'usuarios' : empleado });
                
              
            });
        });
    };

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
