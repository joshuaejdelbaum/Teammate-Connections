const puzzle = [
    {
        category: "MANCHESTER UNITED",
        words: ["ROONEY", "GIGGS", "SCHOLES", "FERDINAND"]
    },
    {
        category: "LIVERPOOL",
        words: ["GERRARD", "CARRAGHER", "TORRES", "ALONSO"]
    },
    {
        category: "ARSENAL",
        words: ["HENRY", "BERGKAMP", "VIEIRA", "CAMPBELL"]
    },
    {
        category: "CHELSEA",
        words: ["LAMPARD", "TERRY", "DROGBA", "COLE"]
    }
];

let remainingGroups = [...puzzle];
let selectedWords = [];
let mistakes = 4;

const board = document.getElementById("board");
const submitButton = document.getElementById("submit");
const newGameButton = document.getElementById("new-game");
const mistakesDisplay = document.getElementById("mistakes");
const message = document.getElementById("message");
const groupsDisplay = document.getElementById("groups");

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function startGame() {

    remainingGroups = [...puzzle];
    selectedWords = [];
    mistakes = 4;

    mistakesDisplay.textContent = mistakes;
    message.textContent = "";
    groupsDisplay.innerHTML = "";

    let words = [];

    remainingGroups.forEach(group => {
        group.words.forEach(word => {
            words.push({
                word: word,
                category: group.category
            });
        });
    });

    words = shuffle(words);

    board.innerHTML = "";

    words.forEach(item => {

        const button = document.createElement("button");

        button.className = "word";
        button.textContent = item.word;

        button.dataset.word = item.word;
        button.dataset.category = item.category;

        button.addEventListener("click", () => selectWord(button));

        board.appendChild(button);
    });
}

function selectWord(button) {

    if (button.classList.contains("correct")) {
        return;
    }

    const word = button.dataset.word;

    if (selectedWords.includes(word)) {

        selectedWords = selectedWords.filter(
            selected => selected !== word
        );

        button.classList.remove("selected");

    } else {

        if (selectedWords.length >= 4) {
            return;
        }

        selectedWords.push(word);
        button.classList.add("selected");
    }
}

submitButton.addEventListener("click", checkSelection);

function checkSelection() {

    if (selectedWords.length !== 4) {

        message.textContent = "Select exactly four players.";

        return;
    }

    const selectedButtons = [
        ...document.querySelectorAll(".word.selected")
    ];

    const categories = selectedButtons.map(
        button => button.dataset.category
    );

    const firstCategory = categories[0];

    const isCorrect = categories.every(
        category => category === firstCategory
    );

    if (isCorrect) {

        const solvedGroup = remainingGroups.find(
            group => group.category === firstCategory
        );

        message.textContent = "Correct! ⚽";

        selectedButtons.forEach(button => {

            button.classList.remove("selected");
            button.classList.add("correct");
            button.disabled = true;

        });

        displayGroup(solvedGroup);

        remainingGroups = remainingGroups.filter(
            group => group.category !== firstCategory
        );

        selectedWords = [];

        if (remainingGroups.length === 0) {

            message.textContent =
                "Full time! You solved the puzzle! 🏆";

        }

    } else {

        mistakes--;

        mistakesDisplay.textContent = mistakes;

        message.textContent = "Not quite. Try again.";

        selectedButtons.forEach(button => {
            button.classList.remove("selected");
        });

        selectedWords = [];

        if (mistakes === 0) {

            message.textContent =
                "Full time! Click New Game to try again.";

            submitButton.disabled = true;
        }
    }
}

function displayGroup(group) {

    const groupElement = document.createElement("div");

    groupElement.className = "group";

    groupElement.innerHTML = `
        <span class="group-title">${group.category}</span>
        <span class="group-words">${group.words.join(", ")}</span>
    `;

    groupsDisplay.appendChild(groupElement);
}

newGameButton.addEventListener("click", () => {

    submitButton.disabled = false;

    startGame();

});

startGame();
