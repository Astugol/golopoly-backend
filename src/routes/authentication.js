const Router = require('koa-router');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

router.post("authentication.signup", "/signup", async (ctx) => {
    const authInfo = ctx.request.body;
    let user = await ctx.orm.User.findOne({ where: {mail: authInfo.email} })
    if (user) {
         ctx.body = `El usuario cuyo email es '${authInfo.email}' ya existe`
         ctx.status = 400;
         return;
    }
    try {
        user = await ctx.orm.User.create({
            username: authInfo.username,
            password: authInfo.password,
            mail: authInfo.email
            
        })
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
    ctx.body = {
        username: user.username,
        email: user.mail
    };
    ctx.status = 201
})

router.post("authentication.login", "/login", async (ctx) => {
    let user;
    const authInfo = ctx.request.body
    try {
        user = await ctx.orm.User.findOne({where:{mail:authInfo.email}})
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
    if (!user) {
        ctx.body = `El usuario de correo '${authInfo.email}' no fue encontrado`;
        ctx.status = 400;
        return;
    }
    if (user.password == authInfo.password) {
        ctx.body = {
            username: user.username,
            email: user.mail
        };
        ctx.status = 200;
    } else {
        ctx.body = 'Contraseña incorrecta';
        ctx.status = 400;
        return;
    }

    // Creamos el JWT. Si quisieramos agregar distintos scopes, como por ejemplo
    // "admin", podríamos hacer un llamado a la base de datos y cambiar el payload
    // en base a esto.

    const expirationSeconds = 1 * 60 * 60 * 24;
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
    var token = jwt.sign(
        { scope: ['user'] },
        JWT_PRIVATE_KEY,
        { subject : user.id.toString() },
        { expiresIn: expirationSeconds }
    );
    ctx.body = {
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": expirationSeconds,
        "username": user.username
    }
    ctx.status = 200;

})

module.exports = router;