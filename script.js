const langButtons = document.querySelectorAll('.lang-button');
const textInput = document.querySelector('.text-input');
const translationText = document.querySelector('.translation-text');
const translationFlag = document.querySelector('.translation-flag');
const translationItalian = document.querySelector('.translation-italian');
const resetButton = document.querySelector('.reset-button');
const readButton = document.querySelector('.read-button');
const randomButton = document.querySelector('.random');
const clickSound = document.getElementById('clickSound');
const clickSound2 = document.getElementById('clickSound2');

// Aggiungi event listener per il pulsante Reset
resetButton.addEventListener('click', function() {
    clickSound.play(); 
    resetValues(); 
});
randomButton.addEventListener('click', function() {
    clickSound2.play(); 
});
// Aggiungi event listener per il pulsante Read
readButton.addEventListener('click', function() {
    const text = translationText.innerText;
    const lang = translationText.dataset.lang;
    speak(text, lang);
});

// Aggiungi event listener per il pulsante Random
randomButton.addEventListener('click', random);

// Funzione per reimpostare i valori predefiniti
function resetValues() {
    textInput.value = "";
    translationText.innerText = "Traduzione";
    translationFlag.innerHTML = "";
    translationItalian.innerText = ""; // Resetta anche la traduzione in italiano
}

// Funzione per tradurre il testo
async function translate(text, lang, flag) {
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|${lang}`;
    const response = await fetch(url);
    const jsonData = await response.json();
    const result = jsonData.responseData.translatedText;

    translationText.innerText = result;
    translationFlag.innerHTML = `<img src="${flag}" width="45">`;
    translationText.dataset.lang = lang;

    saveTranslationToHistory(text, result, lang);
}

// Itera sui pulsanti di lingua e aggiungi event listener
langButtons.forEach(function(langButton) {
    langButton.addEventListener('click', function() {
        const text = textInput.value;
        const lang = langButton.dataset.lang;
        const flag = langButton.querySelector('img').getAttribute('src');
        translate(text, lang, flag);
    });
});

// Funzione per eseguire una traduzione casuale
async function random() {
    let text = await randomCountry();
    const randomLangFlag = getRandomLangFlag();
    const lang = randomLangFlag.lang;
    const flag = randomLangFlag.flag;
    textInput.value = text; // Visualizza la parola random nell'inputText
    translate(text, lang, flag);

    // Traduci la parola random in italiano e visualizzala nel pannello
    const italianTranslation = await translateToItalian(text, lang);
    translationItalian.innerText = `Traduzione: ${italianTranslation}`;
}

// Funzione per ottenere un paese casuale
async function randomCountry() {
    const url = 'https://random-word-api.herokuapp.com/all';
    const response = await fetch(url);
    const jsonData = await response.json();
    const list = jsonData;
    text = list[(Math.floor(Math.random() * list.length))];
    return text;
}


const countries = {
    "en": "images/united-kingdom.png",
    "fr": "images/france.png",
    "es": "images/spain.png",
    "de": "images/germany.png"
};

// Funzione per ottenere una lingua e una bandiera casuali
function getRandomLangFlag() {
    const languages = ["en", "fr", "de", "es"];
    const randomIndex = Math.floor(Math.random() * languages.length);
    const randomLang = languages[randomIndex];
    const flag = countries[randomLang];
    return { lang: randomLang, flag: flag };
}

// Funzione per salvare la traduzione nella cronologia
function saveTranslationToHistory(input, output, lang) {
    const historyEntry = { input: input, output: output, paese: lang };
    let translationHistory = localStorage.getItem('translationHistory');
    if (!translationHistory) {
        translationHistory = [];
    } else {
        translationHistory = JSON.parse(translationHistory);
    }
    translationHistory.push(historyEntry);
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
}

// Funzione per leggere il testo ad alta voce con la lingua specifica
function speak(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}