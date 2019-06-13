const hbs = require('hbs');
const adminCursos= require('./cursos');
const adminInscritos= require('./inscritos');
const adminEstudiantes= require('./estudiantes');
const fs = require('fs');
const path = require('path');

hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
	return (nota1 + nota2 + nota3)/3;
})

hbs.registerHelper('CrearCurso', (id, nombre, modalidad, valor, intensidad, estado, descripcion) => {
	let cur = {
		id : id,
		nombre : nombre,
		modalidad : modalidad,
		valor : valor,
		descripcion : descripcion,
		intensidad : intensidad,
		estado : estado
	};
	return adminCursos.crear(cur);
})


hbs.registerHelper('ListarCursos', () => {
	/*let directorioListado = path.join(__dirname, '../listadoCursos.json');
	listaCursos = JSON.parse(fs.readFileSync(directorioListado));*/
	listaCursos = require('../listadoCursos.json');

	let texto = "<table class='table table-hover'> \
	<thead class='thead-dark'> \
	<th> Id </th> \
	<th> Nombre </th> \
	<th> Descripción </th> \
	<th> Valor </th> \
	<th> Modalidad </th> \
	<th> Intensidad </th> \
	<th> Estado </th> \
	</thead> \
	<tbody>";
	listaCursos.forEach(curso => {
		texto = texto + 
		'<tr>' +
		'<td>' + curso.id + '</td>' +
		'<td>' + curso.nombre + '</td>' + 
		'<td>' + curso.descripcion + '</td>' +
		'<td>' + curso.valor + '</td>' +
		'<td>' + curso.modalidad + '</td>' +
		'<td>' + curso.intensidad + '</td>' +
		'<td>' + curso.estado + '</td>' +
		'</tr>';


	})
	texto = texto + '</tbody></table>';
	return texto;
})

hbs.registerHelper('ListarCursosEstudiante', () => {
	listaCursos = require('../listadoCursos.json');
	listaCursos = listaCursos.filter(x => x.estado == "Activo");
	i = 1;
	let texto = "<table class='table table-hover'> \
	<thead class='thead-dark'> \
	<th> Id </th> \
	<th> Nombre </th> \
	<th> Descripción </th> \
	<th> Valor </th> \
	</thead> \
	<tbody>";
	listaCursos.forEach(curso => {
		texto = texto +
		`
		<tr data-toggle="collapse" data-target="#collapse${i}" class="clickable" aria-controls="collapse${i}">
		<td> ${curso.id} </td>
		<td> ${curso.nombre} </td>
		<td> ${curso.descripcion} </td>
		<td> ${curso.valor} </td>
		</tr>
		<tr id="collapse${i}" class="collapse" aria-labelledby="heading${i}">
		<td colspan="4">
		<div style="white-space: pre-wrap;">
		Modalidad = ${curso.modalidad} 
		Estado  = ${curso.estado}
		Intensidad horaria = ${curso.intensidad}
		</div>
		</td>
		</tr>
		`;

		i = i+1;
	})
	texto = texto + '</tbody></table>';
	return texto;
})

hbs.registerHelper('InscribirEstudiante', (id, nombre, telefono, email, curso) => {
	let estudiante = {
		id : id,
		nombre : nombre,
		telefono: telefono, 
		email: email
	};
	let estudianteCurso = {
		estudiante: id, 
		curso: curso
	}

	adminInscritos.crearEstudiante(estudiante, estudianteCurso);
})

hbs.registerHelper('ListarInscritosCurso', (curso) => {
	/*let directorioListado = path.join(__dirname, '../listadoCursos.json');
	listaCursos = JSON.parse(fs.readFileSync(directorioListado));*/
	listaInscritos = require('../listadoInscritos.json');
	listaEstudianes = require('../listadoEstudiantes.json');
	listaCursos = require('../listadoCursos.json');

	if(curso != null){
		listaInscritos = listaInscritos.filter(x => x.curso == curso)
	}

	let texto = "<table class='table table-hover'> \
	<thead class='thead-dark'> \
	<th> Id Curso </th> \
	<th> Nombre Curso </th> \
	<th> Id Estudiante </th> \
	<th> Nombre Estudiante </th> \
	</thead> \
	<tbody>";
	listaInscritos.forEach(inscrito => {
		let curso = listaCursos.filter(x => x.id == inscrito.curso);
		let estudiante = listaEstudianes.filter(x => x.id == inscrito.estudiante)
		texto = texto + 
		'<tr>' +
		'<td>' + curso[0].id + '</td>' +
		'<td>' + curso[0].nombre + '</td>' + 
		'<td>' + estudiante[0].id + '</td>' +
		'<td>' + estudiante[0].nombre + '</td>' +
		'</tr>';


	})
	texto = texto + '</tbody></table>';
	return texto;
})

