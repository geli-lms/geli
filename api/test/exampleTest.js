var mongoose = require("mongoose");
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();
chai.use(chaiHttp);


describe('Example', function(){
  // clear database for each run through 'Tasks'
  beforeEach(function(done) {
    //set up Test environment for each test
    done();
  });
  /*
   * Test the /GET/ route
   */
  describe('/GET example', function(){
    // GET Task should return an empty array
    it('should get a example JSON', function(done){
      chai.request(server)
        .get('/api/example')
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
    });
  });

});