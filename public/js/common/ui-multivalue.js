jQuery(function($) {
	
	$('.field.type-textarray, .field.type-numberarray').on("click", ".btn.btn-remove-item", function(e) {
		e.preventDefault();
		$(this).parent().remove();
	});
	
	$('.field.type-textarray .btn.btn-add-item, .field.type-numberarray .btn.btn-add-item').on("click", function(e) {
		e.preventDefault();
		var name = $(this).parent().parent().attr("data-field-path");
		$(this).before('<div class="field-item"><input type="text" name="' + name + '" value="" autocomplete="off" class="form-control multi"><a href="javascript:;" class="btn btn-link btn-cancel btn-remove-item"><span class="ion-close-round"></span></a></div>');
	});
	
});
