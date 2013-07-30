//visual and interactions
$(document).ready(function(){
	// toggler
	$('#page').on('click','.toggler, li.js-clickable',function(){
		var $interaction = $('div#interaction');
		if($interaction.hasClass('visible'))
			$interaction.animate({top:'-360px'}, 300).removeClass('visible');
		else {
			$interaction.animate({top:'0px'}, 300).addClass('visible');
			$interaction.find('input#title').focus();
		}
	});
});
