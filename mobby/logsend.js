$(document).ready(function(){
	$(this).click(function (event){
		$event=event.target.id;
		var xhr = new XMLHttpRequest();
		var url = "http://139.59.11.203:8083/api/getlog/1";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        //var json = JSON.parse(xhr.responseText);
        //console.log(json.email + ", " + json.password);
    	}
		};
		var tmp =JSON.stringify({"Event" : $event});
		xhr.send(tmp);
	});
	$("#close").on("click",function(e){
		 $(".slide").animate({right:'-200'},350);
		 $(this).hide()
	})
});
function toggleDiv(divNum) {
    $("#close").hide();
    $(".slide").animate({right:'-200'},350);
    if($("#div"+divNum)) {
        $("#div"+divNum).animate({right:'0'},350,function(){$("#close").show();});
    }
}
