const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const adminEstudiantes= require('./helpers/estudiantes');
require('./helpers/helpers');
require('./helpers/cursos');
const estudiante = [];

const directorioPublico = path.join(__dirname, '../Public');
const directorioListadoCursos = path.join(__dirname, '/listadoCursos.json');
const directorioListadoEstudiantes = path.join(__dirname, '/listadoEstudiantes.json');
const directorioListadoInscritos = path.join(__dirname, '/listadoInscritos.json');
const directioPartial = path.join(__dirname, '../template/Partials');
const directorioBootstrap = path.join(__dirname, '../node_modules/bootstrap/dist/css');
const directorioJSBootstrap = path.join(__dirname, '../node_modules/bootstrap/dist/js');
const directorioJquery = path.join(__dirname, '../node_modules/jquery/dist');
const directorioPopper = path.join(__dirname, '../node_modules/popper.js/dist');


app.use(express.static(directorioPublico));
app.use('/bootstrap', express.static(directorioBootstrap));
app.use('/bootstrapjs', express.static(directorioJSBootstrap));
app.use('/jquery', express.static(directorioJquery));
app.use('/popper', express.static(directorioPopper));
app.use(bodyParser.urlencoded({extended:false}));

hbs.registerPartials(directioPartial);


app.set('view engine', 'hbs');

