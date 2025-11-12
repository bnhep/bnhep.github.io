//Event Listeners
document.querySelector("#q5Lock").addEventListener("click", toggleLockQ5);
//updates the input range with the bar
document.querySelector("#rangeLakes").addEventListener("input", displayRange);
//updates the input range with the textbox
document.querySelector("#lakeCountDisplay").addEventListener("input", updateRange);
document.querySelector("#q10Btn").addEventListener("click", q10Enter);
document.querySelector("#submitBtn").addEventListener("click", gradeQuiz);
document.querySelector("#resetBtn").addEventListener("click", redoQuiz);

//Global Variables
var score = 0;
var attempts = localStorage.getItem("total_attempts");
var locked = false;
let q5Answers = [];
let carouselImg = document.querySelectorAll(".carousel-item img");
let selectImg = null;

//Call functions to randomize choices
displayQ4Choices();
displayQ5Choices();
addImageListenerQ9();


//functions
function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    q4ChoicesArray = _.shuffle(q4ChoicesArray);
    for (let i = 0; i < q4ChoicesArray.length; i++) {
        document.querySelector("#q4Choices").innerHTML += ` <input type="radio" name="q4" id="${q4ChoicesArray[i]}"
        value ="${q4ChoicesArray[i]}"> <label for="${q4ChoicesArray[i]}"> ${q4ChoicesArray[i]}</label>`;
    }
}//displayQ4Choices

function isFormValid() {
    let isValid = true;
    let feedback = document.querySelector("#validationFdbk");

    //Question 1
    if (document.querySelector("#q1").value == "") {
        isValid = false;
        document.querySelector("#validationFdbk").innerHTML = "Question 1 was not answered.<br>";
    }

    //Question 2
    if (document.querySelector("#q2").value === "") {
        feedback.innerHTML += "Question 2 was not answered. Please select one.<br>";
        isValid = false;
    }

    //Question 3
    let q3Answers = ["Jackson", "Franklin", "Jefferson", "Roosevelt"];
    let q3Answered = false;
    for (let i = 0; i < q3Answers.length; i++) {
        if (document.querySelector(`#${q3Answers[i]}`).checked) {
            q3Answered = true;
            break;
        }
    }
    if (!q3Answered) {
        feedback.innerHTML += "Question 3 was not answered. Please check at least one box.<br>";
        isValid = false;
    }

    //Question 4
    if (!document.querySelector("input[name='q4']:checked")) {
        feedback.innerHTML += "Question 4 was not answered.<br>";
        isValid = false;
    }

    //Question 5
    if (!locked || q5Answers.length != 3) {
        feedback.innerHTML += "Question 5 must be locked with 3 answers.<br>";
        isValid = false;
    }

    //Question 6
    let q6Answer = Number(document.querySelector("#lakeCountDisplay").value);
    if (isNaN(q6Answer) || q6Answer < 0 || q6Answer > 20000 || !Number.isInteger(q6Answer)) {
        feedback.innerHTML += "Question 6 must have a valid lake count.<br>";
        isValid = false;
    }

    //Question 7
    if (!document.querySelector("input[name='q7']:checked")) {
        feedback.innerHTML += "Question 7 was not answered.<br>";
        isValid = false;
    }

    //Question 8
    if (
        document.querySelector("#q8first").value === "" ||
        document.querySelector("#q8second").value === "" ||
        document.querySelector("#q8third").value === ""
    ) {
        feedback.innerHTML += "Question 8 is incomplete.<br>";
        isValid = false;
    }

    //Question 9
    if (!selectImg) {
        feedback.innerHTML += "Question 9 was not answered. No image selected.<br>";
        isValid = false;
    }

    //Question 10
    let q10Answer = Number(document.querySelector("#q10").value);
    if (q10Answer == null || isNaN(q10Answer) || q10Answer < 1 || q10Answer > 99 || !Number.isInteger(q10Answer)) {
        feedback.innerHTML += "Question 10 must be a whole number between 1 and 99.<br>";
        isValid = false;
    }

    return isValid;
}//isFormValid

function rightAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
    score += 10
}//rightAnswer

function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
    document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt='xmark'>";      
}//wrongAnswer

