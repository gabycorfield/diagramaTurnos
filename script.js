let datos=[{cod:1,apellido:'Perez', nombre:'María ffrgwtegeggr', fechaNac:'16/07/1987',direccion:'dir maria perez',telefono:'166hhrehterhreherhehehe66656556',dni:'56464644',civil:'Soltero',funcion:'cajero',email:'ggyug@kk.com',legajo:'32443',ingreso:'12/05/2020',activo:true},
		   {cod:2,apellido:'Rodriguez', nombre:'Oscar', fechaNac:'02/03/1981',direccion:'dir oscar rodr',telefono:'1666324256556',dni:'545454644',civil:'Casado', funcion:'playero',email:'ggyug@kk.com',legajo:'32463',ingreso:'12/01/2000',activo:true},
		   {cod:3,apellido:'Smith', nombre:'John', fechaNac:'23/05/2000',direccion:'dir jhon smith',telefono:'1655555556556',dni:'5624224644',civil:'Soltero', funcion:'playero',email:'ggyug@kk.com',legajo:'33343',ingreso:'19/11/2009',activo:false},
		   {cod:4,apellido:'Perez', nombre:'Enzo', fechaNac:'26/07/1995',direccion:'dir enzo perez',telefono:'13333333356',dni:'564434',civil:'Viudo',funcion:'administrativo',email:'ggyug@kk.com',legajo:'11143',ingreso:'10/07/2000',activo:true},
		   {cod:5,apellido:'Perez', nombre:'Juan', fechaNac:'26/07/1985',direccion:'dir juan Perez',telefono:'13333333356',dni:'564434',civil:'Soltero',funcion:'administrativo',email:'ggyhiuhg@kk.com',legajo:'199943',ingreso:'10/07/2000',activo:false},
		   {cod:6,apellido:'García', nombre:'Enzo', fechaNac:'26/07/1995',direccion:'dir enzo garcia',telefono:'13333333356',dni:'564434',civil:'Viudo',funcion:'administrativo',email:'ggmjug@kk.com',legajo:'115543',ingreso:'10/07/2010',activo:true}];
let turnos = [{mes:0,anio:2020,turnos:[
					{persona:1,dia:1,asignacion:'T1'},
					{persona:2,dia:1,asignacion:'T2'},
					{persona:1,dia:7,asignacion:'T3'},
					{persona:2,dia:2,asignacion:'franco'},
					{persona:1,dia:6,asignacion:'T1'},
					{persona:2,dia:10,asignacion:'franco'},
					{persona:3,dia:7,asignacion:'suspension'},
					{persona:3,dia:1,asignacion:'T1'},
					{persona:4,dia:1,asignacion:'T3'}
					]},
					{mes:1,anio:2020,turnos:[
					{persona:1,dia:1,asignacion:'T1'},
					{persona:2,dia:1,asignacion:'T2'},
					{persona:1,dia:7,asignacion:'T3'},
					{persona:2,dia:2,asignacion:'franco'},
					{persona:1,dia:6,asignacion:'T1'},
					{persona:2,dia:10,asignacion:'franco'},
					{persona:3,dia:7,asignacion:'suspension'}
					]}];
let feriados =['02/03/2020','10/01/2020','25/05/2020','01/01/2020','10/02/2020'];
let meses = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
let dias = ['Do','Lu','Ma','Mi','Ju','Vi','Sa'];
let asignaciones=[{valor:'T1', vista:'07/15'},{valor:'T2', vista:'15/23'},{valor:'T3', vista:'23/07'},{valor:'franco', vista:'F'},
	{valor:'suspension', vista:'S'},{valor:'certificado', vista:'C'}]
let turnosActual=[];
let puestos=['playero','administrativo','cajero','encargado'];
////////en una base de datos real habria que ordenar por turno(o por hora1) y por nombre