app.get('', (req, res) => {
	if (!fs.existsSync(directorioListadoCursos)) {
		fs.writeFile('./src/listadoCursos.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	if (!fs.existsSync(directorioListadoEstudiantes)) {
		fs.writeFile('./src/listadoEstudiantes.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	if (!fs.existsSync(directorioListadoInscritos)) {
		fs.writeFile('./src/listadoInscritos.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	res.render('../template/views/Login', {

	});
})

app.post('/calculos', (req,res) => {
	res.render('../template/views/calculos', {
		estudiante: req.body.nombre,
		nota1: parseInt(req.body.nota1),
		nota2: parseInt(req.body.nota2), 
		nota3 : parseInt(req.body.nota3)
	});
})

app.get('/CursoCreado', (req,res) => {
	console.log(estudiante);
	if (!fs.existsSync(directorioListadoCursos)) {
		fs.writeFile('./src/listadoCursos.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	res.render('../template/views/CrearCurso', {
		admin: estudiante.admin
	});
})

app.post('/CursoCreado', (req,res) => {
	let listaCursos = require('./listadoCursos.json');
	let duplicado = listaCursos.find(x => x.id ==  parseInt(req.body.id));
	if(!duplicado ){
		res.render('../template/views/CursoCreado', {
			id: parseInt(req.body.id),
			nombre: req.body.nombre,
			modalidad : req.body.modalidad,
			valor: parseInt(req.body.valor),
			intensidad : req.body.intensidad,
			estado : "Activo",
			descripcion : req.body.descripcion,
			admin: estudiante.admin
		});
	}
	else{
		res.render('../template/views/CursoCreadoError', {
			id: parseInt(req.body.id),
			nombre: req.body.nombre,
			admin: estudiante.admin

		});
	}
})



app.get('/VerCursos', (req,res) => {
	var filename = path.resolve(directorioListadoCursos);
	delete require.cache[filename];
	res.render('../template/views/VerCursos', {
		admin: estudiante.admin
	});
})


app.get('/VerInscritos', (req,res) => {
	res.render('../template/views/ListarInscritos', {
		admin: estudiante.admin
	});
})

app.get('/Inscripcion', (req,res) => {
	if (!fs.existsSync(directorioListadoEstudiantes)) {
		fs.writeFile('./src/listadoEstudiantes.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	if (!fs.existsSync(directorioListadoInscritos)) {
		fs.writeFile('./src/listadoInscritos.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	res.render('../template/views/Inscripcion', {
		admin: estudiante.admin,
		nombre: estudiante.nombre, 
		id: estudiante.id,
		telefono: estudiante.telefono,
		email: estudiante.email,
		rol: estudiante.rol,
	});
})

app.post('/EstudianteInscrito', (req,res) => {
	var filename = path.resolve(directorioListadoInscritos);
	delete require.cache[filename];
	let listaEstudiantesCursos = require('./listadoInscritos.json');
	let duplicado = listaEstudiantesCursos.find(x => x.estudiante ==  parseInt(estudiante.id) && x.curso == parseInt(req.body.curso));
	if(!duplicado ){
		res.render('../template/views/EstudianteInscrito', {
			id: parseInt(estudiante.id),
			nombre: estudiante.nombre,
			telefono: parseInt(estudiante.telefono),
			email: estudiante.email,
			curso: parseInt(req.body.curso),
			admin: estudiante.admin
		});
	}
	else{
		res.render('../template/views/EstudianteInscritoError', {
			id: parseInt(req.body.id),
			nombre: req.body.nombre,
			admin: estudiante.admin
		});
	}
})

app.post('/EliminarInscrito', (req,res) => {
	if(estudiante.admin)
	{
		res.render('../template/views/ListarInscritos', {
			estudiante: parseInt(req.body.EstudianteId),
			curso: parseInt(req.body.cursoId),
			admin: estudiante.admin
		});
	}
	else{
		res.render('../template/views/ListarCursosInscrito', {
			id: parseInt(estudiante.id),
			curso: parseInt(req.body.cursoId),
			admin: estudiante.admin
		});
	}
})

app.post('/ActualizarEstado', (req,res) => {
	res.render('../template/views/VerCursos', {
		curso: parseInt(req.body.curso),
		admin: estudiante.admin
	});
})

app.post('/Login', (req,res) => {
	var filename = path.resolve(directorioListadoEstudiantes);
	delete require.cache[filename];
	let listaEstudiantes = require('./listadoEstudiantes.json');
	let duplicado = listaEstudiantes.find(x => x.id ==  parseInt(req.body.id));
	if(duplicado ){
		let rol = duplicado.rol;// listaEstudiantes.find(x => x.id ==  parseInt(req.body.id))[0].rol;
		if(rol == 'aspirante'){
			estudiante.nombre= duplicado.nombre;
			estudiante.id= duplicado.id;
			estudiante.telefono= duplicado.telefono;
			estudiante.email= duplicado.email;
			estudiante.rol= duplicado.rol;
			estudiante.admin= false;
			res.render('../template/views/VerCursos', {
				admin: false
			});
		}
		else{
			estudiante.nombre= duplicado.nombre;
			estudiante.id= duplicado.id;
			estudiante.telefono= duplicado.telefono;
			estudiante.email= duplicado.email;
			estudiante.rol= duplicado.rol;
			estudiante.admin= true;
			res.render('../template/views/VerCursos', {
				admin: true
			});
		}
	}
	else{
		res.render('../template/views/Login', {
			
		});
	}
})

app.get('/Login', (req, res) => {
	if (!fs.existsSync(directorioListadoCursos)) {
		fs.writeFile('./src/listadoCursos.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	if (!fs.existsSync(directorioListadoEstudiantes)) {
		fs.writeFile('./src/listadoEstudiantes.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	if (!fs.existsSync(directorioListadoInscritos)) {
		fs.writeFile('./src/listadoInscritos.json', '[]', (err)=>{
			if(err) throw (err);
			console.log('Archivo creado con exito');
		})
	}
	res.render('../template/views/Login', {
	});
})

app.post('/Registro', (req,res) => {
	var filename = path.resolve(directorioListadoEstudiantes);
	delete require.cache[filename];
	let listaEstudiantesCursos = require('./listadoEstudiantes.json');
	let duplicado = listaEstudiantesCursos.find(x => x.id ==  parseInt(req.body.id));
	if(!duplicado ){
		res.render('../template/views/Login', {
			id: req.body.id,
			nombre: req.body.nombre,
			telefono: req.body.telefono,
			email: req.body.email
		});
	}
	else{
		res.render('../template/views/Registro', {
			id: req.body.id
		});
	}
})

app.get('/Registro', (req, res) => {
	
	res.render('../template/views/Registro', {
	});
})

app.get('/ListarCursosInscrito', (req, res) => {
	
	res.render('../template/views/ListarCursosInscrito', {
		admin: estudiante.admin,
		id: estudiante.id
	});
})

app.get('/ListarUsuarios', (req, res) => {
	
	res.render('../template/views/ListarUsuarios', {
		admin: estudiante.admin,
		id: req.body.id,
		nombre: req.body.nombre,
		telefono: req.body.telefono,
		email: req.body.email,
		rol: req.body.rol
	});
})

app.post('/ListarUsuarios', (req, res) => {
	var filename = path.resolve(directorioListadoEstudiantes);
	delete require.cache[filename];
	let listaEstudiantes = require('./listadoEstudiantes.json');
	let duplicado = listaEstudiantes.find(x => x.id ==  parseInt(req.body.id));
	console.log(parseInt(req.body.id));
	res.render('../template/views/ActualizarUsuario', {
		admin: estudiante.admin,
		id: req.body.id,
		nombre: duplicado.nombre,
		telefono: duplicado.telefono,
		email: duplicado.email,
		rol: duplicado.rol
	});
})


app.post('/ActualizarUsuario', (req,res) => {
	res.render('../template/views/ListarUsuarios', {
		id: req.body.id,
		nombre: req.body.nombre,
		telefono: req.body.telefono,
		email: req.body.email,
		admin: estudiante.admin,
		rol: req.body.rol
	});
})

app.get('/index', (req, res) => {
	
	res.render('../template/views/index', {
		admin: estudiante.admin
	});
})


app.get('/EliminarInscrito', (req, res) => {
	
	res.render('../template/views/ListarInscritos', {
		admin: estudiante.admin,
		id: estudiante.id
	});
})


app.get('*', (req,res) => {
	res.render('../template/views/index', {
		estudiante: 'error'
	});
})



app.listen(3000, () => { 
	console.log('Escuchando el puerto 3000');
})