/*
    Functions for Question 5
*/
function toggleLockQ5() {
    let q5Select = document.querySelector("#q5");
    let note = document.querySelector("#q5Note");
    let lockBtn = document.querySelector("#q5Lock");
    q5Answers = [];
    note.style.color = "red";

    //Get the Answers
    for (let i = 0; i < q5Select.options.length; i++) {
        if (q5Select.options[i].selected) {
            q5Answers.push(q5Select.options[i].value);
        }
    }

    //Check if Q5Button is locked or unlocked
    if (!locked) {
        //Check if user chose only 3 answers, if so then lock, else relay message
        if(q5Answers.length !== 3) {
            note.innerText = "Please select exactly 3 states!";
            note.style.color = "red";
            return;
        }
        note.innerText = "You locked in: " + q5Answers.join(", ");
        q5Select.disabled = true;
        locked = true;
        lockBtn.value = "Unlock Answers";
    } else {
        // Unlock answers
        note.innerText = "You can change your answers now.";
        q5Select.disabled = false;
        locked = false;
        lockBtn.value = "Lock it in";
    }
    console.log(q5Answers);
}//toggleLock()

function q5Checker () {
    let correctAnswers = ["Nebraska", "Missouri", "Wyoming"];
    let count = 0;

    for (let i = 0; i < q5Answers.length; i++) {
        if (correctAnswers.includes(q5Answers[i])) {
            count++;
        }
    }
    return count;
}

function displayQ5Choices() {
    let q5ChoicesArray = ["Alaska", "Washington", "Idaho", "Nebraska",
            "Minnesota", "Missouri", "Michigan", "New York", "Wyoming", "Vermont", "Maine"];
    q5ChoicesArray = _.shuffle(q5ChoicesArray);
    for (let i = 0; i < q5ChoicesArray.length; i++) {
        document.querySelector("#q5").innerHTML += ` <option value="${q5ChoicesArray[i]}">${q5ChoicesArray[i]}</option>`;
    }
}

// Function for Question 6
function displayRange () {
    let rangeInput = document.querySelector("#rangeLakes");
    let rangeDisplay = document.querySelector("#lakeCountDisplay");

    rangeDisplay.value = rangeInput.value;
}

function updateRange(){
    let rangeInput = document.querySelector("#rangeLakes");
    let rangeDisplay = document.querySelector("#lakeCountDisplay");
    let q6Note = document.querySelector("#q6Note");
    let textBoxValue = Number(rangeDisplay.value);

    if (!isNaN(textBoxValue) && textBoxValue >= 0 && textBoxValue <= 20000 && Number.isInteger(textBoxValue)) {
        rangeInput.value = textBoxValue;
        q6Note.innerHTML = "";
    } else {
        q6Note.innerHTML = "Please enter a valid number between 0 and 20000";
        q6Note.style.color = "red";
    }
}


// Fucntion for Question 8
function gradeQ8 () {
    let q8response1 = document.querySelector("#q8first").value;
    let q8response2 = document.querySelector("#q8second").value;
    let q8response3 = document.querySelector("#q8third").value;
    let correctCount = 0;
        if (q8response1 != "California") {
            wrongAnswerQ8(1);
        } else {
            rightAnswerQ8(1);
            correctCount++;
        }
        if (q8response2 != "Pennsylvania") {
            wrongAnswerQ8(2);
        } else {
            rightAnswerQ8(2);
            correctCount++
        }
        if (q8response3 != "Kentucky") {
            wrongAnswerQ8(3);
        } else {
            rightAnswerQ8(3);
            correctCount++
        }
    return correctCount;
}

function wrongAnswerQ8(index) {
    let textSpan = document.querySelector(`#q8check${index}`);
    if (textSpan) {
        textSpan.style.color = "red";
        textSpan.innerHTML = "INCORRECT"
    }
}//rightAnswer for Question 8

function rightAnswerQ8(index) {
    let textSpan = document.querySelector(`#q8check${index}`);
    if (textSpan) {
        textSpan.style.color = "green";
        textSpan.innerHTML = "CORRECT"
    }
}//wrongAnswer for Question 8


//Question 9 functions
function addImageListenerQ9() {
    for (let i = 0; i < carouselImg.length; i++) {
        carouselImg[i].addEventListener("click", clickableImage);
    }
}//addImageListerner

