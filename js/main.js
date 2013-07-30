//visual and interactions
$(document).ready(function(){
	// toggler
	$('a.toggler').click(function(){
		var $form = $(this).parent();
		if($form.hasClass('visible'))
			$form.animate({top:'-360px'}, 300).removeClass('visible');
		else {
			$form.animate({top:'0px'}, 300).addClass('visible');
			$form.find('input#title').focus();
		}
		
	});
});
