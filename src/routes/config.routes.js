'use strict'
module.exports = function (app) {
  const configs = require('../controllers/config.controller')

  app.route('/v1/configs/')
    .get(configs.read_a_config)
    .put(configs.update_a_config)

}