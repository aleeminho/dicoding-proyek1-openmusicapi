const albumRoutes = require('./albumRoutes');
const songRoutes = require('./songRoutes');

module.exports = [...songRoutes, ...albumRoutes];
