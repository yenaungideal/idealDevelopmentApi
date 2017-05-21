'use strict';

App.factory('svrHttp', function($http) {
    function connectServer(options, callback) {
        var response;
        
        switch (options.method) {
            case 'GET':
                response = $http.get('/api/' + options.url + options.payload)
                    .success(function(result) {
                        callback(result);
                    });
                break;
            case 'POST':
                response = $http.post('/api/' + options.url, options.payload)
                    .success(function(result) {
                        callback(result);
                    })
                    .error(function(err) {
                        callback(err);
                    });
                break;
            case 'PUT':
                response = $http.put('/api/' + options.url, options.payload)
                    .success(function(result) {
                        callback(result);
                    })
                    .error(function(err) {
                        callback(err);
                    });
                break;
            case 'DELETE':
                response = $http.delete('/api/' + options.url, options.payload)
                    .success(function(result) {
                        callback(result);
                    })
                    .error(function(err) {
                        callback(err);
                    });
                break;
        }
    }

    return {
        connectServer: connectServer
    };

});
