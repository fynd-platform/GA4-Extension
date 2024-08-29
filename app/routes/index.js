const path = require('path');
const express = require('express');
const history = require('connect-history-api-fallback');
const { FDKExtension } = require('../fdk/index');
const { NotFound } = require('../utils/error');
const v1Routes = require('./v1.routes');

class API {
  /**
   *
   * @param {express.Router} app
   */
  static async registerRoutes(app) {
    // apiRoutes middleware is used Platform Routes 
    const { apiRoutes } = FDKExtension;
    app.use(express.static(path.join(__dirname, '../../', 'public')));
    app.use(FDKExtension.fdkHandler);
    apiRoutes.use('/v1', v1Routes);
    apiRoutes.all('*', () => {
      throw new NotFound('not found');
    });
    app.use('/api', apiRoutes);
    app.use('*', (req, res) => {
      console.log(`not found path ${req.path}`);
      res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
    app.use(history());
  }
}
module.exports = API;
