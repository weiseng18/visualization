function drawCanvas(id, height, width, padding) {
	this.id = id;
	this.height = height;
	this.width = width;

	this.padding = padding;

	this.rectWidth = padding;
	this.rectMaxHeight = height - 3*padding;
	this.locations = [];
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

// base of each rectangle should be aligned
// height of each rectangle should be relative to the data value
drawCanvas.prototype.drawArrayData = function(arr) {
	this.ctx.fillStyle = "#0066cc";
	this.ctx.textAlign = "center";
	this.ctx.font = "15px Arial";

	var max = Math.max(...arr);
	for (var i=0; i<arr.length; i++) {
		// scale height
		var height = arr[i]/max * this.rectMaxHeight;
		var width = this.rectWidth;

		var bottomRightX = 2*this.padding * (i+1);
		// -2*this.padding to allocate vertical height to draw the number
		var bottomRightY = this.height - 2*this.padding;

		var topLeftX = bottomRightX - width;
		var topLeftY = bottomRightY - height;

		this.ctx.fillRect(topLeftX, topLeftY, width, height);

		// calculate position to draw the number
		var numX = bottomRightX - width / 2;
		var numY = bottomRightY + this.padding;
		this.ctx.fillText(arr[i], numX, numY);

		// save location data
		var location = {value: arr[i],
						topLeftX: topLeftX,
						topLeftY: topLeftY,
						width: width,
						height: height,
						numX: numX,
						numY: numY};
		this.locations.push(location);
	}
}

drawCanvas.prototype.toggleHighlight = function(idx, highlight) {
	// unwrap
	var value = this.locations[idx].value,
		topLeftX = this.locations[idx].topLeftX,
		topLeftY = this.locations[idx].topLeftY,
		width = this.locations[idx].width;
		height = this.locations[idx].height;
		numX = this.locations[idx].numX;
		numY = this.locations[idx].numY;

	// step 1: delete area from topLeft to (bottomRightX, this.height)
	this.ctx.clearRect(topLeftX, topLeftY, width, this.height - topLeftY);

	// step 2: draw highlighted version
	this.ctx.fillStyle = highlight ? "#cc0052" : "#0066cc";
	this.ctx.textAlign = "center";
	this.ctx.font = "15px Arial";

	this.ctx.fillRect(topLeftX, topLeftY, width, height);
	this.ctx.fillText(value, numX, numY);
}

var canvas;

window.onload = function() {
	canvas = new drawCanvas("draw", 400, 1000, 20);
	canvas.init();
}