$(document).ready(function(){

//////////////////////////////////////////////////////ACCIONES EN MENU /////////////////////////////////////////////////////////
//click en btn PERSONAL, oculta las demás secciones y muestra PERSONAL
	$("#btnPersonal").click(function(){
		mostrarPantalla("#personal");
		cargarPersonal();
		cargarPuestos();
		confAccionActual('');
	});
//click en btn TURNOS, oculta las demás secciones y muestra TURNOS
	$("#btnTurnos").click(function(){
		mostrarPantalla("#turnos");
		cargarSelects('#selectMesT','#selectAnioT');
		limitarFeriados($("#selectAnioT").val(),Number($("#selectMesT").val())+1);
		$("#feriados").val("");	
		armarDiagrama($("#selectMesT").val(),$("#selectAnioT").val(),obtTurnos($("#selectMesT").val(),$("#selectAnioT").val(),turnos));
	});
//click en btn DIAGRAMA, oculta las demás secciones y muestra DIAGRAMA
	$("#btnDiagrama").click(function(){
		cargarSelects('#selectMes','#selectAnio');
		var mes=0; var anio=2020;var turnos=[];
		cargarDiagrama($("#selectMes").val(),$("#selectAnio").val(),obtTurnos($("#selectMes").val(),$("#selectAnio").val(),turnos));
		mostrarPantalla("#diagrama");
	});

///////////////////////////////////////////// ACCIONES EN PANTALLA 'PERSONAL' /////////////////////////////////////////////////////////////

//limpia los inputs del formulario  PERSONAL
	$("#btnCancelPersonas").click(function(){
		var id=0;
		if($("#accionPersonal").val()=='ver' || $("#accionPersonal").val()=='nuevo'){
			confAccionActual('');
		}else {
			id=$("#idPersona").val();
			confAccionActual('ver');
			cargarFormPersonal(id);
		}
	});

//click en btn verPERSONAL, carga los datos de persona seleccionada
	$("#tablaPersonal").on('click','.verPersonal',function(){
		if($("#accionPersonal").val()=='editar' || $("#accionPersonal").val()=='nuevo'){
			alert("Para ver los datos seleccionados, finalice o cancele la creación o edición que está realizando.")
		}else{
			var ind=$(".verPersonal").index(this)+1;
			confAccionActual('ver');
			cargarFormPersonal($("#tablaPersonal tr:eq("+ind+") td:eq(0)").data('id'));
		}
	});

//click en 'Imprimir' en pantalla PERSONAL
	$("#btnImpPersonal").click(function(){
		imprSelec('personal');
	});

//guardar datos de PERSONAS
	$("#submitPersonas").click(function(){
		var id=0;
		//chequear que se esté ingresando o modificando y validar datos
		var apellidoOk=validarTexto("#apellido");
		var nombreOk=validarTexto("#nombre");
		var dirOk=validarTexto("#direccion");
		var dniOk=validarDni("#dni");
		var nacOk=validarFecha("#fechaNac",18);
		var ingresoOk =validarFecha("#ingreso",0);
		var civilOk=validarSeleccion("#civil");
		var telOk=validarTexto("#telefono");
		var mailOk=validarTexto("#email");
		var legajoOk=validarTexto("#legajo");
		var funcOk=validarSeleccion("#funcion");
		var activo=$("#activo").prop('checked')==true;
		if(apellidoOk && nombreOk && dirOk && nacOk && ingresoOk && dniOk && civilOk && telOk && mailOk && legajoOk && funcOk){	
			if($("#accionPersonal").val()=='nuevo'){
				datos.push({cod:datos.length+1,apellido:$("#apellido").val(),nombre:$("#nombre").val(),fechaNac:convFecha($("#fechaNac").val()),
							direccion:$("#direccion").val(),telefono:$("#telefono").val(),dni:$("#dni").val(),civil:$("#civil").val(),
							funcion:$("#funcion").val(),email:$("#email").val(),legajo:$("#legajo").val(),ingreso:convFecha($("#ingreso").val()),
							activo:activo});	
				id=datos.length;
				alert("Registro agregado satisfactoriamente");
			}else{
				id=parseInt($("#idPersona").val());
				alert("Los datos se modificaron satisfactoriamente");
				datos[id-1]={cod:id,apellido:$("#apellido").val(),nombre:$("#nombre").val(),fechaNac:convFecha($("#fechaNac").val()),
							direccion:$("#direccion").val(),telefono:$("#telefono").val(),dni:$("#dni").val(),civil:$("#civil").val(),
							funcion:$("#funcion").val(),email:$("#email").val(),legajo:$("#legajo").val(),ingreso:convFecha($("#ingreso").val()),
							activo:activo};
			}
			confAccionActual('ver');
			cargarFormPersonal(id);
			cargarPersonal();
		}else{
			alert("Faltan completar datos");
		}
	});
	
	$("#btnNewPersonas").click(function(){
		confAccionActual('nuevo');
	});

	$("#btnEditPersonas").click(function(){
		confAccionActual('editar');
	});

	$("#filtroPersonal").change(function(){
		filtrarPersonal($(this).val());
	});
/////////////////////////////////////////////// ACCIONES EN PANTALLA 'DIAGRAMA' /////////////////////////////////////////////////////////	
	//click en imprimir en pantalla DIAGRAMA
	$("#btnImpDiagrama").click(function(){
		imprSelec('diagrama');
	});

	//cambio en opciones mes y/o año en pantalla Diagrama
	$("#selectMes, #selectAnio").change(function(){
		cargarDiagrama($("#selectMes").val(),$("#selectAnio").val(),obtTurnos($("#selectMes").val(),$("#selectAnio").val(),turnos));
	});

////////////////////////////////////////// ACCIONES EN PANTALLA 'TURNOS' ////////////////////////////////////////////////////////////	
	
	//cambio en opciones mes y/o año en pantalla TURNOS
	$("#selectMesT, #selectAnioT").change(function(){
		$("#feriados").val("");
		limitarFeriados($("#selectAnioT").val(),Number($("#selectMesT").val())+1);
		armarDiagrama($("#selectMesT").val(),$("#selectAnioT").val(),obtTurnos($("#selectMesT").val(),$("#selectAnioT").val(),turnos));
	});
	
	//click en borrar renglon Turno en pantalla TURNOS
	$("#verTurnos ").on('click','.removeTurno',function(){
		var indice=$("#verTurnos .removeTurno").index(this)+1;
		if(confirm("¿Está seguro que desea eliminar este renglón?")){
			$("#verTurnos table tbody tr:nth-child("+indice+")").remove();
			turnosActual.splice(indice-1,1);
		}
		if($("#verTurnos .removeTurno").length==0){
			addRowTurno($("#selectMesT").val(),$("#selectAnioT").val());
		}
	});

	//click en OK renglon Turno en pantalla TURNOS
	$("#verTurnos ").on('click','.addTurno',function(){
		if($(this).hasClass('unsave')){
			var arrHorario=[];
			var indice=$("#verTurnos .addTurno").index(this)+1;
			if($("#verTurnos table tr:eq("+indice+") select:eq(0)").val()){
				$("#verTurnos table tr:eq("+indice+") select").each(function(i){
					if($(this).val() && i>0){
						arrHorario.push({dia:i,asignacion:$(this).val()});
					}
				});
				if(arrHorario.length>0){
					if(indice==$("#verTurnos .addTurno").length ){
						turnosActual.push({cod:Number($("#verTurnos table tr:eq("+indice+") select:eq(0)").val()),horario:arrHorario});
						addRowTurno($("#selectMesT").val(),$("#selectAnioT").val());
					}else{	
						turnosActual[indice-1]={cod:Number($("#verTurnos table tr:eq("+indice+") select:eq(0)").val()),horario:arrHorario};
					}
					$("#verTurnos table tr:eq("+indice+") .addTurno").removeClass('unsave').addClass('save');
				}
			}
		}
	});

	//cambio en select persona de algun renglon, chequea si la persona esta activa o no
	$("#verTurnos ").on('change','.seleccPersona',function(){
		var indice=$("#verTurnos .seleccPersona").index(this)+1;
		if(estaActivo($(this).val())){
			$("#verTurnos table tr:eq("+indice+")").removeClass('inactivo');
		}
	});
	//confirmacion de guardar turnos
	$("#btnAddTurnos ").click(function(){
		var horario=[], objT={};
		if($("#verTurnos table .unsave").length==1 && turnosActual.length>0){
			if(confirm("Se guardarán los cambios realizados")){
				$.each(turnosActual,function(i,v){
					v.horario.forEach(function(val){
						horario.push({persona:v.cod,dia:val.dia, asignacion:val.asignacion});
					});
				});
				objT={mes:Number($("#selectMesT").val()),anio:Number($("#selectAnioT").val()),turnos:horario};
				if(obIndTurnos($("#selectAnioT").val(),$("#selectMesT").val())!=-1){
					turnos[obIndTurnos($("#selectAnioT").val(),$("#selectMesT").val())]=objT;
				}else{
					turnos.push(objT);
				}																			
			}
		}else{
			alert("Confirme los datos. Cada renglón debe tener personal y al menos una asignacion.");
		}
	});

	//agrega feriados al mes en curso
	$("#btnAddFeriado").click(function(){
		var i=0;
		i=feriados.indexOf(convFecha($("#feriados").val()));
		if($("#feriados").val()){
			if(i==-1){
				feriados.push(convFecha($("#feriados").val()));
			}else{
				alert("Esa fecha ya existe");
			}
			$("#feriados").val('');
		}else{
			alert("Seleccionar una fecha");
		}
		armarDiagrama($("#selectMesT").val(),$("#selectAnioT").val(),obtTurnos($("#selectMesT").val(),$("#selectAnioT").val(),turnos));
	});
	

	//borra feriados del mes un curso
	$("#btnDelFeriado").click(function(){
		var i=0;
		if($("#feriados").val()){
			i=feriados.indexOf(convFecha($("#feriados").val()));
			if(i!=-1){
				feriados.splice(i,1);
			}else{
				alert("Esa fecha no figura como feriado")
			}	
			$("#feriados").val('');
		}else{
			alert("Seleccionar una fecha");
		}
	});

	$("#verTurnos ").on('change','select',function(){
		var indice=$(this).parent().parent().index(); 
		$("#verTurnos table tr .addTurno:eq("+indice+")").removeClass('save').addClass('unsave');
	});
});


