// style upload field (replace by button)
$('.input-file').before('<input type="button" id="button-file" value="Choose Image" />');
$('.input-file').hide();
$('body').on('click', '#button-file', function() {
    $('.input-file').trigger('click');
});
