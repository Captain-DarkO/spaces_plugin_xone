$(document).ready(function(){
	$(this).click(function (event){
		$event =event.target.id;
		$date =new Date();
		var log =" { 'Event' :'" +$event + ",'Time':"+$date+"  }";
		//console.log(log);
		data = JSON.stringify(log);
		//console.log(data);
		var xhr = new XMLHttpRequest();
		var url = "http://139.59.11.203:8087/api/getlog/1";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(data);
		console.log(data);
		xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        //var json = JSON.parse(xhr.responseText);
        //console.log(json.email + ", " + json.password);
    	}
		};
		//xhr.send(data);
	});
});
