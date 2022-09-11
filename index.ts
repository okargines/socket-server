// const nombre= 'Alberto';
// console.log(`Mi nombre es ${nombre}`);


import Server from './classes/server';
import router from './router/router';
import bodyParser from 'body-parser';
import cors from 'cors';

//import { SERVER_PORT } from './global/environment';


const server = new Server();

//BodyParser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

//CORS
// const issue2options = {
//     origin: true,
//     methods: ["POST"],
//     credentials: true,
//     maxAge: 3600
//   };
server.app.use( cors({origin:true, credentials:true}) );  //{origin:true, credentials:true}


//rutas de servicios
//Habilitacio de Rutas pra ser usdos desde FE
server.app.use('/', router);


server.start(()=>{
    //console.log(`Servidor corriendo en el puert ${SERVER_PORT}`);
    console.log(`Servidor corriendo en el puert ${server.port}`);
}) 
 