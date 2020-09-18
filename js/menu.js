function generateButtons() {
	var ele = get("menu");
	var button;

	button = document.createElement("button");
	button.innerText = "Generate New Array";
	button.addEventListener("click", () => {
		if (!canvas.animationOver)
			canvas.draw();
	});
	ele.appendChild(button);

	button = document.createElement("button");
	button.innerText = "Selection Sort";
	button.addEventListener("click", () => {
		if (!canvas.animationOver)
			selectionSort(arr);
	});
	ele.appendChild(button);

	button = document.createElement("button");
	button.innerText = "Insertion Sort";
	button.addEventListener("click", () => {
		if (!canvas.animationOver)
			insertionSort(arr);
	});
	ele.appendChild(button);
}