////////////////////////////////////////////////////FUNCIONES/////////////////////////////////////////////////////////////////////
 
////**************************funciones exclusivas de pantalla PERSONAL

//carga datos en la tabla PERSONAL
function cargarPersonal(){
	var elem;
	elem="<table class='table table-condensed table-hover'><thead><th>Apellido</th><th>Nombre</th><th>Tel&eacute;fono</th>"+
		 "<th colspan=2>Funci&oacute;n</th></thead><tbody> ";
			$.each(datos,function(i,val){
				elem+="<tr class='";
				if(estaActivo(val.cod)){
					elem+=" activo ";}
				else{
					elem+=" inactivo ";}
				elem+="'><td data-id='"+val.cod+"'>"+val.apellido+"</td><td>"+val.nombre+"</td><td>"+val.telefono+"</td><td>"+val.funcion+
				"</td><td class='fijarDer vacio'><a class='verPersonal'><span class='glyphicon glyphicon-eye-open noImprimir'></span></a></td></tr>";
			});
		
	elem+="</tbody></table> ";
	$("#tablaPersonal").html(elem);
	filtrarPersonal($("#filtroPersonal").val());
}

//filtrar datos de la tabla true=activo, false=inactivo, ''=todos
function filtrarPersonal(filtro){
	switch(filtro){
		case 'true':$("#tablaPersonal .activo").removeClass('oculto');
					$("#tablaPersonal .inactivo").addClass('oculto');
					break;
		case 'false':$("#tablaPersonal .inactivo").removeClass('oculto');
					$("#tablaPersonal  .activo").addClass('oculto');
					break;
		default:$("#tablaPersonal tbody tr").removeClass('oculto');
					break;
	}
}

