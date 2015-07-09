/**
 * @module      OpenAM
 * @type        {request|exports|module.exports}
 * @author      Deepak Verma
 * @copyright   Copyright (c) 2015, Deepak Verma. All rights reserved
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a copy
 *    of this software and associated documentation files (the "Software"), to deal
 *    in the Software without restriction, including without limitation the rights
 *    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *    copies of the Software, and to permit persons to whom the Software is
 *    furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice shall be included in
 *    all copies or substantial portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *    THE SOFTWARE.
 *
 * var options = {
 *      uri         :  fully qualified uri or a parsed object from url.parse()
 *      baseurl     : "http://baseurl/openam/"
 *      method      : GET, POST, PUT, DELETE (default: GET)
 *      header      : (default: {})
 *      qs          : querystring object
 *      body        : body for request. must be Buffer or String unless json is true
 *      json        : true,
 *      Content-type: application/x-www-form-urlencoded
 * }
 * for more options for request refer: https://www.npmjs.com/package/request#request-options-callback
 *
 * Created by dverma on 06/05/15.
 *
 * Last modified on  09/07/15
 *
 *
 */
var request = require('request'),
    errs    = require('errs');

/**
 * [function description]
 * @method function
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
var OpenAM = function(options) {

    if (!(this instanceof OpenAM)) {
        return new OpenAM(options);
    }

    var self            = this;

    self._id            = Math.random();
    self._baseUrl       = (options.baseUrl === undefined) ? 'your openam baseurl' : options.baseUrl;
    self._realm         = options.realm = (options.realm === undefined) ? "/" : options.realm;
    self._cookieName    = (options.cookieName === undefined) ? "iPlanetDirectoryPro" : options.cookieName;
    self._options       = options || {uri: self._baseUrl};

    return self;
};

/**
 * [_request Private method]
 * @method _request
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
OpenAM.prototype._request = function _request(options, callback) {
    var self = this;

    request(options, function(err, res, body ) {
        self._determineResponse(err, res, body, function() {
            return body;
        }, callback);
    });
};

/**
 * [_determineResponse description]
 * @method _determineResponse
 * @param  {[type]}           err      [description]
 * @param  {[type]}           res      [description]
 * @param  {[type]}           body     [description]
 * @param  {[type]}           result   [description]
 * @param  {Function}         callback [description]
 * @return {[type]}                    [description]
 */
OpenAM.prototype._determineResponse = function determineResponse(err, res, body, result, callback) {
    if (!callback) return;

    if (err) {
        return callback(errs.merge(err, {
            message	: 'OpenAm API error',
        }));
    }

    if (res.statusCode !== 200) {
        err = new Error(body);

        if (body.code && body.message) {
            err.code    = body.code;
            err.reason  = body.reason;
            err.message = body.message;
        }

        return callback(errs.merge(err, {
            message : body.message,
        }));
    }

    return callback(null, result());
};

/**
 * [authenticate description]
 * @method authenticate
 * @param  {[type]}     username [description]
 * @param  {[type]}     password [description]
 * @param  {Function}   callback [description]
 * @return {[type]}              [description]
 */
OpenAM.prototype.authenticate = function authenticate(username, password, callback) {
    var self = this;

    // construct request params
    var params = {
        headers: {
            'X-OpenAM-Username': username,
            'X-OpenAM-Password': password
        },
        uri: self._buildURI('json/authenticate'),
        json: true,
        method: 'POST'
    };

    self._request(params, function(err, result) {
        return callback(null, result.tokenId);
    });
};

/**
 * [logout description]
 * @method logout
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
OpenAM.prototype.logout = function logout(token, callback) {
    var self = this;

    var params = {
        headers: {
            // content-type is required!
            'Content-Type': 'application/json',
            self._cookieName: token
        },
        uri: self._buildURI('json/sessions'),
        qs: {_action: 'logout'},
        json: true,
        method: 'POST'
    };

    self._request(params, function(err, result) {
        return callback(null, result);
    });

};

/**
 * [authorize description]
 * @method authorize
 * @param  {[type]}   token    [description]
 * @param  {[type]}   policy   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
OpenAM.prototype.authorize = function authorize(token, policy, callback) {
    var self = this;

    var params = {
        headers: {
            // content-type is required!
            'Content-Type': 'application/json',
            self._cookieName: token
        },
        uri: self._buildURI('json/policies'),
        qs: {_action: 'evaluate'},
        body:{
            resources: [
                self._buildResource(policy.resource),
                policy.resource
            ],
            application: policy.application
        },
        json: true,
        method: 'POST'
    };

    self._request(params, function(err, result) {
        return callback(null, result);
    });

};

/**
 * [emailResetPassword description]
 * @method emailResetPassword
 * @param  {[type]}           usernameOrEmail [description]
 * @param  {[type]}           email           [description]
 * @param  {Function}         callback        [description]
 */
