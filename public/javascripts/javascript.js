$(window).load(function () {
    $('.load').remove();
    $('.see').fadeIn('slow');
    
});



$(document).ready(function () {
     
    $(document).on('change', function (e) {
        //alert(e);
        var $tar = $(e.target);
        if ($tar.hasClass('respuesta')) {
            var styleValue = '';
            styleValue = $($tar).val();
            var venta = $.trim($('.tab-pane.active').find('.noVenta').text());
            var tipo = $('.tab-pane.active').find('.' + styleValue).hasClass(styleValue);
            
            if (!tipo) {
                $('.tab-pane.active').find('#detalleRespues').children().remove();
                $.get(
                    '/respuesta',
                         { respuesta: styleValue , 'venta' : venta },
                        function (data) {
                        
                        $('.tab-pane.active').find('#detalleRespues').append(data);
                    }
                );
                $.get(
                    '/empleados',
                         { empleado : "" },
                        function (data) {
                        $('.tab-pane.active').find('.empleado').append(data);
                    }

                );
            }
        }

        if ($tar.hasClass('prods')) {

            //var prod = $('.tab-pane.active').find('.prods').val().leght();

            //$('.tab-pane.active').find('#products').empty();


        };

    });
    
    $(document).on('click', function (e) {
        var $tar= $(e.target);
        if ($tar.hasClass('ion-android-close')) {
            
            var $tabc = $($tar).parents('li').find('a').attr('href');
            //alert($tabc)
            $($tabc).not('#principal').not('#inicio').remove();
            $($tar).parents('li').not('#principal').not('#inicio').remove();
            $('#principal').addClass('in active');
            $('#inicio').addClass('in active');
        }

        if ($tar.hasClass('ion-clipboard')) {
            var date = new Date();
            var dia = date.getDate();
            var mes = date.getMonth();
            var year = date.getFullYear();
            var now = year + '-' + mes + '-' + dia;
            $('.tab-pane.active').find('input#startdate').each(function (e) {
                $(this).val(now);
            });
            
            var hora = date.getHours();
            var minuto = date.getMinutes();
            var time = hora + ':' + minuto;
            $('.tab-pane.active').find('input#exit-time').each(function (e) {
                //$(this).attr('value', time);
                $(this).val(time);
            });
            $('.fechas').hide();
        }
        if ($tar.hasClass('ion-calendar')) {
            $('.fechas').toggle('slow');
        }
        if ($tar.parents().hasClass('articulo')) {
            var articulo = $tar.parents().attr('clave');
            var descripcion = $tar.parents().attr('descripcion');
            var precio = $tar.parents().attr('precio');
            $('.tab-pane.active').find('input.prods').attr({'clave': articulo, 'descripcion': descripcion, 'precio': precio});
            $('.tab-pane.active').find('input.prods').val(articulo)
            $('.tab-pane.active').find('#products').empty();
        }

        if ($tar.hasClass('carrito')) {
            var articulo = $('.tab-pane.active').find('input.prods').attr('clave');
            var descripcion = $('.tab-pane.active').find('input.prods').attr('descripcion');
            var precio = ($('.tab-pane.active').find('input.prods').attr('precio')) / 1.16;
      
            var venta = $.trim($('.tab-pane.active').find('.noVenta').text());
            var prod = $('tab-pane.active').find('input.prods').attr('value');
            $('.tab-pane.active').find('input.prods').val('');
            //var datos = ;
            if (articulo != "" && prod != "") {
                $.ajax({
                    type: 'POST', url: '/partida', data : { ventas : venta, articulos : articulo, descripcions: descripcion, precios: precio },
                    dataType: 'text', 
                    success: function (response) {
                        alert(response);
                    },
                    error: function (xhr) {
                        $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                    }
                });
            }

           // $.post(
            //    '/partida',
             //            { ventas : venta,articulos : articulo, descripcions: descripcion, precios:precio },
               //         function (data) {
                    //$('.tab-pane.active').find('.empleado').append(data);
                    //        alert(data);
                //}

            //);

        }

        $(document).on('blur', function () {
            alert('test');
        });
    });
    
    $(document).on('keypress', function (e) {
        var $tar = $(e.target);
        var tipo = $($tar).hasClass('prods');
        var prod = $('.tab-pane.active').find('.prods').val() + String.fromCharCode(e.charCode);
        if (tipo) {
            buscaProduct(prod);
        }
        
    });
    
    $(document).on('keyup', function (e) {
        var $tar = $(e.target);
        var tipo = $($tar).hasClass('prods');
        if (tipo) {
            
            if (e.keyCode === 8) {
                var prod = $('.tab-pane.active').find('.prods').val();
                buscaProduct(prod);
            }
        }
    });
    
    function buscaProduct(prod) {
      
        $('.tab-pane.active').find('#products').empty();
       
        $.get(
            '/prods',
                { filtro: prod },
                     function (data) {
                $('.tab-pane.active').find('#products').append(data);
            }
        ); 
       
    }
    
   
    //$(document).on("textInput", function (event) {
        //alert(event[1]);
    //});
       
    function datepa() {
        var $fecha = $('.tab-pane').find('.fecha');
        //alert($fecha[0]);
        $('.tab-pane.active').find('.fecha').each(function (n) {
            var date = new Date(Date.parse($(this).text()));
            var $monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ]       
            var dia = date.getDate();
            var mes = $monthNames[date.getMonth()];
            var year = date.getFullYear();
            var fecha = dia + '  ' + mes + '  ' + year;
            $('<div class="date">' + fecha + '</div>').insertAfter(this);
            $(this).remove();
        });
    };		
    $('.expand').on('click', function () {
        var tab = $(this).attr('name');
        var ide = $(this).attr('id');
        var $tabExists = $('.nav-tabs').find('li[value=' + ide + ']').attr('value');
        
        if ($tabExists) {
            $('.active').not('.navbar-nav li').removeClass('active');
            $('.nav-tabs').find('li[value=' + ide + ']').addClass('active');
            $('#' + tab).addClass('fade in active');
            
        } else {
            $('.active').not('.navbar-nav li').removeClass('active');
            $('.nav-tabs').append('<li class="active" name="orden" value="' + ide + '"><a href="#' + tab + '" data-toggle="tab">' + tab + '</a><div class="closec ion-android-close"></div></li>');
            $('.tab-content').append('<div id="' + tab + '" class="tab-pane fade in active"></div>');
            $.get('/Orden', { orden : ide } , function (data) {
                $('#' + tab).append(data);
                datepa();
            });
        }  
    });

});
    
