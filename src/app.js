const Koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const router = require('./routes');
const orm = require('./models');

// Crear instancia de Koa
const app = new Koa();

// Exponer el orm a la app
app.context.orm = orm;

// Cors para poder acceder desde el frontend
app.use(cors())

// Middlewares proporcionados por Koa
app.use(KoaLogger());
app.use(koaBody());

// koa router
app.use(router.routes());

app.use((ctx) => {
  ctx.body = 'Bienvenido';
});

module.exports = app;