hbs.registerHelper('ListarCursosDropdown', (activos) => {
	/*let directorioListado = path.join(__dirname, '../listadoCursos.json');
	listaCursos = JSON.parse(fs.readFileSync(directorioListado));*/
	listaCursos = require('../listadoCursos.json');
	if(activos == 'activos'){
		listaCursos = listaCursos.filter(x => x.estado == "Activo");
	}
	let texto = `<select  class="form-control" name="curso" id="curso" required>
	<option value="">-</option>
	`;
	listaCursos.forEach(curso => {
		texto = texto + 
		`<option value="${curso.id}">${curso.nombre}</option>`;
	})
	texto = texto + '</select>';
	return texto;
})

hbs.registerHelper('ListarInscritos', () => {
	var filename = path.resolve(path.join(__dirname, '../listadoInscritos.json'));
	delete require.cache[filename];
	listaInscritos = require('../listadoInscritos.json');
	listaEstudianes = require('../listadoEstudiantes.json');
	listaCursos = require('../listadoCursos.json');
	listaCursos = listaCursos.filter(x => x.estado == "Activo");
	let texto = "<div class='accordion' id='accordionExample'>";
	let listaInscritosFiltrada = [];
	i = 1;
	j=1;
	listaCursos.forEach(curso => {
		listaInscritosFiltrada = listaInscritos.filter(x => x.curso == curso.id)
		texto = texto + 
		`<div class="card"> 
		<div class="card-header" id="heading${i}">
		<h2 class="mb-0">
		<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
		${curso.nombre}
		</button>
		</h2>
		</div>

		<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">\
		<div class="card-body">
		<div class="form-row form-dark">
		<div class="col">
		<label>Id</label>
		</div>
		<div class="col">
		<label>Nombre</label>
		</div>
		<div class="col">
		<label>Telefono</label>
		</div>
		<div class="col">
		<label>Email</label>
		</div>
		<div class="col">
		<label>Eliminar</label>
		</div>
		</div>

		`;
		listaInscritosFiltrada.forEach(inscrito => {
			let estudiante = listaEstudianes.filter(x => x.id == inscrito.estudiante)
			texto = texto + ` <form action="/EliminarInscrito" method="post"> 
			<div class="form-row" style="padding-top: 10px;">
			<div class="col">
			<label>${estudiante[0].id}</label>
			<input style="visibility:hidden" type="number" class="form-control" name="EstudianteId" value="${estudiante[0].id}">
			<input style="visibility:hidden" type="number" class="form-control" name="cursoId" value="${curso.id}">
			</div>
			<div class="col">
			<label for="Id">${estudiante[0].nombre}</label>
			</div>
			<div class="col">
			<label for="Id">${estudiante[0].telefono}</label>
			</div>
			<div class="col">
			<label for="Id">${estudiante[0].email}</label>
			</div>
			<div class="col">
			<button type="submit" class="btn btn-primary">Eliminar</button>
			</div>
			</div>
			</form>
			`;
			j = j+1;
		});

		texto = texto +`  </tbody></table>  </div> 
		</div>
		</div>`;
		i = i+1;

	})
	texto = texto + '</div>';
	return texto;
})

hbs.registerHelper('EliminadoInscritos', (estudiante, curso) => {
	if(estudiante != null && curso != null )
	{
		adminInscritos.eliminarInscrito(estudiante, curso);

		return `<div class="alert alert-danger" role="alert">
		El estudiante fue eliminado
		</div>`;
	}
})

hbs.registerHelper('ActualizadoCurso', (curso) => {
	if(curso != null )
	{
		adminCursos.actualizarEstado(curso);

		return `<div class="alert alert-danger" role="alert">
		El curso fue actualizado
		</div>`;
	}
})

hbs.registerHelper('EstudianteDuplicado', (id) => {
	if(id != null)
		return 'El id ' + id + ' ya existe ';
	else
		return '';
})