function clickableImage(event) {
    for (let i = 0; i < carouselImg.length; i++) {
        carouselImg[i].style.border = "none";
        carouselImg[i].style.boxShadow = "none";
    }
    let img = event.target;
    img.style.border = "5px solid #e9db5fff";
    img.style.outlineOffset = "-5px";
    img.style.boxShadow = "0 0 10px lime";
    selectImg = img.parentElement.id;
}//clickableImage

//function for Question 10
function q10Enter() {
    let answer = document.querySelector("#q10").value;
    let feedback = document.querySelector("#q10Feedback");
    answer = Number(answer);

    //Checks if its not a number
    if (isNaN(answer)){
        feedback.textContent = "Enter a number between 1 and 100";
        feedback.style.color = "red";
        return null;
    }

    //Checks if number is less that one or greater than 100
    if (answer < 1 || answer > 99){
        feedback.textContent = "Enter a number between 1 and 100";
        feedback.style.color = "red";
        return null;
    }

    //Double checks if the number is a whole number, no floats,decimals
    if (!Number.isInteger(answer)){
        feedback.textContent = "Enter a number a whole number.";
        feedback.style.color = "red";
        return null;
    }
    feedback.style.color = "Orange";
    feedback.innerHTML = `You have chosen ${answer}`;
}

