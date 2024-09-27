const livros = {
  10: ["GÊNESIS", 50],
  20: ["ÊXODO", 40],
  30: ["LEVÍTICO", 27],
  40: ["NÚMEROS", 36],
  50: ["DEUTERONÔMIO", 34],
  60: ["JOSUÉ", 24],
  70: ["JUÍZES", 21],
  80: ["RUTE", 4],
  90: ["1SAMUEL", 31],
  100: ["2SAMUEL", 24],
  110: ["1REIS", 22],
  120: ["2REIS", 25],
  130: ["1CRÔNICAS", 29],
  140: ["2CRÔNICAS", 36],
  150: ["ESDRAS", 10],
  160: ["NEEMIAS", 13],
  190: ["ESTER", 10],
  220: ["JÓ", 42],
  230: ["SALMOS", 150],
  240: ["PROVÉRBIOS", 31],
  250: ["ECLESIASTES", 12],
  260: ["CÂNTICO DOS CÂNTICOS", 8],
  290: ["ISAÍAS", 66],
  300: ["JEREMIAS", 52],
  310: ["LAMENTAÇÕES", 5],
  330: ["EZEQUIEL", 48],
  340: ["DANIEL", 12],
  350: ["OSÉIAS", 14],
  360: ["JOEL", 3],
  370: ["AMÓS", 9],
  380: ["OBADIAS", 1],
  390: ["JONAS", 4],
  400: ["MIQUEIAS", 7],
  410: ["NAUM", 3],
  420: ["HABACUQUE", 3],
  430: ["SOFONIAS", 3],
  440: ["AGEU", 2],
  450: ["ZACARIAS", 14],
  460: ["MALAQUIAS", 4],
  470: ["MATEUS", 28],
  480: ["MARCOS", 16],
  490: ["LUCAS", 24],
  500: ["JOÃO", 21],
  510: ["ATOS", 28],
  520: ["ROMANOS", 16],
  530: ["1CORÍNTIOS", 16],
  540: ["2CORÍNTIOS", 13],
  550: ["GÁLATAS", 6],
  560: ["EFÉSIOS", 6],
  570: ["FILIPENSES", 4],
  580: ["COLOSSENSES", 4],
  590: ["1TESSALONICENSES", 5],
  600: ["2TESSALONICENSES", 3],
  610: ["1TIMÓTEO", 6],
  620: ["2TIMÓTEO", 4],
  630: ["TITO", 3],
  640: ["FILEMOM", 1],
  650: ["HEBREUS", 13],
  660: ["TIAGO", 5],
  670: ["1PEDRO", 5],
  680: ["2PEDRO", 3],
  690: ["1JOÃO", 5],
  700: ["2JOÃO", 1],
  710: ["3JOÃO", 1],
  720: ["JUDAS", 1],
  730: ["APOCALIPSE", 22]
};

const timer = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function encontrarLivro() {
  let capitulo = Math.floor(Math.random() * 1189 + 1);
  let acumulado = 0;
  let input = document.getElementById("search").value;
  let [book, numero] = input.split(" ");

  if (input === "") {
    for (let idLivro in livros) {
      acumulado += livros[idLivro][1];
      if (capitulo <= acumulado) {
        carregarVersiculos(idLivro, capitulo - (acumulado - livros[idLivro][1]));
        break;
      }
    }
  } else {
    for (let livro in livros) {
      if (removerAcentos(livros[livro][0]).toLowerCase() === removerAcentos(book).toLowerCase()) {
        carregarVersiculos(livro, parseInt(numero));
        break;
      }
    }
  }
}

function extrairNumero(str, i, clss) {
  const regex = /\[(\d+)\]/;
  const correspondencia = str.match(regex);
  const numero = correspondencia ? correspondencia[1] : null;
  const novaString = str.replace(regex, `</b></p><br>\n\n<p  class="v ${clss}" id="verse_${i}" onclick="marcar(${i})"><span style="color: var(--color-p);"><b>${numero}</b></span>`);

  return { numero, novaString };
}