OpenAM.prototype.emailResetPassword = function emailResetPassword(usernameOrEmail, email, callback) {
    var self = this;

    if (typeof email === 'function') {
        callback= email;
        email   = {};
    }

    var body = {};
    body[~usernameOrEmail.indexOf('@') ? 'email' : 'username'] = usernameOrEmail;
    body.subject = email.subject || 'Reset your password';
    body.message = email.message || 'Follow this link to reset your password';

    var params = {
        uri: self._buildURI('json/users'),
        qs: {_action: 'forgotPassword'},
        body: body,
        json: true,
        method: 'POST'
    };

    self._request(params, function(err, result) {
        return callback(null, result);
    });
};

/**
 * [resetPassword description]
 * @method resetPassword
 * @param  {[type]}      usernameOrEmail [description]
 * @param  {[type]}      newPassword     [description]
 * @param  {[type]}      token           [description]
 * @param  {[type]}      confirmationId  [description]
 * @param  {Function}    callback        [description]
 */
OpenAM.prototype.resetPassword = function resetPassword(usernameOrEmail, newPassword, token, confirmationId, callback) {
    var self = this;
    var body = {};

    body[~usernameOrEmail.indexOf('@') ? 'email' : 'username'] = usernameOrEmail;
    body.userpassword = newPassword;
    body.tokenId = token;
    body.confirmationId = confirmationId;

    var params = {
        uri: self._buildURI('json/users'),
        qs: {_action: 'forgotPasswordReset'},
        body: body,
        json: true,
        method: 'POST'
    };

    self._request(params, function(err, result) {
        return callback(null, result);
    });
};

/**
 * [getAttributes description]
 * @method getAttributes
 * @param  {[type]}      token    [description]
 * @param  {Function}    callback [description]
 * @return {[type]}               [description]
 */
OpenAM.prototype.getAttributes = function attributes(token, callback) {
    var self = this;

    self._userIdFromToken(token, function(err, userId) {
        if (err) {
            return callback(err);
        }

        self._attributesFromUserId(token, userId, callback);
    });
};

/**
 * [_userIdFromToken description]
 * @method _userIdFromToken
 * @param  {[type]}         token    [description]
 * @param  {Function}       callback [description]
 * @return {[type]}                  [description]
 */
OpenAM.prototype._userIdFromToken = function userIdFromToken(token, callback) {
    var self = this;

    var params = {
        headers: {
            // content-type is required!
            'Content-Type': 'application/json',
            self._cookieName: token
        },
        uri: self._buildURI('json/users'),
        qs: {_action: 'idFromSession'},
        json: true,
        method: 'POST'
    };

    self._request(params, function(err, result) {
        return callback(null, result);
    });
};

/**
 * [_attributesFromUserId description]
 * @method _attributesFromUserId
 * @param  {[type]}              token    [description]
 * @param  {[type]}              userId   [description]
 * @param  {Function}            callback [description]
 * @return {[type]}                       [description]
 */
OpenAM.prototype._attributesFromUserId = function attributesFromUserId(token, userId, callback) {
    var self = this;

    var uri = self._buildURI('json/users/' +  userId);

    var headers = {
        self._cookieName: token
    };

    // https://lists.forgerock.org/pipermail/openam/2015-February/019869.html
    // openam isnt really any good for identity managament - i take this to mean email, address, height, weight kind of details
    // but for now just query the datastore and return what we have
    request.get({headers: headers, uri: uri, json: true}, function(err, res, body) {
        self._determineResponse(err, res, body, function() {
            // reduce 1 item arrays to just strings
            Object.keys(body).forEach(function(item) {
                if (body[item] instanceof Array && body[item].length === 1) {
                    body[item] = body[item][0];
                }
            });

            if (body.createTimestamp) {
                body.createTimestamp = self._ldapToEpoch(body.createTimestamp);
            } else if (body.createTimeStamp) {
                body.createTimeStamp = self._ldapToEpoch(body.createTimeStamp);
            }

            if (body.objectGUID) {
                body.objectGUID = new Buffer(body.objectGUID, 'binary');
            }

            return body;
        }, callback);
    });
};

/**
 * [_ldapToEpoch description]
 * @method _ldapToEpoch
 * @param  {[type]}     ldap [description]
 * @return {[type]}          [description]
 */
OpenAM.prototype._ldapToEpoch = function ldapToEpoch(ldap) {
    var year    = ldap.substr(0, 4);
    var month   = ldap.substr(4, 2);
    var day     = ldap.substr(6, 2);
    var hour    = ldap.substr(8, 2);
    var minute  = ldap.substr(10, 2);
    var second  = ldap.substr(12, 2);

    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
};

/**
 * [_buildURI description]
 * @method _buildURI
 * @param  {[type]}  uri [description]
 * @return {[type]}      [description]
 */
OpenAM.prototype._buildURI = function buildURI(uri) {
    var self = this;

    if (!self._options.realm) {
        return self._baseUrl + uri;
    }

    return self._baseUrl + uri.replace('json/', 'json/' + self._options.realm + '/');
};

/**
 * [_buildResource description]
 * @method _buildResource
 * @param  {[type]}       resource [description]
 * @return {[type]}                [description]
 */
OpenAM.prototype._buildResource = function buildResource(resource) {
    var self = this;

    return self._baseUrl + resource;
};

/**
 * TODO Implement Logging
 */
OpenAM.prototype.log= function log(token, uri, callback) {

};

module.exports = OpenAM;
