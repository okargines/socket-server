
import {Router, Request, Response} from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

const router = Router();


router.get ('/mensajes', (req: Request, res:Response)=>{
    //***/
    //Cuando se envia Parametros
    const cuerpo = req.query.cuerpo;
    res.json({
        ok:true,
        mensaje: 'Todo esta bien!!',
        cuerpo
    });
    
    /***/
    //Cuando no se envia parameytros
    // res.json({
    //     ok:true,
    //     mensaje: 'Todo esta bien!!'
    // });

});

router.post ('/mensajes', (req: Request, res:Response)=>{
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    
    const payload = {cuerpo, de}

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload);  //para todos
    //server.io.in(id).emit('mensaje-privado', payload);  //para uno

    res.json({
        ok:true,
        mensaje: 'POST - Listo',
        cuerpo,
        de
    });
});

router.post ('/mensajes/:id', (req: Request, res:Response)=>{
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo,
        id
    };

    //es un singleton y es la misma instancia de node
    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok:true,
        cuerpo,
        de,
        id
    });
});

//Servicios para ontner todos los IDs de lkos usuaropsa
router.get('/usuarios',(req: Request, res: Response)=>{
    const server = Server.instance;
    server.io.fetchSockets().then( sockets => {
        //1. forma (usando foreach)
        //const clients: Object[] = [];
        //sockets.forEach(socket =>clients.push(socket.id));

        //2. forma (usando operador Spreat) - No funciono
        //const clients = [...sockets];

        //3. forma (usando operador map)
        const clients = sockets.map( client => client.id)

        res.json({
            ok: true, 
            clients
        })
    }).catch(error => {
        res.json({
            ok: false, 
            error
        })
    })
});
      

//Obtener usurios y sus nombre
router.get('/usuarios/detalle',(req: Request, res: Response)=>{
    
    res.json({
        ok: true, 
        clientes: usuariosConectados.getLista()
    });

});

export default router;
