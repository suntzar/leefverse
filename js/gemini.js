import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyAeGh0hB_nerwQfsx2UWN0pyZ0r8r3Gd7o";
const genAI = new GoogleGenerativeAI(API_KEY);

async function Gemini(q) {
  let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let result = await model.generateContent(q);
  let response = await result.response;
  return response.text();
}

async function VerseDay() {
  let verses = await carregarDados("json/verses.json");
  let irandom = Math.floor(Math.random() * verses.length);
  //console.log(verses[irandom].text);
  return verses[irandom].text;
}

async function setVerseDay() {
  let text = document.getElementById("imgText");
  text.innerHTML = await VerseDay();
  let verses = "";
  for (let i = 0; i < 5; i++) {
    verses += "\n\n" + (await VerseDay());
  }
  console.log(verses);
  navigator.clipboard.writeText(verses);
  let command = "escolha um versiculo motivacional, impactante ou importante para servir de verciculo do dia, retotne somente o verciculo(completo, sem o indice do verciculo no inicio do verciculo o nome do livro e indice devem ser encontrados no final da frase separados por -) escolhido(nada alem do verciculo): ";
  let chose = await Gemini(command + verses);
  text.innerHTML = chose;
  console.log(chose);
}



window.addEventListener("load", setVerseDay);
