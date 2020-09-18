// this function performs selection sort on input arr
// it calls schedule() with the list of processes
function selectionSort(arr) {
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

	canvas.schedule(processes);
}