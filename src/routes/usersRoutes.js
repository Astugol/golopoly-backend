const Router = require('koa-router');

const router = new Router();

router.get('users.list', '/', async (ctx) => {
  try {
    const users = await ctx.orm.User.findAll();
    if (!users) {
      ctx.status = 404;
      ctx.body = 'Users not found';
      return;
    }
    ctx.body = users;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.get('users.show', '/:id', async (ctx) => {
  try {
    const user = await ctx.orm.User.findByPk(ctx.params.id);
    if (!user) {
      ctx.status = 404;
      ctx.body = 'User not found';
      return;
    }
    ctx.body = user;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.put('users.update', '/:id', async (ctx) => {
  try {
    const user = await ctx.orm.User.findByPk(ctx.params.id);
    if (!user) {
      ctx.status = 404;
      ctx.body = 'User not found';
      return;
    }
    await user.update(ctx.request.body);
    ctx.body = user;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.delete('users.delete', '/:id', async (ctx) => {
  try {
    const user = await ctx.orm.User.findByPk(ctx.params.id);
    if (!user) {
      ctx.status = 404;
      ctx.body = 'User not found';
      return;
    }
    await user.destroy();
    ctx.status = 204;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
