$(document).ready(function(){
	init();
	if(typeof(Storage)!=="undefined") {
		agenda();
		dailyAlert();
		taskAlert();
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
						
		//populate the input title
		var title = tasks[taskId].title;
		$form.find('input#title').val(title).focus();
		
		//populate the day checkboxes
		$form.find('input[type=checkbox]').prop('checked',false);
		
		for(var i = 0; i < tasks[taskId].days.length; i++) {
			$form.find('input[type=checkbox]').each(function() {
				if($(this).val() == tasks[taskId].days[i]) {
					$(this).prop('checked',true);
				}
			});
		}
		
		//populate the input times
		$form.find('input#hours').val(tasks[taskId].timeStart.hour);
		$form.find('input#minutes').val(tasks[taskId].timeStart.minute);
		$form.find('input#hoursEnd').val(tasks[taskId].timeEnd.hour);
		$form.find('input#minutesEnd').val(tasks[taskId].timeEnd.minute);
		$form.find('input#repeat').val(tasks[taskId].repeat);
	});
});

function init(){
	//check if the localStorage has been used or this is new
	if(!localStorage.display) {
		var tasks =  [];
		tasks.push({
			title: 'My First Task',
			days: ["3","5"],
			timeStart: {
				hour: "01",
				minute: "27"
			},
			timeEnd: {
				hour: "",
				minute: ""
			},
			repeat: ""
		},
		{
			title: 'Get up and walk',
			days: ["2","3","4","5","6"],
			timeStart: {
				hour: "09",
				minute: "00"
			},
			timeEnd: {
				hour: "17",
				minute: "00"
			},
			repeat: "60"
		},
		{
			title: 'Guitar',
			days: ["2","4","6"],
			timeStart: {
				hour: "18",
				minute: "00"
			},
			timeEnd: {
				hour: "19",
				minute: "00"
			},
			repeat: "20"
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
	}, 60000);
}

function taskAlert() {
	setInterval(function() {
		var tasks = JSON.parse(localStorage.display);
		var d = new Date();
		var currentDay = d.getDay()+1;
		var hour = d.getHours();
		var minute = d.getMinutes();
					
		var titleDisplay = '';
		$.each(tasks, function(index, value) {
			var starting=parseInt(value.timeStart.hour+value.timeStart.minute);
			var ending=parseInt(value.timeEnd.hour+value.timeEnd.minute);
			var minuteString=minute.toString();
			if(minuteString.length < 2)
				var minuteString = '0'+minute.toString();
			var current=parseInt(hour.toString()+minuteString);
			var repeatFreq = parseInt(value.repeat);
			if(current == starting || (current > starting && current < ending && (current-starting)%repeatFreq == 0)) {
				console.log('Do this now:'+value.title);
			}
			console.log('Addition:'+starting+'-'+ending+'Current'+current);
			//console.log((current-starting)%repeatFreq);
		});
/*		
			if(value.days.indexOf(currentDay.toString()) > -1) {
				titleDisplay += value.title+'\n';
			}
		}); 
		
		alert('You need to complete a task today!\n'+titleDisplay);
    	
		console.log('Checking for 0530, every 1 minute '+d.getHours()+d.getMinutes());
*/
	}, 3000);
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
	//$('input#title').val('');
	
	//For each checked input box, push the value to the array "days", then uncheck box (the unchecking is no longer necessary as form reset is done at end of function).
	$('input:checked').each(function(){
		days.push($(this).val());
	//	$(this).prop('checked',false);
	});	
	
	//Set object "tasks" to what was previously saved to local storage
	var tasks = JSON.parse(localStorage.display);
	
	var $form = $('div#interaction form');
	
	//If user is editing an existing task, save over that task; 'data-id' was set in the main function upon a click event with '$form.attr('data-id',taskId);'
	if($form.attr('data-id')) {
		tasks[$form.attr('data-id')] = {
			title: title,
			days: days,
			timeStart: {
				hour: $('input#hours').val(),
				minute: $('input#minutes').val()
			},
			timeEnd: {
				hour: $('input#hoursEnd').val(),
				minute: $('input#minutesEnd').val()
			},
			repeat: $('input#repeat').val()
		};
	}
	else{
		//Add to "tasks" new items user just submitted.
		tasks.push({
			title: title,
			days: days,
			timeStart: {
				hour: $('input#hours').val(),
				minute: $('input#minutes').val()
			},
			timeEnd: {
				hour: $('input#hoursEnd').val(),
				minute: $('input#minutesEnd').val()
			},
			repeat: $('input#repeat').val()
		});
	}
	
	
	console.log('Added: '+title+' '+days+' '+$('input#hours').val()+':'+$('input#minutes').val()+'-'+$('input#hoursEnd').val()+':'+$('input#minutesEnd').val()+' R:'+$('input#repeat').val()+' Total tasks: '+Object.keys(tasks).length);
	console.log(tasks);
	
	//Reset form
	$form[0].reset();
	$form.attr('data-id','');
	
	//Save to local storage
	localStorage.display=JSON.stringify(tasks);
	
	//Reload agenda
	agenda();
}

function deleteIt() {
	//Set object "tasks" to what was previously saved to local storage
	var tasks = JSON.parse(localStorage.display);
	var $form = $('div#interaction form');
	var days = [];
	
	//For each checked input box, push the value to the array "days".  Currently this is only used to create a log of what was deleted.
	$('input:checked').each(function(){
		days.push($(this).val());
	});	
	
	
	
	//If user is trying to delete existing task, remove that task, otherwise provide alert; 'data-id' was set in the main function upon a click event with '$form.attr('data-id',taskId);'
	if($form.attr('data-id')) {
		delete tasks[$form.attr('data-id')];
		tasks.splice($form.attr('data-id'),1);
	}
	else{
		//Add to "tasks" new items user just submitted.
		alert('Nothing to delete!');
	}

	
	console.log('Removed: '+$('input#title').val()+' '+days+' '+$('input#hours').val()+':'+$('input#minutes').val()+'-'+$('input#hoursEnd').val()+':'+$('input#minutesEnd').val()+' R:'+$('input#repeat').val()+' Total tasks: '+Object.keys(tasks).length);
	console.log(tasks);
	
	//Reset form
	$form[0].reset();
	$form.attr('data-id','');
	
	//Save to local storage
	localStorage.display=JSON.stringify(tasks);
	
	//Reload agenda
	agenda();
}

function resetTasks() {
	localStorage.clear(); 
	init(); //  :-)
	agenda();
}

function agenda() {
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
	
	var weekdayAbr=new Array(7);
	weekdayAbr[0]="Sun";
	weekdayAbr[1]="Mon";
	weekdayAbr[2]="Tues";
	weekdayAbr[3]="Wed";
	weekdayAbr[4]="Thur";
	weekdayAbr[5]="Fri";
	weekdayAbr[6]="Sat";
	
	for(var i=0;i<7;i++){
		if(currentDay > 7)
			currentDay = currentDay - 7;
			var dayName = weekday[currentDay-1];
		$.each(tasks, function(index, value) {
			if(value.days.indexOf(currentDay.toString()) > -1) {
				titleDisplay += '<li class="js-clickable" data-id='+index+'> > '+value.title+': <span>';
				$.each(value.days, function(index, valueTwo) {
					var dayNameAbr = weekdayAbr[valueTwo-1];
					titleDisplay += ' '+dayNameAbr+' ';
				});
				titleDisplay = titleDisplay+value.timeStart.hour+value.timeStart.minute+'-'+value.timeEnd.hour+value.timeEnd.minute+' R:'+value.repeat+'</span></li>';
			}
		}); 
		taskSetDisplay += '<h3>'+dayName+'</h3><ul>'+titleDisplay+'</ul>';
		titleDisplay = '';
		currentDay++;
	}
	
	
	$('#agenda').fadeOut(function(){
		$(this).html(taskSetDisplay).fadeIn();
	});
}






/*	
function updateThisOneTinyField() {
	var tasks = JSON.parse(localStorage.display);
	var taskSetDisplay = '';
	$.each(tasks, function(index, value) {
		// transform the days array to the names of the dates

		var daysDisplay = makeEmWords(value);
						
    	taskSetDisplay += '<h3>'+value.title+'</h3><ul>'+daysDisplay+'</ul><ul>'+value.timeStart.hour+':'+value.timeStart.minute+'</ul>';
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
*/
