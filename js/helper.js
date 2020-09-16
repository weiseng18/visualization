function get(id) {
	return document.getElementById(id);
}

function randomArray(length, min, max) {
	var arr = [];
	var range = max - min + 1;
	for (var i=0; i<length; i++) {
		var num = Math.floor(Math.random() * range) + min;
		arr.push(num);
	}
	return arr;
}