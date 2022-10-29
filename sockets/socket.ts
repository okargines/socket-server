import { Socket } from "socket.io";
import socketIO  from "socket.io";
import { UsuariosLista } from "../classes/usuarios-lista";
import { Usuario } from "../classes/usuario";

export const usuariosConectados = new UsuariosLista;

export const conectarCliente = (cliente:Socket,  io: socketIO.Server)=>{
    const usuario = new Usuario (cliente.id);
    usuariosConectados.agregar(usuario);
    
    //io.emit('usuarios-activos', usuariosConectados.getLista());

}

//cuanod se quiera enviar algo a todos los auasuiuors
//se debe utilizar la instacion de socket.io
export const desconectar = (cliente:Socket, io: socketIO.Server )=> {
    cliente.on('disconnect', ()=>{
        console.log('Cliente desconectado - BE - socketLogica');
        
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());

    });
}


export const mensaje = (cliente:Socket, io:socketIO.Server )=> {
    cliente.on('mensaje', (payload:{de:string, cuerpo:string})=>{
        //console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);
    });
}

export const configurarUsuario = (cliente:Socket, io:socketIO.Server )=> {
    
    cliente.on('configurar-usuario', 
        ( payload:{nombre:string}, callback:Function )=>{
        
            usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
            
            io.emit('usuarios-activos', usuariosConectados.getLista());

            callback({
                ok:true,
                mensaje: `usuario ${payload.nombre}, configurado`
            });

        });
}
 
//obtener usuarios
export const obtenerUsuarios = (cliente:Socket, io:socketIO.Server )=> {
    
    cliente.on('obtener-usuarios', () =>{
        //Para enviar a todos los clientes  conectados
        //io.emit('usuarios-activos', usuariosConectados.getLista());

        //Pero se quiere enviar a solo al cliente q acaba de entrar al chat
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());


    });
}
 