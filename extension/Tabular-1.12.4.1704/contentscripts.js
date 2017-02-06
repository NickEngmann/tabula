'use strict';

window.addEventListener("load", function load() {
	// window.removeEventListener("load",load,false); //no longer needed
    //on page load go ahead and get the saved storage elements
    chrome.storage.local.get('tabularResults', function (items) {
	    var results = items['tabularResults'];
	    // alert(results[0]); 
		var tabularDiv2 = document.getElementById('tabularDiv');
			if(tabularDiv2 != null){
			var lengthNodes = tabularDiv2.childNodes.length;
				if(lengthNodes == 0){
					//to get a random array location
					var rN = Math.floor(Math.random()*results.length);
					// tabularDiv2.innerHTML += "<p>"+results[rN]+"</p>";
					var content = document.createElement('div');
					content.setAttribute('id', 'tabularDiv2');
					content.innerHTML += "<p id='tabularInjected'>"+results[rN]+"</p><input id = 'btnSubmit' type='submit' value='Hide'/>";
					tabularDiv2.appendChild(content);
					//place the loaded chrome storage text inside the div

				}
		}
  	});
	var html = document.querySelector('body');
	html.setAttribute('tabul', '');
	html.setAttribute('tabsd', '');
	var tabularDiv = document.createElement('div');
	tabularDiv.setAttribute('id', 'tabularDiv');
	html.appendChild(tabularDiv);
$(document).ready(function() {
    $("#btnSubmit").click(function(){
        $(this).parent().parent().hide();
    }); 
});
});

