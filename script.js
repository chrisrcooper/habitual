$(document).ready(function(){
	init();
	if(typeof(Storage)!=="undefined")
	  {
		dailyAgenda();
		updateThisOneTinyField();
	  }
	else
	{
		$('#result').innerHTML="Sorry, your browser does not support web storage...";
	}
	$('div#agenda').on('click','li.js-clickable',function(){
		var taskId = $(this).attr('data-id');
		var tasks = JSON.parse(localStorage.display);
		
		var $form = $('div#interaction form');
		
		//change the input title
		var title = tasks[taskId].title;
		$form.find('input#title').val(title).focus();
		
		//change the day checkboxes
		$form.find('input[type=checkbox]').prop('checked',false);
		
		for(var i = 0; i < tasks[taskId].days.length; i++) {
			$form.find('input[type=checkbox]').each(function() {
				if($(this).val() == tasks[taskId].days[i]) {
					$(this).prop('checked',true);
				}
			});
		}
		
	});
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
	
	if(title == '' || $('input:checked').length == 0) {
		alert('No empty fields, boss!');
		return;	
	}
	
	$('input#title').val('');
	var days = [];
	$('input:checked').each(function(){
		days.push($(this).val());
		$(this).prop('checked',false);
	});	
	
		
	var tasks = JSON.parse(localStorage.display);
	
	tasks.push({
		title: title,
		days: days
	});
	//console.log(tasks);
	
	localStorage.display=JSON.stringify(tasks);
	dailyAgenda();
	updateThisOneTinyField();
}

function wipeIt() {
	localStorage.clear(); 
	init(); //  :-)
	dailyAgenda();
	updateThisOneTinyField();
}

function dailyAgenda() {
	var tasks = JSON.parse(localStorage.display);
	var taskSetDisplay = '';
	var titleDisplay = '';
	
	var d = new Date();
	var currentDay = d.getDay()+1; 
	
	var weekday=new Array(7);
	weekday[0]="Sunday";
	weekday[1]="Monday";
	weekday[2]="Tuesday";
	weekday[3]="Wednesday";
	weekday[4]="Thursday";
	weekday[5]="Friday";
	weekday[6]="Saturday";

	var dayName = weekday[currentDay-1]; 
	
	$.each(tasks, function(index, value) {
		if(value.days.indexOf(currentDay.toString()) > -1) {
			titleDisplay += '<li class="js-clickable" data-id='+index+'>'+value.title+'</li>';
		}
	}); 
	
	// setup our daily alerter
	setInterval(function() {
		console.log('checking at the interval...');
    	if(currentDay == 3) {
	    	alert('You need to complete a task today!');
    	}
	}, 60000); //every 60 seconds
	
	taskSetDisplay += '<h3>'+dayName+'</h3><ul>'+titleDisplay+'</ul>';
	$('#agenda').fadeOut(function(){
		$(this).html(taskSetDisplay).fadeIn();
	});
}

	
function updateThisOneTinyField() {
	var tasks = JSON.parse(localStorage.display);
	var taskSetDisplay = '';
	$.each(tasks, function(index, value) {
		// transform the days array to the names of the dates
		var titleDisplay = '';
		var daysDisplay = makeEmWords(value);
				
		titleDisplay += value.title;
				
    	taskSetDisplay += '<h3>'+titleDisplay+'</h3><ul>'+daysDisplay+'</ul>';
	}); 
	
	$('#result').html(taskSetDisplay);
}

function makeEmWords(value) {
	var daysDisplay = '';
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
	return daysDisplay;
}
