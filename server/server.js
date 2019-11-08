
const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');

// inicio
// Importar Modulo Movies
var Movie = require('./model/movies');


const logger = log4js.getLogger(appName);
const app = express();
const server = http.createServer(app);

app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);

// Movies APIs

app.get("/api/movies", function(req, res, next) {

  Movie.find(function(err, post) {
    if (err) return next(err);
    res.json(post);
  });

});


app.get("/api/movies/:id", function(req, res, next) {

  Movie.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });

});

app.post("/api/movies", function(req, res, next) {

  Movie.create(req.body, function(err, post) {

    if (err) return next(err);
    res.json(post);
  });

});

// update Movie
app.put("/api/movies/:id", function(req, res, next) {
  Movie.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// DELETE Movie

app.delete("/api/movies/:id", function(req, res, next) {
  Movie.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

const port = process.env.PORT || localConfig.port;
server.listen(port, function(){
  logger.info(`meanexample listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`meanexample listening on http://localhost:${port}`);
});

app.use(function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function(err, req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '500.html'));
});
module.exports = server;