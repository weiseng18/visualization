function drawCanvas(id, height, width, padding) {
	this.id = id;
	this.height = height;
	this.width = width;

	this.padding = padding;

	this.rectWidth = padding;
	this.rectMaxHeight = height - 3*padding;
	this.locations = [];

	// variables used in swap() function
	this.animationRunning = false;

	this.bindmove = this.move.bind(this);
	this.layers = [];
	this.layersCtx = [];
	this.mapping = [];
	this.timeTaken = null;
	this.timePrev = null;

	// colors
	this.color_orig = "#0066cc";
	this.color_highlight = "#cc0052";
	this.color_sorted = "#1f7a1f";
}

drawCanvas.prototype.init = function() {
	var c = document.createElement("canvas");
	c.id = this.id;
	c.height = this.height;
	c.width = this.width;

	c.className = "canvasLayer";

	this.canvas = c;
	this.ctx = c.getContext("2d");

	get("canvasArea").appendChild(c);
};

// base of each rectangle should be aligned
// height of each rectangle should be relative to the data value
drawCanvas.prototype.drawArrayData = function(arr) {
	this.ctx.fillStyle = this.color_orig;
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
						numY: numY,
						highlight: false,
						sorted: false};
		this.locations.push(location);
	}
}

// this function toggles between color_orig and color_highlight to identify if an element is highlighted
drawCanvas.prototype.toggleHighlight = function(idx) {
	// unwrap
	var value = this.locations[idx].value,
		topLeftX = this.locations[idx].topLeftX,
		topLeftY = this.locations[idx].topLeftY,
		width = this.locations[idx].width,
		height = this.locations[idx].height,
		numX = this.locations[idx].numX,
		numY = this.locations[idx].numY,
		highlight = this.locations[idx].highlight,
		sorted = this.locations[idx].sorted;

	// step 1: delete area from topLeft to (bottomRightX, this.height)
	this.ctx.clearRect(topLeftX, 0, width, this.height);

	// step 2: draw correctly highlighted version
	if (highlight) {
		this.ctx.fillStyle = this.color_orig;
		this.locations[idx].highlight = false;
	}
	else {
		this.ctx.fillStyle = this.color_highlight;
		this.locations[idx].highlight = true;
	}
	this.ctx.textAlign = "center";
	this.ctx.font = "15px Arial";

	this.ctx.fillRect(topLeftX, topLeftY, width, height);
	this.ctx.fillText(value, numX, numY);
}

// this function changes the color to color_sorted to identify that an element is put in the correct position
drawCanvas.prototype.markSorted = function(idx) {
	// unwrap
	var value = this.locations[idx].value,
		topLeftX = this.locations[idx].topLeftX,
		topLeftY = this.locations[idx].topLeftY,
		width = this.locations[idx].width,
		height = this.locations[idx].height,
		numX = this.locations[idx].numX,
		numY = this.locations[idx].numY,
		highlight = this.locations[idx].highlight,
		sorted = this.locations[idx].sorted;

	// step 1: delete area from topLeft to (bottomRightX, this.height)
	this.ctx.clearRect(topLeftX, 0, width, this.height);

	// step 2: mark as sorted
	this.locations[idx].sorted = true;

	this.ctx.fillStyle = this.color_sorted;
	this.ctx.textAlign = "center";
	this.ctx.font = "15px Arial";

	this.ctx.fillRect(topLeftX, topLeftY, width, height);
	this.ctx.fillText(value, numX, numY);
}

// swap position a and position b
// assumes the two positions are both highlighted, so it will remain highlighted throughout
drawCanvas.prototype.swap = function(a, b) {
	if (this.animationRunning)
		return;

	// step 0: provide simple mapping for for loops
	// this maps 0->a and 1->b so that for loops can be executed easily
	this.mapping = [a, b];

	// step 1: clear a and b from original
	// step 2: create 2 new canvas, drawing a and b respectively
	this.layers = [], this.layersCtx = [];
	for (var i=0; i<2; i++) {
		var data = this.locations[this.mapping[i]];
		// step 1: clear a and b from original
		this.ctx.clearRect(data.topLeftX, 0, data.width, this.height);

		// step 2: create 2 new canvas, drawing a and b respectively

		// define the canvas
		this.layers[i] = document.createElement("canvas");
		this.layers[i].height = this.height;
		this.layers[i].width = this.width;
		this.layers[i].className = "canvasLayer";

		// set id and z-index
		var numericalLayer = (i+1).toString();
		this.layers[i].id = "layer" + numericalLayer;
		this.layers[i].style.zIndex = numericalLayer;

		// set canvas drawing styles
		this.layersCtx[i] = this.layers[i].getContext("2d");
		this.layersCtx[i].fillStyle = data.highlight ? this.color_highlight : this.color_orig;
		this.layersCtx[i].textAlign = "center";
		this.layersCtx[i].font = "15px Arial";

		// draw the rectangle and the number
		this.layersCtx[i].fillRect(data.topLeftX, data.topLeftY, data.width, data.height);
		this.layersCtx[i].fillText(data.value, data.numX, data.numY);

		// append canvas to #canvasArea
		get("canvasArea").appendChild(this.layers[i]);
	}

	// step 3: move a and b

	// step 3.1: define some constants
	//           such as the time taken for animation to complete

	this.timePrev = undefined;

	// step 3.2: start animation frame
	window.requestAnimationFrame(this.bindmove);

	// step 4: write a and b back into the original canvas
	// this step is written in move() where you can check that the animation is complete

	// step 5: perform the actual swap
	// this step is also written in move()
}