//según la acción que estoy ejecutando en personal, habilito deshabilito los botones de edicion,guardado y nuevo
function confAccionActual(accion){
	switch(accion){
		case 'ver':limpiarForm();
				    bloquearForm();
					$("#btnEditPersonas, #btnNewPersonas, #btnCancelPersonas").prop('disabled',false);
				    $("#submitPersonas").prop('disabled',true);
				    break;
		case 'editar':desbloquearForm();
					$("#btnNewPersonas, #btnEditPersonas").prop('disabled',true);
					$("#btnCancelPersonas, #submitPersonas").prop('disabled',false);
					break;
		case 'nuevo':limpiarForm();
					desbloquearForm();
					$("#btnEditPersonas, #btnNewPersonas").prop('disabled',true);
					$("#submitPersonas, #btnCancelPersonas").prop('disabled',false);
					break;
		default:limpiarForm();
					bloquearForm();
				    $("#btnNewPersonas").prop('disabled',false);
				    $("#btnEditPersonas, #submitPersonas, #btnCancelPersonas").prop('disabled',true);
				    break;
	}
	$("#accionPersonal").val(accion);
	if(accion==''){
		$("#accion").html('');
	}else{
		$("#accion").html(" ("+accion+")");
	}
	
}

//carga datos del empleado seleccionado en la tabla, en el form Datos Personales
function cargarFormPersonal(id){
	$("#idPersona").val(id);
	$("#apellido").val(datos[id-1].apellido);
	$("#nombre").val(datos[id-1].nombre);
	$("#telefono").val(datos[id-1].telefono);
	$("#direccion").val(datos[id-1].direccion);
	$("#email").val(datos[id-1].email);
	var fecha=datos[id-1].fechaNac.split('/');
	$("#fechaNac").val(fecha[2]+"-"+fecha[1]+"-"+fecha[0]);
	$("#civil").val(datos[id-1].civil);
	$("#dni").val(datos[id-1].dni);
	$("#legajo").val(datos[id-1].legajo);
	var fecha=datos[id-1].ingreso.split('/');
	$("#ingreso").val(fecha[2]+"-"+fecha[1]+"-"+fecha[0]);
	$("#funcion").val(datos[id-1].funcion);
	$("#activo").val(datos[id-1].activo).prop('checked',datos[id-1].activo);
}	