function getBookId(bookName) {
  for (const id in livros) {
    if (livros[id][0] === bookName.toUpperCase()) {
      return id;
    }
  }
  return null; // Retorna null se o livro não for encontrado
}

async function nameBooks(numbk) {
  const resposta = await fetch("json/books.json");
  const books = await resposta.json();
  for (let i = 0; i < books.length; i++) {
    console.log(books[i].book_number);
    if (books[i].book_number === numbk) {
      return books[i].name;
    }
  }
}

// Função para carregar os versículos// Função para carregar os versículos
async function carregarVersiculos(livro, capitulo) {
  let textos = "\n";

  //let { livro, numero: capitulo } = await encontrarLivro();

  let resposta = await fetch("json/verses.json");
  let versiculos = await resposta.json();

  let resposte = await fetch("json/titles.json");
  let titles = await resposte.json();

  let marcarp = JSON.parse(localStorage.getItem("6578431209"));

  for (let i = 0; i < versiculos.length; i++) {
    if (titles[i].chapter === capitulo && titles[i].book_number === livro * 1) {
      document.getElementById("subt").innerHTML = titles[i].title;
      break;
    }
  }

  for (let i = 0; i < versiculos.length; i++) {
    let marcar = marcarp[i] || "";
    if (versiculos[i].chapter === capitulo && versiculos[i].book_number === livro * 1 && versiculos[i].text !== "") {
      var verse = extrairNumero(versiculos[i].text, i, marcar);
      if (!isNaN(verse.numero) && !isNaN(parseFloat(verse.numero)) && verse.numero !== "") {
        textos += `<p style="padding:1.8%;text-align: center;" class="v"><b>${verse.novaString}</p>\n\n`;
      } else {
        if (/\[.*?\]/.test(versiculos[i].text)) {
          if (textos === "") {
            textos = "<br>";
          }
          textos += `<p  class="v ${marcar}" id="verse_${i}" onclick="marcar(${i})">${versiculos[i].text.replace(/\[(.*?)\]/g, '<span style="color: var(--color-p);"><b>$1</b></span>')}</p>\n\n`;
        } else {
          if (textos === "") {
            textos = "<br>";
          }
          textos += `<p  class="v ${marcar}" id="verse_${i}" onclick="marcar(${i})"><span style="color: var(--color-p);"><b>${versiculos[i].verse}</b></span> ${versiculos[i].text}</p>\n\n`;
          //document.getElementById("verses").innerHTML = textos;
        }
      }
    }
  }

  document.getElementById("title").innerHTML = "<h2 class='title'>" + livros[livro][0] + " " + capitulo + "</h2>";
  //document.getElementById('search').placeholder = livros[livro] + " " + capitulo;
  document.getElementById("verses").innerHTML = textos;
}

/*
const Mverse = document.querySelector('p');
Mverse.addEventListener("click", function() {
  this.classList.toggle(type);
});
*/

function pallet_d() {
  let link = document.documentElement.style;
  link.setProperty("--color-f", "#e4e1e2a5");
  link.setProperty("--color-p", "#9bbf93");
  link.setProperty("--color-s", "#9bbf939b");
  link.setProperty("--color-sf", "#768c77");
  link.setProperty("--color-z", "#3b3b44");
  link.setProperty("--color-zf", "#3f3d4a9d");
  link.setProperty("--color-y", "#4f4d5b");
  link.setProperty("--color-yf", "#4d4e5bb7");
  link.setProperty("--color-d", "#313038");
  link.setProperty("--color-b", "#1c1b21");
}

