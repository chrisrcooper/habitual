$(document).ready(function(){
	init();
	if(typeof(Storage)!=="undefined")
	  {
	  updateThisOneTinyField();
	  }
	else
	  {
	  $('#result').innerHTML="Sorry, your browser does not support web storage...";
	}
});

function init(){
	//check if the localStorage has been used or this is new
	if(!localStorage.display) {
		var tasks =  [];
		tasks.push({
			title: 'My First Task',
			days: ["3","5"]
		});
		localStorage.display=JSON.stringify(tasks);	
	}
}
			
function addIt() {
	var title = $('input#title').val();
	var days = [];
	$('input:checked').each(function(){
		days.push($(this).val());
		$(this).attr('checked',false);
	});	
	
	console.log(days);
	
	var tasks = JSON.parse(localStorage.display);
	
	tasks.push({
		title: title,
		days: days
	});
	localStorage.display=JSON.stringify(tasks);
	updateThisOneTinyField();
}
	
function updateThisOneTinyField() {
	var tasks = JSON.parse(localStorage.display);
	var taskSetDisplay = '';
	$.each(tasks, function(index, value) {
		// transform the days array to the names of the dates
		var daysDisplay = '';
		var titleDisplay = '';
		for(var i = 0; i < value.days.length; i++) {
			day = value.days[i];
			switch(day) {
				case "1":
					name = 'Sunday';
					break;
				case "2":
					name = 'Monday';
					break;
				case "3":
					name = 'Tuesday';
					break;
				case "4":
					name = 'Wednesday';
					break;
				case "5":
					name = 'Thursday';
					break;
				case "6":
					name = 'Friday';
					break;
				case "7":
					name = 'Saturday';
					break;
			}
			daysDisplay += '<li><label><input type="checkbox" name="day" value='+day+'>'+name+'</label></li>';
		}
		for(var i = 0; i < value.title.length; i++) {
			titleDisplay += value.title[i];
		}
		
    	taskSetDisplay += '<h3>'+titleDisplay+'</h3><ul>'+daysDisplay+'</ul>';
	}); 
	$('#result').html(taskSetDisplay);
}