function gradeQuiz() {
    console.log("Grading quiz...");
    document.querySelector("#validationFdbk").innerHTML = "";
    if (!isFormValid()){
        return;
    }

    //local variables
    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();;
    let q2Response = document.querySelector("#q2").value;
    let q4Response = document.querySelector("input[name=q4]:checked").value;
    let q6Response1 = document.querySelector("#rangeLakes").value;
    let q6Response2 = document.querySelector("#lakeCountDisplay").value;
    let q7Response = document.querySelector("input[name=q7]:checked").value;
    let q10Response = document.querySelector("#q10").value;


    console.log(q1Response);
    console.log(q2Response);
    console.log(q4Response);
    console.log(q5Answers);

    //Grading Question 1
    if (q1Response == "sacramento") {
        rightAnswer(1);
        borderCorrect(1);
    } else {
        wrongAnswer(1);
        borderWrong(1);
    }

    //Grading Question 2
    if (q2Response == "mo") {
        rightAnswer(2);
        borderCorrect(2);
    } else {
        wrongAnswer(2);
        borderWrong(2);
    }

    //Grading Question 3
    if (document.querySelector("#Jefferson").checked && document.querySelector("#Roosevelt").checked &&
        !document.querySelector("#Jackson").checked && !document.querySelector("#Franklin").checked) {
            rightAnswer(3);
            borderCorrect(3);
        } else {
            wrongAnswer(3);
            borderWrong(3);
        }

    //Grading Question 4
    if (q4Response == "Rhode Island") {
        rightAnswer(4);
        borderCorrect(4);
    } else {
        wrongAnswer(4);
        borderWrong(4);
    }

    //Grading Question 5
    let correctCount = q5Checker();
    if (correctCount === 3 && q5Answers.length === 3) {
        rightAnswer(5);
        borderCorrect(5);
    } else {
        wrongAnswer(5);
        borderWrong(5);
    }

    //Grading Question 6
    if (q6Response1 && q6Response2 == 11842) {
        rightAnswer(6);
        borderCorrect(6);
    } else {
        wrongAnswer(6);
        borderWrong(6);
    }

    //Grading Question 7
    if (q7Response == "False") {
        rightAnswer(7);
        borderCorrect(7)
    } else {
        wrongAnswer(7);
        borderWrong(7);
    }

    //Grading Question8
    if (gradeQ8() == 3) {
        rightAnswer(8);
        borderCorrect(8);
    } else {
        wrongAnswer(8);
        borderWrong(8);
    }
    
    //Grading Question 9
    if (selectImg === "whitney") {
        rightAnswer(9);
        borderCorrect(9);
    } else {
        wrongAnswer(9);
        borderWrong(9);
    }

    //Grading Question 10
    if (q10Response == 27) {
        rightAnswer(10);
        borderCorrect(10);
    } else {
        wrongAnswer(10);
        borderWrong(10);
    }

    let scoreDisplay = document.querySelector("#totalScore");
    let congratsMsg = document.querySelector("#gratsMsg");
    scoreDisplay.innerHTML = `Total Score: ${score}`;
    if (score >= 80) {
        scoreDisplay.className = "text-success";
        congratsMsg.innerHTML = "Congratulations! You scored an 80 or above.";
    } else {
        scoreDisplay.className = "text-danger";
    }

    document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${++attempts}`;
    document.querySelector("#totalAttempts").style.display = "block";
    localStorage.setItem("total_attempts", attempts);
    console.log(attempts);

    let submitButton = document.querySelector("#submitBtn");
    submitButton.disabled = true;
    submitButton.add("btn-secondary");

}//gradeQuiz

//Reset everything
function redoQuiz() {
    score = 0;
    locked = false;
    q5Answers = [];
    selectImg = null;

    //Question 1, 2
    document.querySelector("#q1").value = "";
    document.querySelector("#q2").value = "";

    //Q3
    let q3inputs = ["Jackson", "Franklin", "Jefferson", "Roosevelt"];
    for (let i = 0; i < q3inputs.length; i++) {
        document.querySelector(`#${q3inputs[i]}`).checked = false;
    }

    //Question 4
    let q4inputs = document.querySelectorAll("input[name='q4']");
    for (let i = 0; i < q4inputs.length; i++) {
        q4inputs[i].checked = false;
    }

    //Question 5
    document.querySelector("#q5").selectedIndex = -1;
    document.querySelector("#q5").disabled = false;
    document.querySelector("#q5Lock").value = "Lock it in";

    //Question 6
    document.querySelector("#lakeCountDisplay").value = "";
    document.querySelector("#rangeLakes").value = 0;

    //Question 7
    let q7inputs = document.querySelectorAll("input[name='q7']");
    for (let i = 0; i < q7inputs.length; i++) {
        q7inputs[i].checked = false;
    }

    //Question 8
    let q8inputs = ["q8first", "q8second", "q8third"];
    for (let i = 0; i < q8inputs.length; i++) {
        document.querySelector(`#${q8inputs[i]}`).value = "";
    }

    //Question 9
    for (let i = 0; i < carouselImg.length; i++) {
        carouselImg[i].style.border = "none";
        carouselImg[i].style.boxShadow = "none";
    }

    //Question 10
    document.querySelector("#q10").value = "";


    //Feedbacks
    for (let i = 1; i <= 10; i++) {
        document.querySelector(`#q${i}Feedback`).innerHTML = "";
        document.querySelector(`#markImg${i}`).innerHTML = "";
    }

    document.querySelector("#q5Note").innerHTML = "";
    document.querySelector("#q6Note").innerHTML = "";
    document.querySelector("#q8check1").innerHTML = "";
    document.querySelector("#q8check2").innerHTML = "";
    document.querySelector("#q8check3").innerHTML = "";
    document.querySelector("#q9Feedback").innerHTML = "";
    document.querySelector("#validationFdbk").innerHTML = "";

    //Score
    let scoreDisplay = document.querySelector("#totalScore");
    scoreDisplay.innerHTML = "";
    scoreDisplay.className = "text-info";

    console.log("Everything has been reset");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("#totalAttempts").style.display = "none";

    let submitButton = document.querySelector("#submitBtn");
    submitButton.disabled = false;

    let congratsMsg = document.querySelector("#gratsMsg");
    congratsMsg.innerHTML = "";

    //reset borders
    for (let i = 1; i <= 10; i++) {
        let box = document.querySelector(`#q${i}Box`);
        if(box) {
            box.classList.remove("border-success", "border-danger");
            box.classList.remove("border-thick");
        }
    }
}

function borderCorrect(questionID) {
    let box = document.querySelector(`#q${questionID}Box`);
    box.classList.remove("border-success", "border-danger");
    box.classList.add("border-thick");
    box.classList.add("border-success");
}

function borderWrong(questionID) {
    let box = document.querySelector(`#q${questionID}Box`);
    box.classList.remove("border-success", "border-danger");
    box.classList.add("border-thick");
    box.classList.add("border-danger");
}