function pallet_g() {
  let link = document.documentElement.style;
  link.setProperty("--color-f", "#e4e1e2a5");
  link.setProperty("--color-p", "#b9a990");
  link.setProperty("--color-s", "#9c8b70");
  link.setProperty("--color-sf", "#768c77");
  link.setProperty("--color-z", "#27272a"); // #252528
  link.setProperty("--color-zf", "#3f3d4a9d");
  link.setProperty("--color-y", "#2c2c2e");
  link.setProperty("--color-yf", "#363639c3");
  link.setProperty("--color-d", "#313038");
  link.setProperty("--color-b", "#1c1b21");
}

function palllet() {
  let link = document.documentElement.style;
  link.setProperty("--color-f", "#898992");
  link.setProperty("--color-p", "#accaa6");
  link.setProperty("--color-s", "#9bbf939b");
  link.setProperty("--color-sf", "#768c77");
  link.setProperty("--color-z", "#ededef");
  link.setProperty("--color-zf", "#3f3d4a9d");
  link.setProperty("--color-y", "#4f4d5b");
  link.setProperty("--color-yf", "#ededef59");
  link.setProperty("--color-d", "#313038");
  link.setProperty("--color-b", "#1c1b21");
}

function marcar(i) {
  const idSt = 6578431209;
  const marcar = JSON.parse(localStorage.getItem(idSt)) || [];
  const verse = document.getElementById(`verse_${i}`);

  const prev = marcar[i - 1]?.match("marcar");
  const next = marcar[i + 1]?.match("marcar");
  const prev2 = marcar[i - 2]?.match("marcar");
  const next2 = marcar[i + 2]?.match("marcar");

  let type = "marcar";
  if (prev && next) {
    type = "marcar-m";
  } else if (prev) {
    type = "marcar-b";
  } else if (next) {
    type = "marcar-c";
  }

  if (type === "marcar-m") {
    marcar[i - 1] = prev2 ? "marcar-m" : "marcar-c";
    marcar[i + 1] = next2 ? "marcar-m" : "marcar-b";
  }

  if (type === "") {
    marcar[i - 1] = prev2 ? "" : "marcar";
    marcar[i + 1] = next2 ? "marcar-m" : "marcar-b";
  }

  if (type === "marcar-c") {
    marcar[i + 1] = next2 ? "marcar-m" : "marcar-b";
  }

  if (type === "marcar-b") {
    marcar[i - 1] = prev2 ? "marcar-m" : "marcar-c";
  }

  if (type === "marcarf-b") {
    marcar[i + 1] = next2 ? "marcar-m" : "marcar-b";
  }

  marcar[i] = marcar[i]?.match("marcar") ? "" : type;

  if (prev && !marcar[i]?.match("marcar")) {
    marcar[i - 1] = prev2 ? "marcar-b" : "marcar";
  }

  if (next && !marcar[i]?.match("marcar")) {
    marcar[i + 1] = next2 ? "marcar-c" : "marcar";
  }

  for (let k = -2; k <= 2; k++) {
    const verse = document.getElementById(`verse_${i + k}`);
    if (verse) {
      verse.className = "v " + (marcar[i + k] || "");
    }
  }

  localStorage.setItem(idSt, JSON.stringify(marcar));
}

//localStorage.removeItem(6578431209);

function cache() {
  let idSt = 6578431209;

  let marcar = JSON.parse(localStorage.getItem(idSt)) || [];

  for (let h = 0; h < 31003; h++) {
    if (!marcar[h]) {
      marcar[h] = "";
    }
  }

  localStorage.setItem(idSt, JSON.stringify(marcar));
}

function page_home() {
  document.getElementById("read").style.left = "100vw";
  document.getElementById("home").style.left = 0;
  document.getElementById("navbar").style.bottom = "-8vh";
  document.getElementById("home").style.opacity = 1;
  document.getElementById("read").style.opacity = 0;
  document.getElementById("navbar").style.opacity = 0;
}

function page_read() {
  document.getElementById("read").style.left = "0";
  document.getElementById("home").style.left = "-100vw";
  document.getElementById("navbar").style.bottom = 0;
  document.getElementById("home").style.opacity = 0;
  document.getElementById("read").style.opacity = 1;
  document.getElementById("navbar").style.opacity = 1;
}