function limpiarForm(){
	$('#formPersonal input, #formPersonal select').val("");
	$("#activo").prop('checked',false);
}

function bloquearForm(){
	$("#formPersonal input, #formPersonal select, #submitPersonas").prop('disabled',true);
}

function desbloquearForm(){
	$("#formPersonal input, #formPersonal select, #submitPersonas").prop('disabled',false);
}
////validación de datos del formulario 'Personal'

 function validarTexto(campo){
 	var ok=true;
 	if($(campo).val().trim()!=''){
		$(campo).parent().parent().addClass('has-success').removeClass('has-error');
	}else{
		$(campo).parent().parent().addClass('has-error').removeClass('has-success');
		ok=false;
	}
	return ok;
 }
 function validarFecha(campo, min){
 	var ok=true;
 	if($(campo).val().trim()!='' && (new Date()-new Date($(campo).val()))/1000/60/60/24/365 > min){
		$(campo).parent().parent().addClass('has-success').removeClass('has-error');
	}else{
		$(campo).parent().parent().addClass('has-error').removeClass('has-success');
		ok=false;
	}
	return ok;
 }
 function validarDni(campo){
 	var ok=true;
 	if($(campo).val().trim()!='' ){
		$(campo).parent().parent().addClass('has-success').removeClass('has-error');
	}else{
		$(campo).parent().parent().addClass('has-error').removeClass('has-success');
		ok=false;
	}
	return ok;
 }
 function validarSeleccion(campo){
 	var ok=true;
 	if($(campo).val() ){
		$(campo).parent().parent().addClass('has-success').removeClass('has-error');
	}else{
		$(campo).parent().parent().addClass('has-error').removeClass('has-success');
		ok=false;
	}
	return ok;
 }
 
