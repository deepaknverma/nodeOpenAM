var OpenAm  = require('../lib/openam.js'),
    vows    = require('vows'),
    assert  = require('assert');

// testing
var options = {
    realm   : 'test-embedded'
};

var username= 'dv';
var goodPassword= 'admin123';
var policy = {application: 'APP1', action: 'get', resource: 'jobs'};

var openAm = new OpenAm(options);

//Create test suite
vows.describe('OpenAm module tests').addBatch({
    'OpenAm ': {
        topic: function() {
            return openAm;
        },
        'Return Login UI Url': function(topic) {
            assert.equal(topic.getLoginUiUrl(), baseSite + 'UI/Login?');
        },
        'Return Logout UI Url': function(topic) {
            assert.equal(topic.getLogoutUiUrl(), baseSite + 'UI/Logout?');
        },
        'Authentication test': {
            topic: function(topic) {
                topic.authenticate(username, goodPassword, this.callback);
            },
            'authenticated':function(err, token) {
                assert.isNull(err);
                assert.isString(token);
            },
        },
        'Token validation': {
            topic: function() {
                return openAm;
            },
            'isToken valid': function(topic){
                topic.authenticate(username, goodPassword, function(err, token){
                    assert.isNull(err);
                    topic.isTokenValid(token, function(error, result){
                        assert.isNull(error);
                        assert.equal(result,true);
                    });
                });
            },
        },
        'Logout test': {
            topic: function() {
                return openAm;
            },
            'logout': function(topic){
                topic.authenticate(username,goodPassword,function(err,token){
                    assert.isNull(err);
                    topic.isTokenValid(token, function(error, result){
                        assert.isNull(error);
                        assert.equal(result,true);
                    });
                    topic.logout(token, function(err,result){
                        assert.equal(result,true);
                    });
                });
            },
        },
        'Attributes test': {
            topic: function() {
                return openAm;
            },
            'attributes': function(topic){
                topic.authenticate(username,goodPassword,function(err,token){
                    assert.isNull(err);
                    topic.isTokenValid(token, function(error, result){
                        assert.isNull(error);
                        assert.equal(result,true);
                    });
                    topic.getAttributes(token, function(err,result){
                        assert.equal(result,true);
                    });
                });
            },
        },
}}).export(module); //Export the suite
