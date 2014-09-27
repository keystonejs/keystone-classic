$('.field.type-text, .field.type-number').on("click", ".btn.btn-remove-item", function(e) {
	e.preventDefault();
	$(this).parent().remove();
});
$('.field.type-text .btn.btn-add-item, .field.type-number .btn.btn-add-item').on("click", function(e) {
	e.preventDefault();
	var name = $(this).parent().parent().attr("data-field-path");
	$(this).before('<div class="field-item"><input type="text" name="' + name + '" value="" autocomplete="off" class="form-control multi"><a href="#" class="btn btn-remove-item">X</a></div>');
});
