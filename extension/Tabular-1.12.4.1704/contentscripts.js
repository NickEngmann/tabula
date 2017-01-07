'use strict';

window.addEventListener("load", function() {
	var html = document.querySelector('body');
	html.setAttribute('tabul', '');
	html.setAttribute('tabsd', '');

	var tabularDiv = document.createElement('div');
	tabularDiv.setAttribute('id', 'tabularDiv');
	html.appendChild(tabularDiv);
});