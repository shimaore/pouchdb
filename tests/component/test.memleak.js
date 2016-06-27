'use strict';

var PouchDB = require('../../packages/pouchdb-for-coverage');

require('chai').should();

describe('test.memleak.js', function () {

  it('Test basic memory leak', function (done) {
    this.timeout(60*1000);

    var heapUsed = null;
    var original_heapUsed = null;
    global.gc();
    var next = function () {
      global.gc();
      if(original_heapUsed === null) {
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc();
        var memory = process.memoryUsage();
        original_heapUsed = heapUsed;
      }

      var db = new PouchDB('goodluck');
      db.close(function(){
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        global.gc()
        var memory = process.memoryUsage();
        var last_heapUsed = heapUsed;
        heapUsed = memory.heapUsed;

        if (last_heapUsed !== null) {

          console.log('difference is', heapUsed - last_heapUsed, ' since startup', heapUsed - original_heapUsed);

          if (heapUsed - last_heapUsed === 0) {
            db.destroy(function() { done(); });
            return;
          }
        }
        setTimeout(next,50);
      });
    };
    global.gc();
    next();
  });


});
