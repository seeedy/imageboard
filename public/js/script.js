(function() {
    var app = new Vue({
        el: '#main',
        data: {
            heading: 'Latest Images',
            class: 'img-box',
            images: []
        },
        mounted: function() {
            console.log('mounted');
            axios.get('/images').then(function(response) {
                console.log(response.data.rows);
                app.images = response.data.rows;
            });
        }
    });
})();
