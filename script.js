if(typeof(Storage)!=="undefined")
  {
  localStorage.task2="15 minutes of guitar";
  document.getElementById("result").innerHTML="Task: " + localStorage.task + "<br>" + localStorage.task2;
  }
else
  {
  document.getElementById("result").innerHTML="Sorry, your browser does not support web storage...";
  }