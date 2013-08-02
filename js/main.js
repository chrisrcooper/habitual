//visual and interactions
$(document).ready(function(){
	// toggler
	$('#page').on('click','.toggler, li.js-clickable',function(){
		var $interaction = $('div#interaction');
		if($interaction.hasClass('visible')) {
			$interaction.animate({top:'-460px'}, 300).removeClass('visible');
			$('#addOrHideButton').text('Add');
		}
		else {
			$interaction.animate({top:'0px'}, 300).addClass('visible');
			$('#addOrHideButton').text('Hide');
			$interaction.find('input#title').focus();
		}
	});
});