////*******************************funciones exclusivas de DIAGRAMA
//ver porque la tabla de armar turnos muestra  1 columna de mas - terminar el update turnos
function cargarDiagrama(mes,anio,turnox){ 
	var personal = [];
	var inicio = new Date(anio,mes).getTime();
	var final = new Date(anio,parseInt(mes)+1,0).getDate();//mes +1 xq los meses son 0-11 y js retrocede a la
	//última fecha válida(el ultimo dia del mes anterior), ya que al pasarle una fecha con día 0, ésta no es válida
	
	var a=[];
	var i,aux;
	var diasFeriados=obtFeriados(Number(mes)+1,anio);
	subtot=[];
	var elem = "<table class='table table-bordered table-condensed table-hover'><caption class='text-center'>"+
		"Diagrama de horarios y francos mes de "+meses[mes]+" "+anio+"</caption><tbody>";
	if(turnox.length==0){
		elem+="<th class='bg-info text-center'>No hay turnos designados para este mes</th></tbody></table>";
	}else{
		elem+="<tr><th scope='row' class='fijarIzq fijarTop bg-info'>Personal</th>";
		for(i=1; i <=final; i++){
			a.push(new Date(inicio));
			subtot.push({T1:0,T2:0,T3:0});
			elem+="<td class='bg-info fijarTop text-center ";
			if(diasFeriados.indexOf(new Date(a[i-1]).getDate())!=-1){
				elem+=" feriadoFondo ";
			}
			elem+="' >"+dias[new Date(a[i-1]).getDay()]+"<br>"+new Date(a[i-1]).getDate()+"</td>";	
			inicio = inicio+(1000*60*60*24);
		}
		elem+="</tr>"
		
		var turnosActual=obtenerTurnos(datos,turnox);
		$.each(turnosActual,function(i,val){
			elem+="<tr><td class='fijarIzq bg-info'>"+datos[val.cod-1].apellido+", "+datos[val.cod-1].nombre+"</td>";
			$.each(a,function(ind,valor){
				aux="<td> </td>";
				$.each(val.horario,function(index,value){	
					if(valor.getDate()==value.dia){
							aux="<td class='text-center "+value.asignacion;
							if(diasFeriados.indexOf(value.dia)!=-1){
								aux+=" feriadoColor ";
							}
							aux+=" '>"+obtVista(value.asignacion)+"</td>";
							switch(value.asignacion){
								case 'T1':subtot[ind].T1++;break;
								case 'T2':subtot[ind].T2++;break;
								case 'T3':subtot[ind].T3++;break;
								default:break;
							}
					}		
				});
				elem+=aux;
			});elem+="</tr>"
		});
		elem+="</tbody><tfoot><tr class='bg-info'><th class='fijarIzq'>Empleados x turno (min)</th>";
		var sub;
		$.each(subtot,function(i,v){
			sub=v.T1;
			if(v.T2<sub){sub=v.T2}
			if(v.T3<sub){sub=v.T3}
			elem+="<td class='text-center'>"+sub+"</td>";
		});

		elem+="</tr></tfoot></table>";
	}
	
	$("#diagramaT").html(elem) ;
	if(turnox.length==0){
		$("#diagramaT table").addClass('sinTurnos');
		$("#btnImpDiagrama").prop('disabled',true);
	}else{
		$("#btnImpDiagrama").prop('disabled',false);
	}	
}


