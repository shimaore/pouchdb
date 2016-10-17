// Usage: mocha --expose-gc test/component/test.memleak.js
'use strict';

var PouchDB = require('../../packages/node_modules/pouchdb-for-coverage');
var express = require('express');
var bodyParser = require('body-parser');

require('chai').should();

var app = express();

app.use(bodyParser.json());
app.use(require('pouchdb-express-router')(PouchDB));

describe('test.memleak.js', function () {

  var server;

  before(function () {
    server = app.listen(0);
  });

  after(function () {
    return server.close();
  });

  it('Test basic memory leak', function (done) {
    this.timeout(40*1000);

    var heapUsed = null;
    var no_leaks = 0;

    var measure = function(){

      global.gc();

      var memory = process.memoryUsage();
      var last_heapUsed = heapUsed;
      heapUsed = memory.heapUsed;

      if (last_heapUsed !== null) {

        console.log('current value is', heapUsed,'difference is', heapUsed - last_heapUsed);

        if (heapUsed - last_heapUsed === 0) {
          no_leaks += 1;
          if(no_leaks > 4) {
            clearInterval(interval);
            done();
          }
        } else {
          no_leaks = 0;
        }
      }
    };

    var host = 'http://127.0.0.1:' + server.address().port + '/';

    var interval = setInterval(function () {

      /* Pick your poison */
      // var db = new String('fghjklhg');
      var db = new PouchDB('goodluck');
      // var db = new PouchDB(Math.random().toString().substr(4,6));
      // var db = new PouchDB(host+'goodluck');
      /* Include a call to `info()` or not. */
      // db.info().then(function(){
      /* Pick how you finish */
        db.close().then(measure)
        // db.destroy().then(measure)
      // }); // info()
    }, 1000);
  });

});
