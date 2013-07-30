$(document).ready(function(){
	init();
	if(typeof(Storage)!=="undefined")
	  {
		dailyAgenda();
		updateThisOneTinyField();
		dailyAlert();
	  }
	else
	{
		$('#result').innerHTML="Sorry, your browser does not support web storage...";
	}
	$('div#agenda').on('click','li.js-clickable',function(){
		var taskId = $(this).attr('data-id');
		var tasks = JSON.parse(localStorage.display);
		
		var $form = $('div#interaction form');
		
		//Set form attribute 'data-id' to index number of item being edited
		$form.attr('data-id',taskId); 
						
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
		
		//change the input times
		$form.find('input#hours').val(tasks[taskId].time.hour);
		$form.find('input#minutes').val(tasks[taskId].time.minute);
	});
});

function init(){
	//check if the localStorage has been used or this is new
	if(!localStorage.display) {
		var tasks =  [];
		tasks.push({
			title: 'My First Task',
			days: ["3","5"],
			time: {
				hour: "01",
				minute: "27"
			}
		});
		localStorage.display=JSON.stringify(tasks);	
	}
}

function dailyAlert() {
	setInterval(function() {
		var d = new Date();
		var currentDay = d.getDay()+1;
		if(d.getHours() == '05' && d.getMinutes() == '30') {
			var tasks = JSON.parse(localStorage.display);
			var titleDisplay = '';
			$.each(tasks, function(index, value) {
				if(value.days.indexOf(currentDay.toString()) > -1) {
				titleDisplay += value.title+'\n';
			}
		}); 
		alert('You need to complete a task today!\n'+titleDisplay);
    	}
		console.log('Checking for 0530, every 1 minute '+d.getHours()+d.getMinutes());
	}, 60000); //every 10 seconds
}
	
	
			
function addIt() {
	var title = $('input#title').val();	//Stores title from HTML
	var days = [];
				
	//Check for empty fields
	if(title == '' || $('input:checked').length == 0) {
		alert('No empty fields, boss!');
		return;	
	}
	
	//Reset title field to null
	$('input#title').val('');
	
	//For each checked input box, push the value to the array "days", then uncheck box.
	$('input:checked').each(function(){
		days.push($(this).val());
		$(this).prop('checked',false);
	});	
	
	//Set object "tasks" to what was previously saved to local storage
	var tasks = JSON.parse(localStorage.display);
	
	var $form = $('div#interaction form');
		
	if($form.attr('data-id')) {
		tasks[$form.attr('data-id')] = {
			title: title,
			days: days,
			time: {
				hour: $('input#hours').val(),
				minute: $('input#minutes').val()
			}
		};
	}
	else{
		//Add to "tasks" new items user just submitted.
		tasks.push({
			title: title,
			days: days,
			time: {
				hour: $('input#hours').val(),
				minute: $('input#minutes').val()
			}
		});
	}
	

	//console.log('Added: '+title+' '+days+' '+tasks.time.hour+':'+tasks.time.minute+'Total tasks: '+Object.keys(tasks).length);
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
/*
	getHours()
	getMinutes()
*/

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

		var daysDisplay = makeEmWords(value);
						
    	taskSetDisplay += '<h3>'+value.title+'</h3><ul>'+daysDisplay+'</ul><ul>'+value.time.hour+':'+value.time.minute+'</ul>';
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
