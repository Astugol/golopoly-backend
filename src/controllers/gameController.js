async function getRandomFortuneCard(ctx, gameId) {
  const board = await ctx.orm.Board.findOne({ where: { game_id: gameId } });
  const fortuneCards = await ctx.orm.Fortune.findAll({
    where: { board_id: board.id },
  });
  const randomIndex = Math.floor(Math.random() * fortuneCards.length);
  const randomCard = fortuneCards[randomIndex];

  let fortuneMessage = '';

  if (randomCard.value > 0) {
    fortuneMessage += `gains $${randomCard.value}`;
  } else {
    fortuneMessage += `loses $${Math.abs(randomCard.value)}`;
  }

  return {
    card: randomCard,
    fortuneMessage,
  };
}

async function createGame(ctx) {
  try {
    const game = await ctx.orm.Game.create({ turn: 0 });
    const board = await ctx.orm.Board.create({ game_id: game.id });
    const { usuarios } = ctx.request.body;
    let user1 = null;
    let user2 = null;
    if (!usuarios || !Array.isArray(usuarios) || usuarios.length !== 2) {
      ctx.body = {
        message: 'Se deben enviar exactamente 2 usuarios en forma de lista',
      };
      ctx.status = 400;
      return;
    }
    const [usuario1, usuario2] = usuarios;
    if (usuario1 === usuario2) {
      ctx.body = {
        message: 'No se puede jugar con 2 usuarios iguales.',
      };
      ctx.status = 400;
      return;
    }
    user1 = await ctx.orm.User.findOne({
      where: {
        username: usuario1,
      },
    });
    user2 = await ctx.orm.User.findOne({
      where: {
        username: usuario2,
      },
    });
    if (!user1) {
      ctx.body = {
        message: 'Al menos uno de los usuarios no existe',
      };
      ctx.status = 400;
      return;
    }
    if (!user2) {
      ctx.body = {
        message: 'Al menos uno de los usuarios no existe',
      };
      ctx.status = 400;
      return;
    }

    const token1 = await ctx.orm.Token.create({
      user_id: user1.id,
      game_id: game.id,
      color: 'Red',
      money: 1500,
      position: 0,
    });
    const token2 = await ctx.orm.Token.create({
      user_id: user2.id,
      game_id: game.id,
      color: 'Blue',
      money: 1500,
      position: 0,
    });

    const property1 = await ctx.orm.Property.create({
      token_id: null,
      board_id: board.id,
      cost: 100,
      rent: 100,
      mortage: 100,
      name: 'Property 1',
      position: 1,
    });
    const property2 = await ctx.orm.Property.create({
      token_id: null,
      board_id: board.id,
      cost: 150,
      rent: 150,
      mortage: 200,
      name: 'Property 2',
      position: 3,
    });
    const property3 = await ctx.orm.Property.create({
      token_id: null,
      board_id: board.id,
      cost: 200,
      rent: 200,
      mortage: 300,
      name: 'Property 3',
      position: 5,
    });
    const property4 = await ctx.orm.Property.create({
      token_id: null,
      board_id: board.id,
      cost: 300,
      rent: 300,
      mortage: 400,
      name: 'Property 4',
      position: 7,
    });

    const fortune1 = await ctx.orm.Fortune.create({
      board_id: board.id,
      token_id: null,
      name: 'Fortune 1',
      value: 100,
    });
    const fortune2 = await ctx.orm.Fortune.create({
      board_id: board.id,
      token_id: null,
      name: 'Fortune 2',
      value: -50,
    });

    const fortune3 = await ctx.orm.Fortune.create({
      board_id: board.id,
      token_id: null,
      name: 'Fortune 3',
      value: -100,
    });

    ctx.body = {
      message: 'Game created successfully',
      game,
      board,
      tokens: [token1, token2],
      properties: [property1, property2, property3, property4],
      fortunes: [fortune1, fortune2, fortune3],
    };
    ctx.status = 201;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
}

async function throwDice(ctx) {
  try {
    const gameId = ctx.params.id;

    const game = await ctx.orm.Game.findByPk(gameId);

    if (!game) {
      ctx.body = {
        message: 'El juego ingresado no existe',
      };
      ctx.status = 404;
      return;
    }

    if (game.winner !== null) {
      ctx.body = {
        message: 'El juego ha terminado. No se puede tirar el dado.',
      };
      ctx.status = 400;
      return;
    }

    const token1 = await ctx.orm.Token.findOne({
      where: { game_id: gameId, color: 'Red' },
    });
    const token2 = await ctx.orm.Token.findOne({
      where: { game_id: gameId, color: 'Blue' },
    });

    if (!token1) {
      ctx.body = {
        message: 'El token 1 no existe',
      };
      ctx.status = 404;
      return;
    }

    if (!token2) {
      ctx.body = {
        message: 'El token 2 no existe',
      };
      ctx.status = 404;
      return;
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    const previousPositions1 = token1.position;
    const previousPositions2 = token2.position;
    const previousMoney1 = token1.money;
    const previousMoney2 = token2.money;
    let messageFortuneCard = '';
    let messageMoney = '';
    let messageDice = `We are in the turn: ${game.turn} and the dice value was: ${diceValue}, `;

    if (game.turn % 2 === 0) {
      const newPosition2 = (token2.position + diceValue) % 8;

      if (newPosition2 < previousPositions2) {
        token2.money += 100;
        token2.position = newPosition2;
        messageMoney += `Token ${token2.color} passed through the Start and gained $100. `;
      } else {
        token2.position = newPosition2;
      }

      if ([2, 4, 6].includes(token2.position)) {
        const { card, fortuneMessage } = await getRandomFortuneCard(
          ctx,
          gameId,
        );
        token2.money += card.value;
        messageFortuneCard = `The token ${token2.color} take ${card.name} and ${fortuneMessage}`;
      }

      await token2.save();
    } else {
      const newPosition1 = (token1.position + diceValue) % 8;

      if (newPosition1 < previousPositions1) {
        token1.money += 100;
        token1.position = newPosition1;
        messageMoney += `Token ${token1.color} passed through the Start and gained $100. `;
      } else {
        token1.position = newPosition1;
      }

      if ([2, 4, 6].includes(token1.position)) {
        const { card, fortuneMessage } = await getRandomFortuneCard(
          ctx,
          gameId,
        );
        token1.money += card.value;
        messageFortuneCard = `The token ${token1.color} take ${card.name} and ${fortuneMessage}`;
      }

      await token1.save();
    }

    const board = await ctx.orm.Board.findOne({ where: { game_id: gameId } });
    const position = game.turn % 2 === 0 ? token2.position : token1.position;
    const property = await ctx.orm.Property.findOne({
      where: { position, board_id: board.id },
    });

    let messagePayForProperty;

    if (property && property.token_id === token1.id && game.turn % 2 === 0) {
      token2.money -= property.rent;
      token1.money += property.rent;
      messagePayForProperty = `Token ${token2.color} pays ${token1.color} $${property.rent} for passing through their property`;
    }

    if (property && property.token_id === token2.id && game.turn % 2 !== 0) {
      token1.money -= property.rent;
      token2.money += property.rent;
      messagePayForProperty = `Token ${token1.color} pays ${token2.color} $${property.rent} for passing through their property`;
    }

    if (token1.money !== previousMoney1) {
      messageMoney += `Token ${token1.color} money changed from ${previousMoney1} to ${token1.money}. `;
    }

    if (token2.money !== previousMoney2) {
      messageMoney += `Token ${token2.color} money changed from ${previousMoney2} to ${token2.money}. `;
    }

    if (token1.money >= 2000) {
      game.winner = token1.color;
      await game.save();

      ctx.body = {
        message: 'Game over. Token1 wins!',
        game,
        token1,
        token2,
      };
      ctx.status = 200;
      return;
    }

    if (token2.money >= 2000) {
      game.winner = token2.color;
      await game.save();

      ctx.body = {
        message: 'Game over. Token2 wins!',
        game,
        token1,
        token2,
      };
      ctx.status = 200;
      return;
    }
    if (token1.money < 0) {
      game.winner = token2.color;
      await game.save();

      ctx.body = {
        message: 'Game over. Token2 wins!',
        game,
        token1,
        token2,
      };
      ctx.status = 200;
      return;
    }

    if (token2.money < 0) {
      game.winner = token1.color;
      await game.save();

      ctx.body = {
        message: 'Game over. Token1 wins!',
        game,
        token1,
        token2,
      };
      ctx.status = 200;
      return;
    }

    game.turn += 1;
    await game.save();

    if (game.turn % 2 === 0) {
      messageDice += `the position was changed from ${previousPositions1} to ${token1.position} for Token ${token1.color}.`;
    } else {
      messageDice += `the position was changed from ${previousPositions2} to ${token2.position} for Token ${token2.color}.`;
    }

    ctx.body = {
      messageTurn: 'Turn performed successfully',
      messageDice,
      messageMoney: messageMoney || 'No one had money changes in this turn',
      messageFortuneCard:
        messageFortuneCard || 'No one take a fortune card in this turn',
      messagePayForProperty:
        messagePayForProperty
        || 'No one had to pay for a property in this turn',
      game,
      token1,
      token2,
    };
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
}

async function getProperty(ctx) {
  try {
    const gameId = ctx.params.id;
    const { color, propertyPosition } = ctx.request.body;

    const game = await ctx.orm.Game.findByPk(gameId);
    if (!game) {
      ctx.body = {
        message: 'El juego ingresado no existe',
      };
      ctx.status = 404;
      return;
    }
    const board = await ctx.orm.Board.findOne({
      where: { game_id: game.id },
    });

    const property = await ctx.orm.Property.findOne({
      where: { position: propertyPosition, board_id: board.id },
    });
    if (!property) {
      ctx.body = {
        message: 'Propiedad no existente.',
      };
      ctx.status = 400;
      return;
    }

    const token = await ctx.orm.Token.findOne({
      where: { game_id: gameId, color },
    });
    if (!token) {
      ctx.body = {
        message: 'Token no existente.',
      };
      ctx.status = 400;
      return;
    }
    if (token.position !== propertyPosition) {
      ctx.body = {
        message: 'El token no se encuentra en la posición especificada',
      };
      ctx.status = 400;
      return;
    }

    let messageProperty;

    if (property.token_id != null) {
      const owner = await ctx.orm.Token.findByPk(property.token_id);
      if (owner.color === token.color) {
        messageProperty = 'You already have this property';
        ctx.status = 400;
      } else {
        messageProperty = 'The property already has an owner';
        ctx.status = 400;
      }
    } else if (token.money >= property.cost) {
      property.token_id = token.id;
      token.money -= property.cost;
      await token.save();
      await property.save();
      messageProperty = `Property added successfully to ${token.color}, you bougth ${property.name} for $${property.cost}`;
      ctx.status = 200;
    } else {
      messageProperty = 'Insufficient funds to purchase the property';
      ctx.status = 400;
    }

    ctx.body = {
      messageProperty,
      game,
      token,
      property,
    };
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
}

async function getGameInfo(ctx) {
  try {
    const gameId = ctx.params.id;

    const game = await ctx.orm.Game.findByPk(gameId);
    if (!game) {
      ctx.body = {
        message: 'El juego ingresado no existe',
      };
      ctx.status = 404;
      return;
    }
    const board = await ctx.orm.Board.findOne({ where: { game_id: gameId } });
    const tokens = await ctx.orm.Token.findAll({ where: { game_id: gameId } });
    const properties = await ctx.orm.Property.findAll({
      where: { board_id: board.id },
    });
    const fortunes = await ctx.orm.Fortune.findAll({
      where: { board_id: board.id },
    });

    ctx.body = {
      game,
      board,
      tokens,
      properties,
      fortunes,
    };
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
}

module.exports = {
  createGame,
  throwDice,
  getProperty,
  getGameInfo,
};
