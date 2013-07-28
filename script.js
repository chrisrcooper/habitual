$(document).ready(function(){
	inIt();
	if(typeof(Storage)!=="undefined")
	  {
	  updateThisOneTinyField();
	  }
	else
	  {
	  $('#result').innerHTML="Sorry, your browser does not support web storage...";
	}
});

function inIt(){
	if(!localStorage.display)
		localStorage.display=JSON.stringify(['default']);
}
			
function addIt() {
	task=JSON.parse(localStorage.display);
	task.push($('input#title.user-input').val());
	localStorage.display=JSON.stringify(task);
	//alert(localStorage.task);
	updateThisOneTinyField();
	}
	
function updateThisOneTinyField() {
	//console.log(JSON.parse(localStorage.display));
	$('#result').html("Task: " + JSON.parse(localStorage.display));
	}