typed = new Typed(".tbar", {
  strings: [`LEEF`, `LEEF VERSE`, `<span style="color: var(--color-p)">LEEF</span> VERSE`],
  typeSpeed: 50
});

let currentPage = 1;
let diffMax = 15;

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;

function handleTouchStart(evt) {
  let firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
}

function handleTouchMove(evt) {
  if (!xDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let xDiff = xDown - xUp;

  if (xDiff > diffMax) {
    // Swiped left
    page_read();
  } else if (xDiff < -diffMax) {
    // Swiped right
    page_home();
  }

  xDown = null;
}

function loadSelect() {
  let book = document.getElementById("bible-sel");
  let cap = document.getElementById("bible-cap");
  // Itera sobre o objeto e cria uma opção para cada livro
  for (const key in livros) {
    if (livros.hasOwnProperty(key)) {
      let option = document.createElement("option");
      option.textContent = livros[key][0]; // Adiciona apenas o nome do livro
      console.log(key);
      book.appendChild(option);
    }
  }
  for (let i = 1; i <= livros[10][1]; i++) {
    let option = document.createElement("option");
    option.textContent = i;
    cap.appendChild(option);
  }
}

function loadCap() {
  let book = getBookId(document.getElementById("bible-sel").value);
  let cap = document.getElementById("bible-cap");
  cap.innerHTML = "";

  for (let i = 1; i <= livros[book][1]; i++) {
    console.log(i);
    let option = document.createElement("option");
    option.textContent = i;
    cap.appendChild(option);
  }
}

function searchCap() {
  let book = +getBookId(document.getElementById("bible-sel").value);
  let cap = +document.getElementById("bible-cap").value;
  carregarVersiculos(book, cap);
}

// Adicionando os event listeners para carregar as funções quando a janela for carregada
window.addEventListener("load", cache);
window.addEventListener("load", encontrarLivro);
window.addEventListener("load", pallet_g);
window.addEventListener("load", loadSelect);
window.addEventListener("load", page_read);
document.getElementById("bible-sel").addEventListener("change", loadCap);

//////////

/* ANOTAÇÕES: 
const textos = versiculos
    .filter(versiculo => versiculo.chapter === 3 && versiculo.book_number === 230)
    .map(versiculo => `<p style='padding:1.8%;'><b>${versiculo.verse}</b> ${versiculo.text}</p>`)
    .join('');
    
    
function listarElementosDoArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

// Exemplo de uso:
const meuArray = [10, 20, 30, 40];
listarElementosDoArray(meuArray);



function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function procurarPalavraNoArray(palavra, arr) {
  const palavraLowerCase = removerAcentos(palavra.toLowerCase());
  return arr.filter(item => removerAcentos(item.toLowerCase()) === palavraLowerCase);
}

// Exemplo de uso:
const meuArray = ['Pão', 'pão', 'pao', 'pAo', 'Café'];
const palavraProcurada = 'Pão';

const resultados = procurarPalavraNoArray(palavraProcurada, meuArray);

console.log(resultados); // ['Pão', 'pão', 'pao', 'pAo']






function compararStringsSemAcentos(str1, str2) {
  // Divide as strings em partes: livro e número
  const [livro1, numero1] = str1.split(' ');
  const [livro2, numero2] = str2.split(' ');

  // Remove acentos e converte para minúsculas
  const livro1SemAcentos = livro1.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const livro2SemAcentos = livro2.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  // Verifica se os livros e números são iguais
  return livro1SemAcentos === livro2SemAcentos && numero1 === numero2;
}

// Exemplo de uso:
const string1 = 'SALMOS 55';
const string2 = 'salmos 22';

console.log(compararStringsSemAcentos(string1, string2)); // Retorna true






*/
