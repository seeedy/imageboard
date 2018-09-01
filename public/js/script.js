(function() {

    window.addEventListener('hashchange', function() {
        app.currentImage = location.hash.slice(1);
    });

    Vue.component('image-modal', {
        props: ['imageid'],

        data: function() {
            return {
                currentImageData: []
            };
        },

        mounted: function() {
            // we need self=this because of nested non-arrow functions
            var self = this;
            axios.get('/image/' + this.imageid).then(function(response) {
                self.currentImageData = response.data;
                console.log(self.currentImageData);
            });
        },

        methods: {
            closeModal: function(e) {
                return this.$emit('close', e.target);
            }
        },

        template: '#modal-template'
    });

    Vue.component('comments', {
        props: ['imageid'],

        data: function() {
            return {
                heading: 'Add a comment!',
                form: {
                    comment: '',
                    username: ''
                },
                allComments: [],
            };
        },

        mounted: function() {
            var self = this;
            axios.get('/comments/' + self.imageid).then(function(response) {
                self.allComments = response.data;
            });
        },

        methods: {
            postComment: function(e) {
                e.preventDefault();
                var self = this;
                var commentBody = {
                    comment: document.querySelector("#comment-text").value,
                    username: document.querySelector("#username-text").value,
                    imageId: this.imageid
                };

                console.log('REQ: ', commentBody);

                axios.post('/comments', commentBody).then(function(response) {
                    console.log('adding new comment', response.data);
                    self.allComments.push(response.data);

                });
            }
        },

        template: '#comments'
    });

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
            },
            currentImage: location.hash.length > 1 && location.hash.slice(1),
            moreImagesToLoad: true,

        },

        // mounted function runs after html but before JS loads
        mounted: function() {
            axios.get('/images').then(function(response) {
                app.images = response.data[0].rows;
                var lastImageDb = response.data[1].rows[0].id;
                var lastImageShown = app.images[app.images.length - 1].id;
                app.compareIds(lastImageShown, lastImageDb);
            });
        },

        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                var file = $('input[type="file"]').get(0).files[0];
                // form data is used for dealing with files via ajax
                var formData = new FormData();
                formData.append('file', file);
                formData.append('title', this.form.title);
                formData.append('description', this.form.description);
                formData.append('username', this.form.username);
                // logging formData will ALWAYS return empty object!!
                // console.log(formData);

                axios.post('/upload', formData).then(function(response) {
                    app.images.unshift(response.data);
                }).catch(function(err) {
                    console.log(err);
                });
            },
            closeModal: function() {
                this.currentImage = null;
                location.hash = '';
                return;
            },
            getMoreImages: function() {
                var lastImageShown = this.images[this.images.length - 1].id;
                axios.get('/more/' + lastImageShown)
                    .then(function(response) {
                        app.images = app.images.concat(response.data[0].rows);
                        var lastImageDb = response.data[1].rows[0].id;
                        lastImageShown = app.images[app.images.length - 1].id;
                        app.compareIds(lastImageShown, lastImageDb);
                    });
            },
            compareIds: function(lastImageShown, lastImageDb) {
                if (lastImageShown == lastImageDb) {
                    app.moreImagesToLoad = false;
                }
            }

        }

    });
})();
