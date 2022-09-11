
import {Router, Request, Response} from 'express';

const router = Router();


router.get ('/mensajes', (req: Request, res:Response)=>{
    //Cuando se envia Parametros
    // const cuerpo = req.query.cuerpo;
    // res.json({
    //     ok:true,
    //     mensaje: 'Todo esta bien!!',
    //     cuerpo
    // });

    //Cuando no se envia parameytros
    const cuerpo = req.query.cuerpo;
    res.json({
        ok:true,
        mensaje: 'Todo esta bien!!'
    });

});

router.post ('/mensajes', (req: Request, res:Response)=>{
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
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

    res.json({
        ok:true,
        cuerpo,
        de,
        id
    });
});



export default router;