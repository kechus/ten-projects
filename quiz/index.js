class Game {
	constructor(questions = null) {
		this.questionNumber = 0;
		this.score = 0;
		this.correctIndex = 0;
		this.lastAnswerClassname = "";
		this.history = [];

		if (!questions) {
			const questionJson = localStorage.getItem("questions");
			this.questions = JSON.parse(questionJson);
		} else {
			this.questions = questions;
		}
	}

	getQuestion() {
		showCurrentQuestion(this.questions[this.questionNumber]);
	}

	checkIfCheckedIsCorrect() {
		const checkedRadioButton = document.querySelector(
			'input[name="answers"]:checked'
		);
		const correctRadioButton = answersRefs[this.correctIndex];
		const historyData = {
			selectedValue: checkedRadioButton.value,
			correctValue: correctRadioButton.value,
			question: questionRef.innerHTML,
		};
		this.history.push(historyData);
		if (historyData.selectedValue === historyData.correctValue) {
			this.score++;

			this.lastAnswerClassname = "correct";
			showToast("Correct 👍");
		} else {
			this.lastAnswerClassname = "wrong";
			showToast("Wrong 👎");
		}
	}

	showResults() {
		historyCardRef.classList.remove("hidden");
		const scoreRef = document.createElement("h2");
		scoreRef.innerHTML = `Score: ${game.score}`;
		historyCardRef.appendChild(scoreRef);

		for (const historyData of this.history) {
			const historyQuestionRef = document.createElement("p");
			historyQuestionRef.innerHTML = historyData.question;
			historyCardRef.appendChild(historyQuestionRef);

			const correctAnswerRef = document.createElement("p");
			correctAnswerRef.innerHTML = historyData.correctValue;
			correctAnswerRef.classList.add("correct");
			historyCardRef.appendChild(correctAnswerRef);
			if (historyData.correctValue !== historyData.selectedValue) {
				const selectedAnswerDOM = document.createElement("p");
				selectedAnswerDOM.innerHTML = historyData.selectedValue;
				selectedAnswerDOM.classList.add("wrong");
				historyCardRef.appendChild(selectedAnswerDOM);
			}
		}
	}
}

let questionRef;
let historyListRef;
let historyCardRef;
let toastRef;
let interval;
let selectRef;
let mainGameRef;
const answersRefs = [];
const labelAnswersRefs = [];

let selectedCategoryId = -1;
let game;

const CATEGORY_URL = "https://opentdb.com/api_category.php";
const QUESTIONS_URL =
	"https://opentdb.com/api.php?amount=10{categoryPlaceholder}&type=multiple";

window.onload = async () => {
	toastRef = document.getElementById("toast");
	questionRef = document.getElementById("question");
	historyListRef = document.getElementById("history");
	historyCardRef = document.getElementById("history-card");
	selectRef = document.getElementById("category");
	mainGameRef = document.getElementById("main-game");
	answersRefs.push(document.getElementById("answerA"));
	answersRefs.push(document.getElementById("answerB"));
	answersRefs.push(document.getElementById("answerC"));
	answersRefs.push(document.getElementById("answerD"));
	labelAnswersRefs.push(document.getElementById("labelAnswerA"));
	labelAnswersRefs.push(document.getElementById("labelAnswerB"));
	labelAnswersRefs.push(document.getElementById("labelAnswerC"));
	labelAnswersRefs.push(document.getElementById("labelAnswerD"));

	fetch(CATEGORY_URL).then((res) => {
		res.json().then((data) => {
			populateSelect(data);
		});
	});
};

const categoryChanged = (e) => {
	selectedCategoryId = parseInt(e.options[e.selectedIndex].value);
};

const populateSelect = (data) => {
	for (const category of data.trivia_categories) {
		const optionRef = document.createElement("option");
		optionRef.value = category.id;
		optionRef.innerHTML = category.name;
		selectRef.appendChild(optionRef);
	}
};

const startGame = () => {
	document.getElementById("select").classList.add("hidden");
	mainGameRef.classList.remove("hidden");

	let questionsURL = "";
	if (selectedCategoryId === -1) {
		questionsURL = QUESTIONS_URL.replace("{categoryPlaceholder}", "");
	} else {
		questionsURL = QUESTIONS_URL.replace(
			"{categoryPlaceholder}",
			`&category=${selectedCategoryId}`
		);
	}

	fetch(questionsURL).then((res) => {
		res.json().then((data) => {
			game = new Game(data.results);
			game.getQuestion();
		});
	});
};

const next = () => {
	game.checkIfCheckedIsCorrect();
	if (game.questionNumber >= 9) {
		mainGameRef.classList.add("hidden");
		game.showResults();
		return;
	}
	game.questionNumber++;
	game.getQuestion();
};

const showCurrentQuestion = (otdbQuestion) => {
	questionRef.innerHTML = otdbQuestion.question;

	const randomIndex = Math.floor(Math.random() * labelAnswersRefs.length);
	game.correctIndex = randomIndex;
	labelAnswersRefs[randomIndex].innerHTML = otdbQuestion.correct_answer;
	answersRefs[randomIndex].value = otdbQuestion.correct_answer;

	let incorrectAnswerCounter = 0;
	// debugger
	for (let i = 0; i <= answersRefs.length - 1; i++) {
		if (i == randomIndex) {
			continue;
		}
		labelAnswersRefs[i].innerHTML =
			otdbQuestion.incorrect_answers[incorrectAnswerCounter];
		answersRefs[i].value =
			otdbQuestion.incorrect_answers[incorrectAnswerCounter];
		incorrectAnswerCounter++;
	}
};

const hideToast = () => {
	toastRef.classList.remove("toast");
	toastRef.classList.add("hidden");
	toastRef.classList.remove(game.lastAnswerClassname);
};

const showToast = (text) => {
	if (interval) clearInterval(interval);
	toastRef.innerText = text;
	toastRef.classList.add("toast");
	toastRef.classList.remove("hidden");
	toastRef.classList.add(game.lastAnswerClassname);
	interval = setInterval(hideToast, 1500);
};
