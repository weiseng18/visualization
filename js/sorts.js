// this function performs selection sort on input arr
// it calls schedule() with the list of processes
function selectionSort(arr) {
	canvas.draw(false);

	var processes = [];

	var length = arr.length;

	for (var i=0; i<length; i++) {
		var minIdx = i;
		for (var j=i+1; j<length; j++) {
			processes.push( {type:"compare", a:minIdx, b:j} );
			if (arr[minIdx] > arr[j])
				minIdx = j;
		}
		if (i != length-1)
			processes.push( {type:"highlight", a:minIdx} );
		if (minIdx != i) {
			processes.push( {type:"swap", a:i, b:minIdx} );
			[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
		}
		processes.push( {type:"sorted", a:i} );
	}

	canvas.schedule(processes);
}

function insertionSort(arr) {
	canvas.draw(false);

	var processes = [];

	var length = arr.length;

	processes.push( {type:"sorted", a:0} );

	for (var i=1; i<length; i++) {
		let rptr = i;
		processes.push( {type:"compare", a:rptr-1, b:rptr} );
		while (rptr > 0 && arr[rptr-1] > arr[rptr]) {
			// highlight rptr as it is lower
			processes.push( {type:"highlight", a:rptr} );

			// perform swap
			processes.push( {type:"swap", a:rptr-1, b:rptr} );
			[arr[rptr-1], arr[rptr]] = [arr[rptr], arr[rptr-1]];

			// update rptr
			rptr--;

			// unhighlight rptr
			processes.push( {type:"highlight_nodelay", a:rptr} );

			if (rptr > 0)
				processes.push( {type:"compare", a:rptr-1, b:rptr} );
		}
		processes.push( {type:"sorted", a:rptr} );
	}

}

function bubbleSort(arr) {
	canvas.draw(false);

	var processes = [];

	var sortedFromIndex = arr.length;

	while (sortedFromIndex > 1) {
		var next_sortedFromIndex = 0;
		for (var i=1; i<=sortedFromIndex-1; i++) {
			processes.push( {type:"compare", a:i-1, b:i} );
			// if the pair is in the wrong order
			if (arr[i-1] > arr[i]) {
				processes.push( {type:"swap", a:i-1, b:i} );
				[arr[i-1], arr[i]] = [arr[i], arr[i-1]];
				next_sortedFromIndex = i;
			}
		}
		// anything after the final swap in a single pass
		// does not need to be checked further as they are all in the correct position.
		// in the ith pass, the last >= i elements are sorted.
		for (var i=next_sortedFromIndex; i<sortedFromIndex; i++)
			processes.push( {type:"sorted", a:i} );

		sortedFromIndex = next_sortedFromIndex;
	}

	canvas.schedule(processes);
}