hbs.registerHelper('CrearEstudiante', (id, nombre, telefono, email) => {
	let est = {
		id : id,
		nombre : nombre,
		telefono : telefono,
		email : email
	};
	if(id != null)
		return adminEstudiantes.crear(est);
	else
		return '';
})

hbs.registerHelper('ListarCursosInscrito', (id) => {
	var filename = path.resolve(path.join(__dirname, '../listadoInscritos.json'));
	delete require.cache[filename];
	listaInscritos = require('../listadoInscritos.json');
	listaEstudianes = require('../listadoEstudiantes.json');
	listaCursos = require('../listadoCursos.json');
	listaCursos = listaCursos.filter(x => x.estado == "Activo");
	let listaInscritosFiltrada = listaInscritos.filter(x => x.estudiante == id);
	console.log(id);
	j=1;
	let texto = `<div class="form-row form-dark">
	<div class="col">
	<label>Id</label>
	</div>
	<div class="col">
	<label>Nombre</label>
	</div>
	<div class="col">
	<label>Valor</label>
	</div>
	<div class="col">
	<label>Eliminar</label>
	</div>
	</div>`;
	listaInscritosFiltrada.forEach(inscrito => {
		let curso = listaCursos.filter(x => x.id == inscrito.curso)
		texto = texto + ` <form action="/EliminarInscrito" method="post"> 
		<div class="form-row" style="padding-top: 10px;">
		<div class="col">
		<label>${curso[0].id}</label>
		<input style="visibility:hidden" type="number" class="form-control" name="cursoId" value="${curso[0].id}">
		</div>
		<div class="col">
		<label for="Id">${curso[0].nombre}</label>
		</div>
		<div class="col">
		<label for="Id">${curso[0].valor}</label>
		</div>
		<div class="col">
		<button type="submit" class="btn btn-primary">Eliminar</button>
		</div>
		</div>
		</form>
		`;
		j = j+1;
	});
	texto = texto + '</div>';
	return texto;
})

hbs.registerHelper('ListarUsuarios', (id) => {
	var filename = path.resolve(path.join(__dirname, '../listadoEstudiantes.json'));
	delete require.cache[filename];
	listaEstudiantes = require('../listadoEstudiantes.json');
	//listaEstudianes = listaEstudianes.filter(x => x.id != id);
	j=1;
	let texto = `<div class="form-row form-dark">
	<div class="col">
	<label>Id</label>
	</div>
	<div class="col">
	<label>Nombre</label>
	</div>
	<div class="col">
	<label>Telefono</label>
	</div>
	<div class="col">
	<label>Email</label>
	</div>
	<div class="col">
	<label>Actualizar</label>
	</div>
	</div>`;
	listaEstudiantes.forEach(user => {
		texto = texto + ` <form action="/ListarUsuarios" method="post"> 
		<div class="form-row" style="padding-top: 10px;">
		<div class="col" style="display:inline-flex">
		<input style="visibility:hidden; height:0px; width:0px" type="number" class="form-control" name="id" value="${user.id}">
		<label for="Id">${user.id}</label>
		</div>
		<div class="col">
		<label for="Id">${user.nombre}</label>
		</div>
		<div class="col">
		<label for="Id">${user.telefono}</label>
		</div>
		<div class="col">
		<label for="Id">${user.email}</label>
		</div>
		<div class="col">
		<button type="submit" class="btn btn-primary">Actualizar</button>
		</div>
		</div>
		</form>
		`;
		j = j+1;
	});
	texto = texto + '</div>';
	return texto;
})

hbs.registerHelper('ListarRolesDropdown', (rol) => {

	let texto = `<select  class="form-control" name="rol" id="curso" required>
	<option value="">-</option>
	`;
	if(rol == 'aspirante'){
		texto = texto + `<option selected value="aspirante">Aspirante</option>
		<option value="coordinador">Coordinador</option>`;
	}
	else
	{
		texto = texto + `<option value="aspirante">Aspirante</option>
		<option selected  value="coordinador">Coordinador</option>`;
	}
	texto = texto + '</select>';
	return texto;
})

hbs.registerHelper('ActualizadoUsuario', (id, nombre, telefono, email, rol) => {
	
	if(id != null && nombre != null)
	{
		estudiante = {
			id: id,
			nombre: nombre,
			telefono: telefono,
			email: email,
			rol: rol
		};
		adminEstudiantes.actualizar(estudiante);

		return `<div class="alert alert-danger" role="alert">
		El usuario fue actualizado
		</div>`;
	}
})






