//event listeners 
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#pwd").addEventListener("click", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});

//global variables
let userNameWasTaken = false;


//functions
displayAllStates();

//Displaying city from web api after entering a zip code
async function displayCity() {

    let zipCode = document.querySelector("#zip").value;
    let zipValidation = document.querySelector("#zipcodeValid");
    zipValidation.innerHTML = "";

    try {
        let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);

        if (data == null || !data || data == false) {
            zipValidation.innerHTML = "Zip code not found";
            zipValidation.style.color = "red";
            document.querySelector("#city").innerHTML = "";
            document.querySelector("#latitude").innerHTML = "";
            document.querySelector("#longitude").innerHTML = "";
        } else {
            document.querySelector("#city").innerHTML = data.city;
            document.querySelector("#latitude").innerHTML = data.latitude;
            document.querySelector("#longitude").innerHTML = data.longitude;
        }

    } catch (networkErr) {
        console.error("Error:", networkErr);
        zipValidation.innerHTML = "Please enter a valid Zip Code of 5 digits";
        zipValidation.style.color = "red";
        document.querySelector("#city").innerHTML = "";
        document.querySelector("#latitude").innerHTML = "";
        document.querySelector("#longitude").innerHTML = "";
    }
}

async function displayCounties () {
    try{
        let state = document.querySelector("#state").value;
        let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
        let response = await fetch(url);
        let data = await response.json();
        let countyList = document.querySelector("#county");
        countyList.innerHTML = "<option> Select County </option>";
        for (let i of data) {
            countyList.innerHTML += `<option> ${i.county} </option>`;
        }
    } catch (networkErr) {
        console.error("Error:", networkErr);
        let countyList = document.querySelector("#county");
        countyList.innerHTML = "<option></option>";
    }
}

async function checkUsername () {
    try{
        let username = document.querySelector("#username").value;
        let usernameError = document.querySelector("#usernameError");
        let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        userNameWasTaken = false;
        if (data.available) {
            usernameError.innerHTML = `Username is available!`;
            usernameError.style.color = "green";
            userNameWasTaken = true;
        } else {
            usernameError.innerHTML = "Username is taken. Please try again."
            usernameError.style.color = "red";
        }
    } catch (networkErr) {
        console.error("Error with usernames:", networkErr);
        let usernameError = document.querySelector("#usernameError");
        usernameError.innerHTML = "Error checking username.";
        usernameError.style.color = "red";
    }

}

async function displayAllStates () {
    try {
        let url = `https://csumb.space/api/allStatesAPI.php`;
        let response = await fetch(url);
        let data = await response.json();
        let stateList = document.querySelector("#state");
        for (let i of data) {
            stateList.innerHTML += `<option value= "${i.usps.toLowerCase()}"> ${i.state} </option>`
        }
    } catch (networkErr) {
        console.error("Error with states:", networkErr);
        let stateList = document.querySelector("#state");
        stateList.innerHTML = "<option> Select State </option>";
    }

}

async function suggestPassword () {
    try {
        let url = `https://csumb.space/api/suggestedPassword.php?length=8`;
        let response = await fetch(url);
        let data = await response.json();
        let pwdSuggest = document.querySelector("#suggestedPwd");
        pwdSuggest.style.color = "orange";
        pwdSuggest.innerHTML = `Suggested password: <span id="pwd-fontchange" style="color:black; font-weight: bold;">${data.password}</span>`;
    } catch (networkErr) {
        console.error("Failed to fetch password:", networkErr);
    }
}

function validateForm(e) {
    let isValid = true;
    let username = document.querySelector("#username").value;
    let usernameErr = document.querySelector("#usernameError");
    usernameErr.innerHTML = "";
    //Check if username is even types
    if (username.length == 0) {
        usernameErr.innerHTML = "Username Required!";
        usernameErr.style.color = "red";
        isValid = false;
    }

    //Check if username is empty or is taken
    if (username === ""){
        usernameErr.innerHTML = "Please enter a username.";
        usernameErr.style.color = "red";
        isValid = false;         
    } else if (!userNameWasTaken){
        usernameErr.innerHTML = "Username is taken. Please try again.";
        usernameErr.style.color = "red";
        isValid = false;        
    } else {
        usernameErr.innerHTML = "Username is available!";
        usernameErr.style.color = "green";
    }

    // Check if 6 characters
    let pwd = document.querySelector("#pwd").value;
    let pwdErr = document.querySelector("#passwordError");
    pwdErr.innerHTML = ""
    if (pwd.length < 6) {
        pwdErr.style.color = "red";
        pwdErr.innerHTML = "Password must have at least 6 characters."
        isValid = false;
    }

    // Check if pwd value and identical to password again
    let pwdCheck = document.querySelector("#pwdAgain").value;
    if (pwd !== pwdCheck) {
        pwdErr.style.color = "red";
        pwdErr.innerHTML = "Passwords do not match. Retype Password."
        isValid = false;
    }


    if (!isValid) {
        e.preventDefault();
    }

}