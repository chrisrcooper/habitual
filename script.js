if(typeof(Storage)!=="undefined")
  {
  localStorage.task="20 pushups";
  document.getElementById("result").innerHTML="Task: " + localStorage.lastname;
  }
else
  {
  document.getElementById("result").innerHTML="Sorry, your browser does not support web storage...";
  }