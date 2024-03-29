/*
 * routes.js - module to provide routing
*/
/*jsling         node   : true, continue : ture,
  devel  : ture, indent : 2,    maxerr   : 50,
  newcap : true, nomen  : true, plusplus : true,
  regexp : true, sloppy : true, vars     : false,
  white  : true
*/
/*global */

// ----------------- BEGIN MODULE SCOPE VARIABLES ------------------
'use strict';
var
  configRoutes,
  mongodb     = require( 'mongodb' ),

  mongoServer = new mongodb.Server(
    'localhost',
    mongodb.Connection.DEFAULT_PORT
  ),
  dbHandle    = new mongodb.Db(
    'spa', mongoServer, { safe : true }
  ),

  makeMongoId = mongodb.ObjectID;
/*
dbHandle.open( function () {
  console.log( '** Connected to MongoDB **' );
});
*/
// ------------------- END MODULE SCOPE VARIABLES ------------------

// -------------------- BEGIN PUBLIC METHOD ------------------------
configRoutes = function ( app, server ) {
  app.get( '/', function ( request, response ) {
    response.redirect( '/spa.html' );
  });

  app.all( '/:obj_type/*?', function ( request, response, next ) {
    response.contentType( 'json' );
    next();
  });

  app.get( '/:obj_type/list', function ( request, response ) {
    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        collection.find().toArray(
          function ( inner_error, map_list ) {
            response.send( map_list );
          }
        );
      }
    );
  });

  app.post( '/:obj_type/create', function ( request, response ) {
    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        var
          options_map = { safe: true },
          obj_map     = request.body;

        collection.insert(
          obj_map,
          options_map,
          function ( inner_error, result_map ) {
            response.send( result_map );
          }
        );
      }
    );
  });

  app.get( '/:obj_type/read/:id([0-9]+)', function (  request, response ) {
    var find_map = { _id: makeMongoId( request.params.id ) };
    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        collection.findOne(
          find_map,
          function ( inner_error, result_map ) {
            response.send( result_map );
          }
        );
      }
    );
  });

  app.post( '/:obj_type/update/:id([0-9]+)',
    function ( request, response ) {
      response.send({
       title: request.params.obj_type
          + ' with id ' + request.params.id + ' updated'
      });
    }
  );

  app.get( '/:obj_type/delete/:id([0-9]+)',
    function ( request, response ) {
      response.send({
        title: request.param.obj_type
	  + ' with id ' + request.params.id + ' deleted'
      });
    }
  );
};
module.exports = { configRoutes : configRoutes };
// ------------------- END PUBLIC METHODS --------------------------
