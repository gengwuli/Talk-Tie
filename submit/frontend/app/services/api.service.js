;
(function() {

    angular.module('app')
        .constant('apiURL', 'https://gengwuback.herokuapp.com')
        .factory('api', apiService);

    apiService.$inject = ['$http', '$resource', 'apiURL'];

    function apiService($http, $resource, apiURL) {
        $http.defaults.withCredentials = true
        return $resource(apiURL + '/:endpoint/:user/:id', { user: '@user', id: '@id' }, {
            addPost: {
                method: 'POST',
                params: { endpoint: 'post' },
                headers: { 'Content-Type': undefined },
                transformRequest: resourceUploadFile
            },
            upload: {
                method: 'PUT',
                params: { endpoint: 'picture' },
                headers: { 'Content-Type': undefined },
                transformRequest: resourceUploadFile
            },
            getLink: {method:'GET', params: {endpoint:'link'}},
            merge: { method: 'PUT', params: { endpoint: "merge" } },
            login: { method: 'POST', params: { endpoint: 'login' } },
            logout: { method: 'PUT', params: { endpoint: 'logout' } },
            demerge: { method: 'PUT', params: { endpoint: "demerge" } },
            getEmail: { method: 'GET', params: { endpoint: 'email' } },
            getPosts: { method: 'GET', params: { endpoint: 'posts' } },
            getAvatar: { method: 'GET', params: { endpoint: 'pictures' } },
            register: { method: 'POST', params: { endpoint: "register" } },
            getStatus: { method: 'GET', params: { endpoint: 'status' } },
            updatePost: { method: 'PUT', params: { endpoint: 'posts' } },
            getZipcode: { method: 'GET', params: { endpoint: 'zipcode' } },
            getStatuses: { method: 'GET', params: { endpoint: "statuses" } },
            getPictures: { method: 'GET', params: { endpoint: "pictures" } },
            updateEmail: { method: 'PUT', params: { endpoint: "email" } },
            unfollow: { method: 'DELETE', params: { endpoint: "following" } },
            addFollower: { method: 'PUT', params: { endpoint: "following" } },
            getFollowers: { method: 'GET', params: { endpoint: 'following' } },
            updateStatus: { method: 'PUT', params: { endpoint: 'status' } },
            updateZipcode: { method: 'PUT', params: { endpoint: "zipcode" } },
            updatePassword: { method: 'PUT', params: { endpoint: "password" } }
        })
    }

    function resourceUploadFile(data) {
        var fd = new FormData()
        fd.append('image', data.img)
        fd.append('body', data.body)
        return fd;
    }
})()
