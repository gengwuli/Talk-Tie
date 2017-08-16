(function() {
    'use strict';

    angular
        .module('app')
        .filter('postFilter', postFilter);

    function postFilter() {
        /**
         * @param  {Array} Array of objects to be filtered
         * @param  {String} key word to be looked for
         * @return {Array} return the filtered array
         */
        return function(posts, input) {
            var filter = [];
            if (input == undefined || input == '') {
                return posts;
            }
            //iterate through posts and find one whose author or body contains the key word
            posts.forEach(function(post) {
                if (post.author.includes(input) || post.body.includes(input)) {
                    filter.push(post);
                }
            })
            return filter;
        }
    }

})();
