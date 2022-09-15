require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./src/api/routes/routes');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: true,
    },
  });

  server.route(routes);

  await server.start();
  console.log('Server running on port 3000');
};

init();
