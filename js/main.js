function drawCanvas(id, height, width) {
	this.id = id;
	this.height = height;
	this.width = width;
}

drawCanvas.prototype.init = function() {
	var c = document.createElement("canvas");
	c.id = this.id;
	c.height = this.height;
	c.width = this.width;

	this.canvas = c;
	this.ctx = c.getContext("2d");

	document.body.appendChild(c);
};

var canvas;

window.onload = function() {
	canvas = new drawCanvas("draw", 400, 1000);
	canvas.init();
}