(function ($) {
    $.formatDate = function (date, pattern) {
       
        var result = [];
        while (pattern.length > 0) {
            $.formatDate.patternParts.lastIndex = 0;
            var matched = pattern; //$.formatDate.patternParts.exec(pattern);
           
            if (matched) {
                var dat = $.formatDate.patternValue[matched];
                //alert(date);
                alert(dat.call(this, date));

                result.push(
                    $.formatDate.patternValue[matched].call(this, date)
                );
                
                pattern = pattern.slice(matched[0].length);
            } else {
                result.push(pattern.charAt(0));
                pattern = pattern.slice(1);
            }
        }
        return result.join('');
    };
    $.formatDate.patternParts = /^{(yy(yy)?|M(M(M(M)?)?)?|d(d)?|EEE(E)?|a|H(H)?|h(h)?|m(m)?|s(s)?|S)/;
    $.formatDate.monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'Agust', 'September', 'October', 'November', 'December'
    ];
    $.formatDate.dayNames = [
        'Sunday', 'Monday', 'Thuesday', 'Wednesday', 'Thursday', 'Friday',
        'Saturday'
    ];
    $.formatDate.patternValue = {
        yy: function (date) {
            return $.toFixedWidth(date.getFullYear(), 2);
        },
        yyyy: function (date) {
            alert(date);
            return date.getMonth();
        },
        MMMM: function (date) {
            return $.formatDate.monthNames[date.getMonth()];
        },
        MMM: function (date) {
            return $.formatDate.monthNames[date.getMonth()].substr(0, 3);
        },
        MM: function (date) {
            return $.toFixedWidth(date.getMonth() + 1, 2);
        },
        M: function (date) {
            return date.getMonth() + 1;
        },
        dd: function (date) {
            return $.toFixedWidth(date.getDate(), 2);
        },
        d: function (date) {
            return date.getDate();
        },
        EEEE: function (date) {
            return $.formatDate.dayNames[date.getDay()];
        },
        EEE: function (date) {
            return $.formatDate.dayNames[date.getDay()].substr(0, 3);
        },
        HH: function (date) {
            return $.toFixedWidth(date.getHours(), 2);
        },
        H: function (date) {
            return date.getHours();
        },
        hh: function (date) {
            var hours = date.getHours();
            return $.toFixedWidth(hours > 12 ? hours - 12 : hours, 2);
        },
        h: function (date) {
            return date.getHours() % 12;
        },
        mm: function (date) {
            return $.toFixedWidth(date.getMinutes(), 2);
        },
        m: function (date) {
            return date.getMinutes();
        },
        ss: function (date) {
            return $.toFixedWidth(date.getSeconds(), 2);
        },
        s: function (date) {
            return date.getSeconds();
        },
        S: function (date) {
            return $.toFixedWidth(date.getMilliseconds(), 3);
        },
        a: function (date) {
            return date.getHours() < 12 ? 'AM' : 'PM';
        }
    };
})(jQuery);