(function() {
    var app = new Vue({
        el: '#main',
        data: {
            heading: 'Latest Images',
            class: 'img-box',
            images: [],
            form: {
                title: '',
                username: '',
                description: ''
            }
        },
        // mounted function runs after html but before JS loads
        mounted: function() {
            console.log('mounted');
            axios.get('/images').then(function(response) {
                app.images = response.data.rows;
            });
        },
        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                var file = $('input[type="file"]').get(0).files[0];
                console.log('uploadFile running, file uploading: ', file);
                // form data is used for dealing with files via ajax
                var formData = new FormData();
                formData.append('file', file);
                formData.append('title', this.form.title);
                formData.append('description', this.form.description);
                formData.append('username', this.form.username);
                // logging formData will ALWAYS return empty object!!
                // console.log(formData);

                axios.post('/upload', formData).then(function(response) {
                    console.log('response in POST /upload: ', response.data);
                    // add picture data to app.images so vue renders it
                    // without reloading page
                    app.images.unshift(response.data);
                });
            }
        }
    });
})();
