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
const countries = {
    "en": "images/united-kingdom.png",
    "fr": "images/france.png",
    "es": "images/spain.png",
    "de": "images/germany.png"
};

// Event listeners
resetButton.addEventListener('click', () => {
    clickSound.play(); 
    resetValues(); 
});
readButton.addEventListener('click', () => readTranslation());
randomButton.addEventListener('click', () => {
    clickSound2.play(); 
    randomTranslation();
});

langButtons.forEach(langButton => {
    langButton.addEventListener('click', () => {
        const lang = langButton.dataset.lang;
        const flag = langButton.querySelector('img').getAttribute('src');
        translateText(lang, flag);
    });
});

// Functions
function resetValues() {
    textInput.value = "";
    translationText.innerText = "Traduzione";
    translationFlag.innerHTML = "";
    translationItalian.innerText = "";
}

async function translateText(lang, flag) {
    const text = textInput.value;
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|${lang}`;
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        const result = jsonData.responseData.translatedText;
        displayTranslation(result, lang, flag);
        saveTranslationToHistory(text, result, lang);
    } catch (error) {
        console.error("Errore durante la traduzione:", error);
    }
}

function displayTranslation(result, lang, flag) {
    translationText.innerText = result;
    translationFlag.innerHTML = `<img src="${flag}" width="45">`;
    translationText.dataset.lang = lang;
}

async function randomTranslation() {
    try {
        const text = await fetchRandomWord();
        const italianTranslation = await translateToItalian(text);
        const randomLangFlag = getRandomLangFlag(); // Ottiene un oggetto con lingua e bandiera casuali
        displayRandomTranslation(text, italianTranslation, randomLangFlag.flag);
    } catch (error) {
        console.error("Impossibile ottenere una parola casuale. Riprova più tardi.", error);
    }
}

function displayRandomTranslation(text, italianTranslation, flag) {
    const formattedItalianTranslation = italianTranslation.split(',')[0]; // Prende solo la prima traduzione italiana
    translationFlag.innerHTML = `<img src="${flag}" width="45">`;
    translationText.innerHTML = `Parola random: <strong>${text}</strong>, in italiano: <b>${formattedItalianTranslation}</b>`;
}

async function translateToItalian(text) {
    const sourceLanguages = ["en", "es", "de", "fr"];
    const italianTranslations = [];
    try {
        for (const lang of sourceLanguages) {
            const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${lang}|it`;
            const response = await fetch(url);
            const jsonData = await response.json();
            const italianTranslation = jsonData.responseData.translatedText;
            italianTranslations.push(italianTranslation);
        }
    } catch (error) {
        console.error("Errore durante la traduzione in italiano:", error);
    }
    return italianTranslations.join(', ');
}

async function fetchRandomWord() {
    const url = 'https://random-word-api.herokuapp.com/all';
    const response = await fetch(url);
    const jsonData = await response.json();
    const list = jsonData;
    return list[Math.floor(Math.random() * list.length)];
}
function getRandomLangFlag() {
    const languages = ["en", "fr", "de", "es"];
    const randomIndex = Math.floor(Math.random() * languages.length);
    const randomLang = languages[randomIndex];
    const flag = countries[randomLang];
    return { lang: randomLang, flag: flag };
}

function saveTranslationToHistory(input, output, lang) {
    const historyEntry = { input: input, output: output, paese: lang };
    let translationHistory = localStorage.getItem('translationHistory');
    translationHistory = translationHistory ? JSON.parse(translationHistory) : [];
    translationHistory.push(historyEntry);
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
}

function readTranslation() {
    const text = translationText.innerText;
    const lang = translationText.dataset.lang;
    speak(text, lang);
}

function speak(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}