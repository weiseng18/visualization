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