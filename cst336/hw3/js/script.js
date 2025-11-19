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
document.querySelector("#nameBtn").addEventListener("click", validateCharacter);
document.querySelector("#cardBtn").addEventListener("click", validateCard);

//function calls
//displays the movies for quote search
populateMovies();

//functions
//fetch movies for quote dropdown
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

    } catch(networkErr) {
        console.error("Error getting movies:", networkErr);
    }
}

//validate the form based on selected option
async function validateCharacter() {
    let nameInput = document.querySelector("#searchName");
    let searchFeedback = document.querySelector("#formError");
    let charDisplay = document.querySelector("#characterInfo");
    let nameValue = nameInput.value.trim();
    searchFeedback.textContent = "";
    nameInput.style.border = "";
    charDisplay.innerHTML = "";
    if (nameValue === "") {
        charDisplay.style.display = "none";
        searchFeedback.textContent = "Please enter a character name.";
        nameInput.style.border = "2px solid red";
        return;
    }

    let characterInfo = await fetchCharactersByName(nameValue);
    console.log(characterInfo);
    if (!characterInfo) {
        charDisplay.style.display = "none";
        searchFeedback.textContent = "Character not found. Please check the name and try again.";
        nameInput.style.border = "2px solid red";
        return;
    }
    charDisplay.style.display = "block";
    charDisplay.innerHTML = `
        <strong>Name:</strong> ${characterInfo.name} <br>
        <strong>Race:</strong> ${characterInfo.race || "Unknown"} <br>
        <strong>Gender:</strong> ${characterInfo.gender || "Unknown"} <br>
        <strong>Birth:</strong> ${characterInfo.birth || "Unknown"} <br>
        <strong>Death:</strong> ${characterInfo.death || "Unknown"} <br>
        <strong>Realm:</strong> ${characterInfo.realm || "Unknown"} <br>
        <strong>Height:</strong> ${characterInfo.height || "Unknown"} <br>
        <strong>Hair:</strong> ${characterInfo.hair || "Unknown"} <br>
        <strong>Spouse:</strong> ${characterInfo.spouse || "Unknown"} <br>
        <strong>Wiki URL:</strong> <a href="${characterInfo.wikiUrl}" target="_blank">${characterInfo.wikiUrl}</a>
    `;
}

async function validateCard() {
    let cardInput = document.querySelector("#searchCard");
    let searchFeedback = document.querySelector("#formError");
    let cardDisplay = document.querySelector("#cardInfo");
    let cardValue = cardInput.value.trim();
    searchFeedback.textContent = "";
    cardInput.style.border = "";
    cardDisplay.innerHTML = "";
    if (cardValue === "") {
        cardDisplay.style.display = "none";
        searchFeedback.textContent = "Please enter a card name.";
        cardInput.style.border = "2px solid red";
        return;
    }

    //Get the card info object
    let card = await fetchCardsByName(cardValue);
    console.log(card);
    if (!card) {
        searchFeedback.textContent = "Card not found. Try another name.";
        cardInput.style.border = "2px solid red";
        cardDisplay.style.display = "none";
        return;
    }

    let imgURL = "";
    if (card.imagesrc) {
        imgURL = "https://ringsdb.com" + card.imagesrc;
    }

    cardDisplay.style.display = "block";
    cardDisplay.innerHTML = `
        ${imgURL ? `<img src="${imgURL}" alt="${card.name}" width="200"><br><br>` : ""}
        <strong>${card.name}</strong><br>
        <strong>Type:</strong> ${card.type_name || "Unknown"}<br>
        <strong>Sphere:</strong> ${card.sphere_name || "Unknown"}<br><br>
        ${card.text || ""}
    `;
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
    nameInput.style.border = "";
    cardInput.style.border = "";
    quoteInput.style.border = "";

    searchFeedback.textContent = "";
    searchFeedback.style.color = "red";
    if (optionResult === "Character") {
        nameDisplay.style.display = "block";
        nameInput.placeholder = "e.g., Frodo Baggins, Boromir";
    } else if (optionResult === "Cards") {
        cardDisplay.style.display = "block";
        cardInput.placeholder = "e.g., Aragorn, Gandalf";
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

    } catch(networkErr) {
        console.error("Error fetching quotes:", networkErr);
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

    }catch(networkErr) {
        console.error("Error fetching character:", networkErr);
    }
}

async function fetchCardsByName(cardName) {
    try {
        let url = `https://ringsdb.com/api/public/cards/search/${encodeURIComponent(cardName.toLowerCase())}`;
        let response = await fetch(url);
        let data = await response.json();

        if (!data || data.length === 0) {
            return null;
        }
        return data[0];

    }catch(networkErr) {
        console.error("Error fetching card:", networkErr);
    }
}