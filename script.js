const langButtons = document.querySelectorAll('.lang-button');
const textInput= document.querySelector('.text-input');
const translationText = document.querySelector('.translation-text');
const translationFlag = document.querySelector('.translation-flag');
const resetButton= document.querySelector('.reset-button');
const randomButton = document.querySelector('.random-button');


async function translate (text, lang, flag){
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|${lang}` ;
    const response = await fetch(url);
    const jsonData = await response.json();
    const result =jsonData.responseData.translatedText;
    console.log(result);
    translationText.innerHTML = result;
    translationFlag.innerHTML = flag;
}

langButtons.forEach(function(langButton){
    langButton.addEventListener('click', function(){
        const text = textInput.value;
        const lang = langButton.dataset.lang;
        const flag = langButton.innerHTML;
        translate(text, lang, flag);
    });
});

async function randomCountry() {
    const url = 'https://random-word-api.herokuapp.com/all';
    const response = await fetch(url);
    const jsonData = await response.json();
    const list = jsonData;
    console.log(list);
    text = list[(Math.floor(Math.random() * list.length))];
    console.log(text);
    return text;
}

randomButton.addEventListener('click', random);

async function random() {
    let text = await randomCountry();
    const randomLangFlag = getRandomLangFlag();
    lang = randomLangFlag.lang;
    flag = randomLangFlag.flag;
    textInput.placeholder = `${text}`;
    translate(text, lang, flag);
    document.body.style.backgroundImage = `url('./images/${lang}.svg')`;
}

function getRandomLangFlag() {
    const languages = Object.keys(countries);
    const randomIndex = Math.floor(Math.random() * languages.length);
    const randomLang = languages[randomIndex];
    const randomFlag = countries[randomLang];
    return { lang: randomLang, flag: randomFlag };
  }

resetButton.addEventListener('click', function(){
textInput.value="";
translationText.innerText="Traduzione";
translationFlag.innerHTML="";
});

