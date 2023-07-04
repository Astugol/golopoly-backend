const Router = require('koa-router');
const users = require('./routes/usersRoutes');
const games = require('./routes/gameRoutes');
const authRoutes = require('./routes/authentication');
const dotenv = require('dotenv');
const jwtMiddleware = require('koa-jwt');
const scopeProtectedRoutes = require('./routes/scopeExample')

dotenv.config();

const router = new Router();


router.use('/games', games.routes());
router.use(authRoutes.routes());


// Desde esta línea todas las rutas requerirán un JWT. Esto no aplica para 
// las líneas anteriores
router.use(jwtMiddleware( { secret: process.env.JWT_SECRET } ))

router.use('/users', users.routes());

router.use('/scope-example', scopeProtectedRoutes.routes())



module.exports = router;