/////*********************************funciones exclusivas de TURNOS
function armarDiagrama(mes,anio,turnox){ 
	var personal = [];
	var inicio = new Date(anio,mes).getTime();
	var final = new Date(anio,parseInt(mes)+1,0).getDate();
	
	var a=[];
	var i,aux;
	var feriados=obtFeriados(Number(mes)+1,anio);
	$("#headTurnos h4 span").html(meses[mes]+" "+anio);
	var elem = "<table class='table table-bordered table-condensed table-hover'><thead>";
	
		elem+="<tr><th scope='row' colspan='3' class='fijarIzq fijarTop bg-info'></th>";
		for(i=1; i <=final; i++){
			a.push(new Date(inicio));
			elem+="<td class='bg-info fijarTop text-center ";
			if(feriados.indexOf(new Date(a[i-1]).getDate())!=-1){elem+=" feriadoFondo ";}
			elem+="' >"+dias[new Date(a[i-1]).getDay()]+"<br>"+new Date(a[i-1]).getDate()+"</td>";	
			inicio = inicio+(1000*60*60*24);
		}
	
	elem+="</tr>";
	elem+="</thead><tbody></tbody></table>";
	$("#verTurnos").html(elem) ;
	turnosActual=obtenerTurnos(datos,turnox);
	$.each(turnosActual,function(i,val){
		addRowTurno(mes,anio,val.cod,val.horario);
	});
	addRowTurno(mes,anio);		
}

function addRowTurno(mes,anio,persona,arrAsignaciones){
 	var emptyRow=(arguments.length<4);
 	var diasAsig=[];
 	var dias = new Date(anio,Number(mes)+1,0).getDate();
 	var elem="";
 	if(emptyRow){
 		elem="<tr><td class='fijarIzq'><a><span class='glyphicon glyphicon-ok addTurno unsave'></span></a></td><td class='fijarIzq'><a>"+
 			"<span class='glyphicon glyphicon-remove removeTurno'></span></a></td><td class='fijarIzq'><select class='seleccPersona'"+
 			"><option disabled selected>Elegir</option>";
	 	$.each(datos,function(ind,val){
	 		if(estaActivo(val.cod)){
			 elem+="<option value="+val.cod+">"+val.apellido+", "+val.nombre+"</option>";
	 		}
		 });
		 elem+="</select></td>";
		 for(var i = 0; i < dias; i++){
	 		elem+="<td><select  date-dia="+i+1+" class='seleccDia'><option selected disabled>Elegir</option>";
	 		$.each(asignaciones,function(ind,value){
	 			elem+="<option value='"+value.valor+"' class='"+value.valor+"'>"+value.vista+"</option>";
	 		});
	 		elem+="</select></td>";
	 	}
	 	elem+="</tr>";
 	}else
	 	{
	 	diasAsig=arrAsignaciones.map(function(v,i){return v.dia}) ;
	 	elem="<tr ";
	 	if(!estaActivo(persona)){ elem+=" class='inactivo' "}
	 	elem+="><td class='fijarIzq'><a ><span class='glyphicon glyphicon-ok addTurno save '></span></a></td><td class='fijarIzq'><a><span class='glyphicon glyphicon-remove removeTurno'></span></a></td><td class='fijarIzq'>"+
	 			"<select class='seleccPersona'><option disabled selected>Elegir</option>";
	 	$.each(datos,function(ind,val){
	 		elem+="<option value="+val.cod;
	 		if(!estaActivo(val.cod)){ elem+=" disabled "}
	 		if(persona==val.cod){ elem+=" selected ";}
	 		elem+=">"+val.apellido+", "+val.nombre+"</option>";
	 	});
	 	elem+="</select></td>";
	 	for(var i = 0; i < dias; i++){
	 		elem+="<td><select  date-dia="+i+1+" class='seleccDia'><option selected disabled>Elegir</option>";
	 		var pos=diasAsig.indexOf(i+1);
	 		$.each(asignaciones,function(ind,value){
	 			elem+="<option value='"+value.valor+"'";
	  			if(diasAsig[pos]==i+1 && value.valor==arrAsignaciones[pos].asignacion){
	  				elem+=" selected";
	  			}
	 			elem+=" class='"+value.valor+"'>"+value.vista+"</option>";
	 		});
	 		elem+="</select></td>";

	 	}
	 	elem+="</tr>";
	 }
 	$("#verTurnos tbody").append(elem);
 }

 function obIndTurnos(anio,mes){
 	var ind=-1;
 	$.each(turnos,function(i,val){
 		if(val.anio==anio && val.mes==mes){
 			ind=i;
 		}
 	});
 	return Number(ind);
 }


 function limitarFeriados(a,m){
 	$("#feriados").prop('min',convFechaISO(a,m,1))
				  .prop('max',convFechaISO(a,m, new Date(a,m,0).getDate()));
 }
