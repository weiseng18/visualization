function generateButtons() {
	var ele = get("menu");
	var button;

	button = document.createElement("button");
	button.innerText = "Generate New Array";
	button.addEventListener("click", () => {
		if (!canvas.animationOver)
			canvas.draw(true);
	});
	ele.appendChild(button);

	button = document.createElement("button");
	button.innerText = "Selection Sort";
	button.addEventListener("click", () => {
		if (!canvas.animationOver) {
			cpy = Array.from(canvas.arr);
			selectionSort(cpy);
		}
	});
	ele.appendChild(button);

	button = document.createElement("button");
	button.innerText = "Insertion Sort";
	button.addEventListener("click", () => {
		if (!canvas.animationOver) {
			cpy = Array.from(canvas.arr);
			insertionSort(cpy);
		}
	});
	ele.appendChild(button);

	button = document.createElement("button");
	button.innerText = "Bubble Sort";
	button.addEventListener("click", () => {
		if (!canvas.animationOver) {
			cpy = Array.from(canvas.arr);
			bubbleSort(cpy);
		}
	});
	ele.appendChild(button);
}