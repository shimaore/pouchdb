'use strict';
var heapdump = require('heapdump');

var MemDown = require('memdown');
var PouchDB = require('../../packages/pouchdb-for-coverage')
  // .defaults({db:MemDown});

require('chai').should();

describe('test.memleak.js', function () {

  it('Test basic memory leak', function (done) {
    this.timeout(600*1000);

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
        db = null;
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

        var delta = null;
        var original_delta = null;
        if (last_heapUsed !== null) {
          delta = heapUsed - last_heapUsed;
          original_delta = heapUsed - original_heapUsed;
          // console.log('difference is', delta, ' since startup', original_delta);

          if (heapUsed - last_heapUsed === 0) {
            // db.destroy(function() { done(); });
            return;
          }
        }
        heapdump.writeSnapshot((new Date().toISOString())+'_'+delta+'_'+original_delta+'.heapsnapshot', function(){
        setTimeout(next,500);
        })
      });
    };
    global.gc();
    next();
  });


});
