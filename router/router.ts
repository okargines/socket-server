
import {Router, Request, Response} from 'express';
import Server from '../classes/server';

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



export default router;