# grupo-Bancan-shat-backend

## Pasos creacion db:

1. instalar dependencias: apt install postgresql postgresql-contrib
2. conectar servidores de psql: sudo service postgresql start // (mac) brew services start postgresql
3. crear usuario nuevo: sudo -u postgres createuser --superuser bancan_shat
4. crear base de datos nueva:

- sudo -u postgres createdb bancan_shat_db_development
- sudo -u postgres createdb bancan_shat_db_test
- sudo -u postgres createdb bancan_shat_db_production

5. ingresar a psql: sudo -u postgres psql
6. cambiar clave usuario creado (dentro de psql): ALTER USER bancan_shat WITH PASSWORD '12345678';
7. conectar db con usuario (fuera de psql): psql -U bancan_shat -d bancan_shat_db -h 127.0.0.1

## Archivo .env:

- DB_USERNAME = bancan_shat
- DB_PASSWORD = 12345678
- DB_NAME = bancan_shat_db
- DB_HOST = 'localhost'

## Migraciones (en orden):

1. crear user: yarn sequelize-cli model:generate --name User --attributes username:string,password:string,mail:string;
2. crear game: yarn sequelize-cli model:generate --name Game --attributes turn:integer,winner:string;
3. crear board: yarn sequelize-cli model:generate --name Board --attributes game_id:integer,dice:integer;
4. crear token: yarn sequelize-cli model:generate --name Token --attributes user_id:integer,game_id:integer,color:string,money:integer,position:integer;
5. crear fortune: yarn sequelize-cli model:generate --name Fortune --attributes board_id:integer,token_id:integer,name:string,value:integer;
6. crear property: yarn sequelize-cli model:generate --name Property --attributes token_id:integer,board_id:integer,cost:integer,rent:integer,mortage:integer,name:string,position:integer;

## Comandos de sequelize-cli

1. correr migraciones: yarn sequelize-cli db:migrate
2. borrar migraciones: yarn sequelize-cli db:migrate:undo:all
3. correr semillas: yarn sequelize-cli db:seed:all

## Eslint:

1. Ejecutar: yarn run eslint .
2. Comentarios. se agrego en models/index.js // eslint-disable-next-line import/extensions y // eslint-disable-next-line global-require, import/no-dynamic-require
   para evitar errores al momento de correr eslint, no intentamos corregirlos manualmente ya que, el archivo models/index.js es bastante delicado

# Golopoly Game API

Esta API es un backend del juego Golopoly. Proporciona funcionalidades como crear un juego, lanzar los dados, comprar propiedades y obtener información sobre el estado del juego.

## Uso

### Crear un juego

Para crear un juego, realiza una solicitud POST a la ruta `/games` con los nombres de usuario de los jugadores en el cuerpo de la solicitud. Esto creará un nuevo juego con los jugadores y devolverá información sobre el juego, el tablero, los tokens, las propiedades y las cartas de fortuna.

### Lanzar los dados

Para lanzar los dados en un juego existente, realiza una solicitud POST a la ruta `/games/{gameId}/throw-dice`. Esto actualizará la posición de los tokens en el tablero, realizará acciones según las reglas del juego y devolverá información sobre el turno actual, el valor de los dados, los cambios en el dinero y las propiedades, y el estado del juego.

### Comprar una propiedad

Para comprar una propiedad en un juego existente, realiza una solicitud POST a la ruta `/games/{gameId}/properties/{position}/{color}`. Esto intentará comprar la propiedad en la posición especificada por el token del color especificado. Si la compra es exitosa, se actualizará la propiedad y el token, y se devolverá información sobre la compra y el estado del juego.

### Obtener información del juego

Para obtener información sobre un juego existente, realiza una solicitud GET a la ruta `/games/{gameId}`. Esto devolverá información detallada sobre el juego, incluyendo el tablero, los tokens, las propiedades y las cartas de fortuna.

### Fin del juego

El juego termina cuando se cumple una de las siguientes condiciones:

- Uno de los jugadores alcanza o supera la cantidad de $2000 en dinero.
- Uno de los jugadores se queda sin dinero (saldo negativo).

En cualquiera de estos casos, se registra al jugador ganador y se marca el juego como finalizado. La información sobre el ganador se incluye en la respuesta al lanzar los dados.

## Documentación:

- Se creo la documentación de los diversos endpoints en postman, se adjunta el enlace, en caso de tener problemas para acceder, de todas maneras te agregamos como editor del proyecto a tu correo 'corubio@uc.cl'.
- Enlace: https://lunar-robot-773488.postman.co/workspace/Proyecto_web_bancan_shat~babb0afa-05c4-40d2-80c7-0e0e6c9490ce/collection/27481319-3dbd020f-44d8-4cbb-99ce-d1f62553fccc?action=share&creator=27481319

# Detalles pendientes E1:

- Se arreglarón los detalles conversados sobre el frontend de la E1, se encuentran su respositorio correspondiente.




# Futuras entregas:
- manejo de errores de headers.