////************************************ funciones varias
function obtTurnos(mes,anio,arr){
	var arrturnos=[];
	$.each(arr,function(i,val){
			if(val.mes==mes && val.anio==anio){arrturnos=val.turnos}
		});
	return arrturnos;
}

function obtenerTurnos(d,t){
	var arr=[], horas=[];
	$.each(d,function(i,val){
		horas=[];
		$.each(t,function(ii,value){
			if(value.persona==val.cod){
				horas.push({dia:value.dia,asignacion:value.asignacion});
			}
		});
		if(horas.length>0){
			arr.push({cod:val.cod,horario:horas})
		};
	});

	return arr;
}

function convFecha(fecha){
	var f = fecha.split("-");

	return  f[2]+"/"+f[1]+"/"+f[0];
}

function convFechaISO(a,m,d){
	if(m<10){
		m="0"+m;
	}
	if(d<10){
		d="0"+d;
	}
	return a+"-"+m+"-"+d;
}

function obtVista(asig){
	var arr=asignaciones.filter(function(v,i,a){
		return v.valor==asig;
	});
	return arr[0].vista;
}

function cargarSelects(listaMes,listaAnio,antes,despues){
	var elem="";
	$.each(meses,function(i,val){
		elem+="<option value='"+i+"' >"+val+"</option>";
	});

	$(listaMes).html(elem).val(new Date().getMonth());

	elem="";//va a dar de opcion 5 años al futuro y 5 al pasado
	var actual=new Date().getFullYear();
	for(var i=-5; i<5;i++){
		elem+="<option value='"+parseInt(actual+i)+"'>"+parseInt(actual+i)+"</option>";
	}

	$(listaAnio).html(elem).val(new Date().getFullYear());
}


function imprSelec(nombre) {
	/*  var ficha = document.getElementById(nombre);
	  var ventimp = window.open(' ', 'popimpr');
	  ventimp.document.write( ficha.innerHTML );
	  ventimp.document.close();
	  ventimp.print( );
	  ventimp.close();

     var contenido= document.getElementById(nombre).innerHTML;
     var contenidoOriginal= document.body.innerHTML;

     document.body.innerHTML = contenido;*/
     $(".seccion").prop('hidden',true);
     $("#"+nombre).prop('hidden',false);
     window.print();
     $(".seccion").prop('hidden',false);
     //document.body.innerHTML = contenidoOriginal;
}
	

function obtFeriados(m,a){
	var arr=[];
	$.each(feriados,function(i,val){
		var f=val.split("/");
		if(Number(f[2])==Number(a) && Number(f[1])==Number(m)){
			arr.push(Number(f[0]));
		}
	});
	return arr;
}
 

function estaActivo(persona){
 	return datos[persona-1].activo;
}

function cargarPuestos(){
	var elem="<option disabled selected value=''>Elegir</option>";
	$.each(puestos,function(i,val){
		elem+="<option value='"+val+"'>"+val+"</option>";
	});
	$("#funcion").append(elem);
}

function mostrarPantalla(pantalla){
	$('.seccion').addClass('oculto');
	$(pantalla).removeClass('oculto');
}