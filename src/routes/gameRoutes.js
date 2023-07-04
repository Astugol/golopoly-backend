const Router = require('koa-router');
const gameController = require('../controllers/gameController');

const router = new Router();

router.post('games.create', '/', gameController.createGame);
router.post('games.throwDice', '/throwdice/:id', gameController.throwDice);
router.post('games.getProperty', '/getproperty/:id', gameController.getProperty);
router.get('games.getGameInfo', '/:id', gameController.getGameInfo);

module.exports = router;
