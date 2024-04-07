let catToWords = new Map();
let wordArr = [];
let correctWords = [];
let wordsToCat = new Map();

let clickedCount = 0;

function setUpNewGame() {
	if (localStorage.getItem("firstGame") == null) {
		localStorage.setItem("wins", 0);
		localStorage.setItem("gPlayed", 0);
		localStorage.setItem("streak", 0);
		localStorage.setItem("avg", 0);
		localStorage.setItem("json", 0);
		localStorage.setItem("firstGame", false);
		localStorage.setItem("totGuesses", 0);
		document.getElementById("submit").disabled = true;
		localStorage.setItem("correctWords", JSON.stringify(correctWords));
	}
	clickedCount = 0;
	document.getElementById("submit").disabled = true;
	localStorage.setItem("categories", null);
	localStorage.setItem("catToWords", null);
	localStorage.setItem("wordsToCat", null);
	localStorage.setItem("board", false);

	catToWords = new Map();
	wordArr = [];
	wordsToCat = new Map();
	//localStorage.setItem("board", false);
	getRandomCategories(makeNewBoard);
	stats();
	//console.log(localStorage.getItem("wins"));
}

function makeNewBoard(newCategories) {
	const categories = newCategories.categories;
	localStorage.setItem("json", JSON.stringify(categories));
	//console.log(localStorage.getItem('json'));
	// console.log(JSON.parse(localStorage.getItem("json")));
	createTable(categories);
}

function createTable(categories) {
	document.getElementById("submit").disabled = true;
	wordArr = [];
	const table = document.createElement("table");
	table.className = "board"; //class for table in css

	categories = JSON.parse(localStorage.getItem("json"));

	for (let i = 0; i < 4; i++) {
		let currCat = categories[i]["category"];
		let tempWordGroup = [];

		//const row = document.createElement("tr"); //

		for (let j = 0; j < 4; j++) {
			//const cell_item = document.createElement("td"); //
			//console.log(categories[i]);
			let word = categories[i].words[j];
			tempWordGroup.push(word);
			wordsToCat.set(word, currCat);

			wordArr.push(word);
			//cell_item.innerHTML = word; //gets the words in table //inner html or inner text??

			//cell_item.addEventListener("click", clickCell);
			//row.appendChild(cell_item);
		}
		//table.appendChild(row);
		catToWords.set(currCat, tempWordGroup);
	}

	localStorage.setItem("wordsToCat", JSON.stringify(Array.from(wordsToCat.entries())));

	//let numWords_left = 0;

	// for (let i = 0; i < wordArr.length; i++) {
	// 	if (!correctWords.includes(wordArr[i])) {
	// 		numWords_left++;
	// 	}
	// }

	//let rowNum = numWords_left / 4;
	let correctWords = JSON.parse(localStorage.getItem("correctWords"));
	let wordsLeft = wordArr.filter((word) => !correctWords.includes(word));
	let rowNum = wordsLeft.length / 4;

	console.log("hi", wordsLeft);

	wordsLeft = wordsLeft.sort(() => Math.random() - 0.5); //shuffles the words

	for (let i = 0; i < rowNum; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < 4; j++) {
			const cellIndex = i * 4 + j; //word index
			if (cellIndex < wordsLeft.length) {
				
				const cell = document.createElement("td");
				cell.innerHTML = wordsLeft[cellIndex];
				cell.addEventListener("click", clickCell);
				row.appendChild(cell); //adding wrd to row
			} else {
				break; //break cuz no more words to add
			}
		}
		table.appendChild(row); // Add the completed row to the table
	}

	//console.log(numWords_left);

	localStorage.setItem(
		"catToWords",
		JSON.stringify(Array.from(catToWords.entries()))
	);
	//console.log(localStorage.getItem("catToWords"));
	// Clear previous table and add the new one to the game board
	const board = document.getElementById("gameboard");

	board.innerHTML = " ";
	board.appendChild(table);
	localStorage.setItem("board", true);
	//console.log(localStorage.getItem("board"));
}

function clickCell(e) {
	// Check if the clicked cell is already selected
	if (e.target.classList.contains("selected")) {
		
		e.target.classList.remove("selected");
		clickedCount--;
		document.getElementById("submit").disabled = true;
	} else {
		if (clickedCount < 4) {
			e.target.classList.add("selected");
			clickedCount++;
			// localStorage.setItem("gPlayed", 7);
			//  stats();
			document.getElementById("submit").disabled = true;
		} else {
			alert("Maximum of 4 cells can be selected at a time");
		}
	}

	if(clickedCount == 4){
		document.getElementById("submit").disabled = false;
	}

}
function stats() {
	var statsDiv = document.querySelector(".stats");

	statsDiv.querySelector("#gamesPlayed").innerHTML =
		localStorage.getItem("gPlayed");
	statsDiv.querySelector("#gamesWon").innerHTML = localStorage.getItem("wins");
	statsDiv.querySelector("#winStreak").innerHTML =
		localStorage.getItem("streak");
	statsDiv.querySelector("#avgGuess").innerHTML = localStorage.getItem("avg");
}

function clearHistory() {
	localStorage.clear();
	setUpNewGame();
}

function increaseGamesPlayed() {
	let gamesPlayed = parseInt(localStorage.getItem("gPlayed"));
	gamesPlayed += 1;
	localStorage.setItem("gPlayed", gamesPlayed);
	stats();
}

let newGameButton = document.getElementById("newgame");
newGameButton.addEventListener("click", setUpNewGame);
newGameButton.addEventListener("click", increaseGamesPlayed);

let clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearHistory);

let shuffButton = document.getElementById("shuffle");
shuffButton.addEventListener("click", createTable);

function submitHandler() {
    // Find all selected cells
    let clickedBoxes = document.querySelectorAll('.selected');
	let subWords = [];

	clickedBoxes.forEach((box) => {
		subWords.push(box.innerHTML);
	});

	//console.log(JSON.parse(localStorage.getItem("wordsToCat")));

	let wtc = new Map(JSON.parse(localStorage.getItem("wordsToCat"))); //words to cat

	
	if(wtc.get(subWords[0]) == wtc.get(subWords[1]) && wtc.get(subWords[1]) == wtc.get(subWords[2]) && wtc.get(subWords[2]) == wtc.get(subWords[3])){
		console.log("Correct!");
		let correctWords = JSON.parse(localStorage.getItem("correctWords"));
		subWords.forEach((word) => {
			correctWords.push(word);
		});
		localStorage.setItem("correctWords", JSON.stringify(correctWords));
		console.log(correctWords);
		createTable(JSON.parse(localStorage.getItem("json")));
		
	}
	else{
		console.log("Incorrect!");
	}

	


}

let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", submitHandler);