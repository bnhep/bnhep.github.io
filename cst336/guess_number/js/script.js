//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);


//Global variables
let randomNumber;
let maxAttempts = 7;
let attempts = 0;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
    console.clear();
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("randomNumber: " + randomNumber);
    attempts = 0;
    console.log("Wins: " + wins);
    console.log("Losses: " + losses);

    let userInput = document.querySelector("#playerGuess");
    userInput.disabled = false;
    //hiding the Reset button
    document.querySelector("#resetBtn").style.display = "none";

    //showing the Guess button
    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    let feedback = document.querySelector("#feedback");
    feedback.style.color = "black";
    feedback.textContent = "Please guess a number between 1-99.";

    document.querySelector("#guesses").textContent = "";

    //show attempts, wins and loss
    let attemptStat = document.querySelector("#attemptStat");
    let winStat = document.querySelector("#winStat");
    let lossStat = document.querySelector("#lossStat");

    //Change the styles of inner <span>
    attemptStat.style.color = "green";
    attemptStat.style.fontWeight = "bold";
    attemptStat.textContent = maxAttempts;
    winStat.style.color = "green";
    winStat.style.fontWeight = "bold";
    winStat.textContent = wins;
    lossStat.style.color = "red";
    lossStat.style.fontWeight = "bold";
    lossStat.textContent = losses;

}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    let prevGuesses = document.querySelector("#guesses")
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player Guess: " + guess);

    // Validate whether the guess are whole numbers, numbers, or not a number
    guess = validateInput(guess);
    if (guess == null){
        return;
    }

    attempts++;
    // Display the remaining attempts
    document.querySelector("#attemptStat").textContent = maxAttempts - attempts;
    console.log("Attempts:" + attempts);
    feedback.style.color = "#CC5500";
    if (guess == randomNumber) {
        feedback.textContent = "Congratulations! You guessed it right. You Win!";
        feedback.style.color = "darkgreen"
        wins++
        //Display the win stat
        document.querySelector("#winStat").textContent = wins;
        gameOver();
    } else {
        // Fixed the guess display to give them commas in between
        prevGuesses.style.color = "red";
        prevGuesses.style.fontWeight = "bold";
        if (attempts === 1){
            document.querySelector("#guesses").textContent += guess;
        }else {
            document.querySelector("#guesses").textContent += ", " + guess;
        }

        if (attempts == 7) {
            let attemptStat = document.querySelector("#attemptStat");
            attemptStat.style.color = "red";
            feedback.textContent = "Sorry, you lost!" + " The correct number was " + randomNumber;
            feedback.style.color = "red";
            losses++
            //Display the loss stat
            document.querySelector("#lossStat").textContent = losses;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was too high";
        } else {
            feedback.textContent = "Guess was too low";
        }
    }

}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    let userInput = document.querySelector("#playerGuess");
    guessBtn.style.display = "none"; //hides Guess button
    resetBtn.style.display = "inline"; //display reset button
    userInput.disabled = true;
}

function validateInput(playerInput) {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = Number(playerInput);

    //Checks if its not a number
    if (isNaN(guess)){
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return null;
    }
    
    //Checks if number is less that one or greater than 99
    if (guess < 1 || guess > 99){
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return null;
    }

    //Double checks if the number is a whole number, no floats,decimals
    if (!Number.isInteger(guess)){
        feedback.textContent = "Enter a number a whole number.";
        feedback.style.color = "red";
        return null;
    }

    return guess;
}
