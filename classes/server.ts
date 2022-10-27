import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

//De esta manera se invoca directamente desde los metodos
//No es necesario Importar la logica socket en el CONSTRUCTOR.
import * as socket from '../sockets/socket';



export default class Server{

    //Esta variable se declara statica para q pueda ser llamda desde la clase Server. ejemplo (Server._instance).
    
    private static _instance: Server;

    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;




    private constructor ( ){
        this.app = express();
        this.port = SERVER_PORT;

        //necesita revisar ala concestion ene ste momento
        //no son cpompatibles directsamentes
        //por esos usaremoms la calse HTTP 
        //en teporia se va a levantar la variable
        // httpServer y no la variable app "..del expres"
        
        this.httpServer = new http.Server(this.app);

        //Seria Ideal Asi ..pero como etms usando HTTP
        //this.io = socketIO(this.app);  

        //1. Asociando HTTP con IO
        //this.io = socketIO(this.httpServer);
        //this.io = new socketIO.Server(this.httpServer);
        
        //2. Otra forma de asociar HTTP con IO
        this.io = new socketIO.Server(this.httpServer,{cors:{ origin:true, credentials:true}});

        this.escucharSockets();

    }
 
    public static get instance(){

        return this._instance || (this._instance = new this())
    }   
 

    //crear metodo para esciucharsocket
    private escucharSockets(){
        console.log('Escuchando conexiones sockets - BE');

        this.io.on('connection', cliente => {
            console.log('Nuevo Cliente conectado - BE');

            /**
             *Ahora le decimps a escucharsockets tambien debe estar pendiente del mensaje
            **/
            socket.mensaje(cliente, this.io);   

            /**
            Para detectar que un Cliente/Usuario se desconecta del servidor..
            **/
            //01 Forma - codigo lineal
            // cliente.on('disconnect', ()=>{
            //     console.log('Cliente desconectado - BE');
            // })

            //02 forma - Refactorizando Logica - usando un achivo q agrupa la logica del socket.
            socket.desconectar(cliente);

        });

    }

    start (callback:any){
        //Para levantar un servidor Express : (listen)
        
        //esta line es para levantar el  server con EXPRESS
        //this.app.listen ( this.port , callback);

        //Pero ahora se va a levantar con HTTP para integrar con soket.io
        this.httpServer.listen ( this.port , callback);


    }
}