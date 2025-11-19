//event listeners
//event listeners for each radio option
const chooseOptions = document.querySelectorAll('input[name="chooseOption"]');
for (let i = 0; i < chooseOptions.length; i++) {
    chooseOptions[i].addEventListener("change", chooseOptionsChange);
}

document.querySelector("#searchForm").addEventListener("submit", function(event) {
    validateForm(event);
});

document.querySelector("#quoteBtn").addEventListener("click", displayQuote);

//function calls
//displays race and realms in dropdown option
populateMovies();

//functions
async function populateMovies() {
    try{
    let selectOption = document.querySelector("#searchQuote");
    let movieTitle = selectOption.value;

    let url = `https://the-one-api.dev/v2/movie`; 
    let response = await fetch(url, 
        { headers: 
            { Authorization: `Bearer Y3RIDmuG9YtV5BXICaiK` }
        }); 
    let data = await response.json();
    selectOption.innerHTML = `<option value="">Select a movie...</option>`;
    for (let i of data.docs) {
        selectOption.innerHTML += `<option value= "${i._id}"> ${i.name} </option>`
    }


    } catch (networkErr) {
        console.error("Error getting movies:", networkErr);
    }
}

function validateForm(e) {
    let isValid = true;
    let searchFeedback = document.querySelector("#formError");
    //reset everything
    searchFeedback.textContent = "";
    searchFeedback.style.color = "red";

    document.querySelector("#searchName").style.border = "";
    document.querySelector("#searchCard").style.border = "";
    document.querySelector("#searchQuote").style.border = "";
    // Get the selected search type radio based on checked
    let selectedRadio = document.querySelector("input[name='chooseOption']:checked");

    if (!selectedRadio) {
        //check if anything selected
        return true;
    }

    let searchType = selectedRadio.value;

    if (searchType === "Character") {
        let searchInput = document.querySelector("#searchName");
        let value = searchInput.value.trim();
        if (value === "") {
            searchFeedback.textContent = "Please enter a name";
            searchInput.style.border = "2px solid red";
            isValid = false;
        } else {
            searchInput.style.border = "2px solid green";
        }
    } else if (searchType === "Cards") {
        let cardSelect = document.querySelector("#searchCard");
        let cardValue = cardSelect.value.trim();
        if (cardValue === "") {
            cardSelect.style.border = "2px solid red";
            searchFeedback.textContent = "Please enter a card name";
            isValid = false;
        }
    } else if (searchType === "randomQuote") {
        let quoteSelect = document.querySelector("#searchQuote");
        let quoteValue = quoteSelect.value.trim();
        if (quoteValue === "") {
            quoteSelect.style.border = "2px solid red";
            searchFeedback.textContent = "Please enter a movie";
            isValid = false;
        }
    }
    if (!isValid) {
    e.preventDefault();
    } 
}

//Change the search options based on chosen option
function chooseOptionsChange() {
    let searchFeedback = document.querySelector("#formError");
    let optionResult = document.querySelector("input[name=chooseOption]:checked").value;
    let nameInput = document.querySelector("#searchName");
    let cardInput = document.querySelector("#searchCard");
    let quoteInput = document.querySelector("#searchQuote");

    let nameDisplay = document.querySelector("#nameSearch");
    let cardDisplay = document.querySelector("#cardSearch");
    let quoteDisplay = document.querySelector("#quoteSearch");
    nameDisplay.style.display = "none";
    cardDisplay.style.display = "none";
    quoteDisplay.style.display = "none";
    let innerquoteDisplay = document.querySelector("#quoteInnerDisplay");
    innerquoteDisplay.textContent = "";
    nameInput.style.border = "";
    cardInput.style.border = "";
    quoteInput.style.border = "";

    searchFeedback.textContent = "";
    searchFeedback.style.color = "red";
    if (optionResult === "Character") {
        nameDisplay.style.display = "block";
        nameInput.placeholder = "e.g., Frodo Baggins";
    } else if (optionResult === "Cards") {
        cardDisplay.style.display = "block";
        cardInput.placeholder = "Enter a card name";
    } else {
        quoteDisplay.style.display = "block";
        quoteInput.placeholder = "Enter a movie by title";
    }

}

async function displayQuote() {
    let quoteInput = document.getElementById("searchQuote");
    let searchFeedback = document.getElementById("formError");
    let quoteDisplay = document.querySelector("#quoteInnerDisplay");
    searchFeedback.textContent = "";
    quoteInput.style.border = "";
    let quoteValue = quoteInput.value.trim();

    if (quoteValue === "") {
        searchFeedback.textContent = "Please enter a movie";
        quoteInput.style.border = "2px solid red";
        quoteDisplay.textContent = "";
        return;
    }
  
    let quoteObj = await fetchQuotesByMovie(quoteValue);

    if (!quoteObj) {
        quoteDisplay.textContent = "No quotes found for this movie.";
        return;
    }

    // Display the quote
    quoteDisplay.textContent = `"${quoteObj.dialog}" `;
}

async function fetchQuotesByMovie(quoteValue) {
    let selectOption = document.querySelector("#searchQuote");
    let searchFeedback = document.getElementById("formError");
    console.log.clear;
    console.log("Fetching quotes for movie ID:", quoteValue);
    if (!quoteValue) {
        searchFeedback.textContent = "Please enter a movie";
        return;
    }

    try {
        let url = `https://the-one-api.dev/v2/movie/${quoteValue}/quote`; 
        let response = await fetch(url, 
            { headers: 
                { Authorization: `Bearer Y3RIDmuG9YtV5BXICaiK` }
            }); 
        let data = await response.json();
        let quotes = data.docs;

        if (quotes.length === 0) {
        return;
        }

        let random = Math.floor(Math.random() * quotes.length);
        return quotes[random];
    } catch (err) {
        console.error("Error fetching quotes:", err);
    }
}

async function fetchCharactersByName(name) {
    try {
        let url = `https://the-one-api.dev/v2/character?name=${encodeURIComponent(name)}`;
        let response = await fetch(url, 
            { headers: 
                { Authorization: `Bearer Y3RIDmuG9YtV5BXICaiK` }
            }); 
        let data = await response.json();
        if (!data.docs || data.docs.length === 0){
            return null;
        }
        return data.docs[0];
    }catch(networkErr){
        console.error("Error fetching character:", err);
    }
}

async function displayCharacterCard() {
    let searchInput = document.querySelector("#searchName");
    let charDisplay = document.querySelector("#characterInfo");
    let searchFeedback = document.querySelector("#formError");

    let name = searchInput.value.trim();
    if (!name) {
        searchFeedback.innerHTML = "Please enter a character name.";
        searchInput.style.border = "2px solid red";
        return;
    }
    //clean the feedback and border
    searchFeedback.textContent = "";
    input.style.border = "";

    let characterInfo = await fetchCharactersByName(name);

    charDisplay.innerHTML = `
        <strong>Name:</strong> ${characterInfo.name} <br>
        <strong>Race:</strong> ${characterInfo.race || "Unknown"} <br>
        <strong>Gender:</strong> ${characterInfo.gender || "Unknown"} <br>
        <strong>Birth:</strong> ${characterInfo.birth || "Unknown"} <br>
        <strong>Death:</strong> ${characterInfo.death || "Unknown"} <br>
        <strong>Realm:</strong> ${characterInfo.realm || "Unknown"} <br>
    `;
}