drawCanvas.prototype.move = function(timestamp) {
	if (this.timePrev === undefined) {
		this.timePrev = timestamp;
		this.animationRunning = true;
	}

	var elapsed = timestamp - this.timePrev;
	var percentageElapsed = Math.min(elapsed / this.timeTaken, 1);

	var totalDeltaX = this.locations[this.mapping[1]].topLeftX - this.locations[this.mapping[0]].topLeftX;

	var deltaX = percentageElapsed * totalDeltaX;

	for (var i=0; i<2; i++) {
		var data = this.locations[this.mapping[i]];

		// tentatively will clear whole canvas unless performance issues
		this.layersCtx[i].clearRect(0, 0, this.width, this.height);
		this.layersCtx[i].fillRect(data.topLeftX + deltaX, data.topLeftY, data.width, data.height);
		this.layersCtx[i].fillText(data.value, data.numX + deltaX, data.numY);

		// this is to make the 2nd element go to the left
		deltaX *= -1;
	}

	if (elapsed < this.timeTaken)
		window.requestAnimationFrame(this.bindmove);
	else {
		this.ctx.textAlign = "center";
		this.ctx.font = "15px Arial";

		// step 4: write a and b back into the original canvas
		for (var i=0; i<2; i++) {
			var data = this.locations[this.mapping[i]];

			this.ctx.fillStyle = data.highlight ? this.color_highlight : this.color_orig;

			this.ctx.fillRect(data.topLeftX + deltaX, data.topLeftY, data.width, data.height);
			this.ctx.fillText(data.value, data.numX + deltaX, data.numY);

			// remove element from DOM
			var elem = get("layer"+ (i+1).toString());
			elem.parentNode.removeChild(elem);
			// this is to make the 2nd element go to the left
			deltaX *= -1;
		}

		// step 5: perform the actual swap of data
		// currently, the only values that should change is .topLeftX and .numX
		// thus, it will be easier to just modify those values directly
		//
		// in addition, because of the current implementation of the move() function in that
		// the position is not being updated every frame; rather the delta is calculated and it is added to the original position,
		// without modifying the original position, thus there is no whole replacement for locations[a] and locations[b]

		// update positions
		this.locations[this.mapping[0]].topLeftX += deltaX;
		this.locations[this.mapping[0]].numX += deltaX;
		this.locations[this.mapping[1]].topLeftX -= deltaX;
		this.locations[this.mapping[1]].numX -= deltaX;

		[this.locations[this.mapping[0]], this.locations[this.mapping[1]]] = [this.locations[this.mapping[1]], this.locations[this.mapping[0]]]

		this.animationRunning = false;
	}
}

// this function takes in an array of processess
// calculates and executes the setTimeouts
//
// 1000 ms delay for each swap
// 0 ms delay for each highlight
//
// processes data format
//
// type: swap
// a, b: specifies the two indices to swap
//
// type: highlight
// a: specifies the index to highlight
//
// type: compare
// a, b: specifies comparing a and b

drawCanvas.prototype.schedule = function(processes) {
	this.timeTaken = 1000;  // unit is ms

	var totalDelay = 0;

	for (var i=0; i<processes.length; i++) {
		let p = processes[i];
		if (p.type == "swap") {
			setTimeout(() => { this.swap(p.a, p.b); }, totalDelay);

			// add extra delay for highlighting after a swap
			totalDelay += 2*this.timeTaken;
		}
		else if (p.type == "compare") {
			// highlight a and b
			setTimeout(() => { this.toggleHighlight(p.a) }, totalDelay);
			setTimeout(() => { this.toggleHighlight(p.b) }, totalDelay);

			totalDelay += this.timeTaken;

			// unhighlight a and b
			setTimeout(() => { this.toggleHighlight(p.a) }, totalDelay);
			setTimeout(() => { this.toggleHighlight(p.b) }, totalDelay);
		}
		else if (p.type == "highlight") {
			// this highlight is only triggered to emphasize something
			// such as showing the minimum in the selection sort

			// highlight
			setTimeout(() => { this.toggleHighlight(p.a) }, totalDelay);
			totalDelay += this.timeTaken;
		}
		else if (p.type == "sorted") {
			// this highlight is only triggered to emphasize something
			// such as showing the minimum in the selection sort

			// highlight
			setTimeout(() => { this.markSorted(p.a) }, totalDelay);
			totalDelay += this.timeTaken;
		}
	}
}

// generates a new array and draws
function generateAndDraw() {
	arr = randomArray(10, 1, 100);
	canvas.drawArrayData(arr);
}

var canvas;

var arr;

window.onload = function() {
	canvas = new drawCanvas("draw", 400, 1000, 20);
	canvas.init();

	generateAndDraw();
}