// style upload field (replace with button)
// $('.choose-file').before('<button class="button-choose-file"><i class="fas fa-file-image"></i></button>');
// $('.choose-file').hide();
// $('body').on('click', '.button-choose-file', function() {
//     $('.choose-file').trigger('click');
// });


// + upload new image button
$('.upload-image').on('click', function() {
    console.log('click');
    $('.form-field').toggleClass('displayed');
});
