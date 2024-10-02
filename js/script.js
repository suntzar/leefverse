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
  let capitulo = gerarCapituloAleatorio();
  let input = document.getElementById("search").value;
  let [book, numero] = input.split(" ");

  if (input === "") {
    buscarLivroPorCapitulo(capitulo);
  } else {
    buscarLivroPorNome(book, numero);
  }
}

function gerarCapituloAleatorio() {
  return Math.floor(Math.random() * 1189 + 1);
}

function buscarLivroPorCapitulo(capitulo) {
  let acumulado = 0;
  for (let idLivro in livros) {
    acumulado += livros[idLivro][1];
    if (capitulo <= acumulado) {
      carregarVersiculos(idLivro, capitulo - (acumulado - livros[idLivro][1]));
      break;
    }
  }
}

function buscarLivroPorNome(book, numero) {
  for (let livro in livros) {
    if (removerAcentos(livros[livro][0]).toLowerCase() === removerAcentos(book).toLowerCase()) {
      carregarVersiculos(livro, parseInt(numero));
      break;
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

async function getBookName(numbk) {
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
  const versiculos = await carregarDados("json/verses.json");
  const titles = await carregarDados("json/titles.json");
  const marcarp = JSON.parse(localStorage.getItem("6578431209")) || {};

  atualizarTitulo(titles, livro, capitulo);
  const textos = processarVersiculos(versiculos, marcarp, livro, capitulo);

  document.getElementById("title").innerHTML = `<h2 class='title'>${livros[livro][0]} ${capitulo}</h2>`;
  document.getElementById("verses").innerHTML = textos;
}

async function carregarDados(url) {
  const resposta = await fetch(url);
  return await resposta.json();
}

function atualizarTitulo(titles, livro, capitulo) {
  const title = titles.find((t) => t.chapter === capitulo && t.book_number === livro * 1);
  if (title) {
    document.getElementById("subt").innerHTML = title.title;
  }
}

function processarVersiculos(versiculos, marcarp, livro, capitulo) {
  return versiculos
    .filter((v) => v.chapter === capitulo && v.book_number === livro * 1 && v.text !== "")
    .map((v, i) => {
      const marcar = marcarp[i] || "";
      const verse = extrairNumero(v.text, i, marcar);
      if (!isNaN(verse.numero) && !isNaN(parseFloat(verse.numero)) && verse.numero !== "") {
        return `<p style="padding:1.8%;text-align: center;" class="v"><b>${verse.novaString}</p>\n\n`;
      } else if (/\[.*?\]/.test(v.text)) {
        return `<p class="v ${marcar}" id="verse_${i}" onclick="marcar(${i})">${v.text.replace(/\[(.*?)\]/g, '<span style="color: var(--color-p);"><b>$1</b></span>')}</p>\n\n`;
      } else {
        return `<i data-duoicon="bookmark"></i><p class="v ${marcar}" id="verse_${i}" onclick="marcar(${i})"><span style="color: var(--color-p);"><b>${v.verse}</b></span> ${v.text}</p>\n\n`;
      }
    })
    .join("");
}

function getRandom(n, m) {
  return Math.floor(Math.random() * (m - n + 1)) + n;
}

function getImgAndSet() {
  let apiKey = "44797048-381ef955887bcab451564aada";
  for (let i = 0; i < 50; i++) {
    let idImg = document.getElementById("img_id_" + i);
    if (idImg) {
      let name = idImg.alt;
      let requestURL = `https://pixabay.com/api/?key=${apiKey}&image_type=photo&orientation=horizontal&category=nature&order=popular&pretty=true&per_page=50&q=` + name;
      fetch(requestURL)
        .then((response) => response.json())
        .then((data) => {
          let img = data.hits[i].webformatURL;
          idImg.src = img;
        });
    }
  }
}

function getImg(q) {
  let apiKey = "44797048-381ef955887bcab451564aada";
  //let q = "leaf+moss";
  //let q = "leaf+autumn";
  //let q = "ice";
  let requestURL = `https://pixabay.com/api/?key=${apiKey}&image_type=photo&orientation=horizontal&category=nature&order=popular&pretty=true&per_page=100&q=` + q;
  let idImg = document.getElementById("img_id_1");
  fetch(requestURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.hits);
      let img = data.hits[getRandom(0, data.hits.length - 1)].webformatURL;
      idImg.src = img;
    });
}

const themes = {
  nord_green: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#9bbf93",
    "--color-s": "#9bbf939b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7",
    "--color-d": "#313038",
    "--color-b": "#1c1b21"
  },
  dark: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#b9a990",
    "--color-s": "#9c8b70",
    "--color-sf": "#768c77",
    "--color-z": "#27272a",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#2c2c2e",
    "--color-yf": "#363639c3"
  },
  red: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#ff6666",
    "--color-s": "#ff66669b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7"
  },
  orange: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#ffb266",
    "--color-s": "#ffb2669b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7"
  },
  yellow: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#ffdb99",
    "--color-s": "#ffdb999b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7"
  },
  green: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#b0ffb0",
    "--color-s": "#b0ffb09b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7"
  },
  blue: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#b0d8ff",
    "--color-s": "#b0d8ff9b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7"
  },
  indigo: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#c8b0ff",
    "--color-s": "#c8b0ff9b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7"
  },
  violet: {
    "--color-f": "#e4e1e2a5",
    "--color-p": "#dbb0ff",
    "--color-s": "#dbb0ff9b",
    "--color-sf": "#768c77",
    "--color-z": "#3b3b44",
    "--color-zf": "#3f3d4a9d",
    "--color-y": "#4f4d5b",
    "--color-yf": "#4d4e5bb7"
  }
};

function applyTheme(theme) {
  const link = document.documentElement.style;
  const colors = themes[theme];
  for (const [key, value] of Object.entries(colors)) {
    link.setProperty(key, value);
  }
  document.getElementById("icon").setAttribute("colors", "primary:" + themes[theme]["--color-p"]);
}

function themeOptions() {
  let list = document.getElementById("theme-list");
  list.innerHTML = "";

  for (let theme in themes) {
    let block = `<li><div class="theme-box" style="background-color: ${themes[theme]["--color-p"]};" onclick="applyTheme('${theme}');"></div></li>`;
    list.innerHTML += block;
  }
}

function speak() {
  let msg = new SpeechSynthesisUtterance();
  msg.text = document.getElementById("imgText").innerHTML;
  msg.lang = "pt-BR";
  window.speechSynthesis.speak(msg);
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

const diffMax = 10;
let xDown = null;

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(evt) {
  xDown = getTouchX(evt);
}

function handleTouchMove(evt) {
  if (!xDown) return;

  const xUp = getTouchX(evt);
  const xDiff = xDown - xUp;

  if (xDiff > diffMax) {
    page_read();
  } else if (xDiff < -diffMax) {
    page_home();
  }

  xDown = null;
}

function getTouchX(evt) {
  return evt.touches[0].clientX;
}

document.addEventListener("DOMContentLoaded", () => {
  loadSelect();
  document.getElementById("bible-sel").addEventListener("change", loadCap);
  document.getElementById("search-btn").addEventListener("click", searchCap);
});

function loadSelect() {
  const bookSelect = document.getElementById("bible-sel");
  const capSelect = document.getElementById("bible-cap");

  carregarLivros(bookSelect);
  carregarCapitulos(capSelect, 10); // Carrega capítulos iniciais para o livro com ID 10
}

function carregarLivros(bookSelect) {
  Object.keys(livros).forEach((key) => {
    const option = document.createElement("option");
    option.textContent = livros[key][0]; // Adiciona apenas o nome do livro
    bookSelect.appendChild(option);
  });
}

function carregarCapitulos(capSelect, bookId) {
  capSelect.innerHTML = "";
  for (let i = 1; i <= livros[bookId][1]; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    capSelect.appendChild(option);
  }
}

function loadCap() {
  const bookId = getBookId(document.getElementById("bible-sel").value);
  const capSelect = document.getElementById("bible-cap");
  carregarCapitulos(capSelect, bookId);
}

function searchCap() {
  const bookId = +getBookId(document.getElementById("bible-sel").value);
  const cap = +document.getElementById("bible-cap").value;
  carregarVersiculos(bookId, cap);
}

typed = new Typed(".tbar", {
  strings: [`LEEF`, `LEEF VERSE`, `<span style="color: var(--color-p)">LEEF</span> VERSE`],
  typeSpeed: 50
});

function onLoad() {
  cache();
  encontrarLivro();
  themeOptions();
  getImg("sea");
  applyTheme("blue");
  duoIcons.createIcons();
  loadSelect();
  page_home();
}

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    page_home();
  }
  if (event.code === "ArrowRight") {
    page_read();
  }
});

window.addEventListener("load", onLoad);

document.getElementById("bible-sel").addEventListener("change", loadCap);

window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loading").style.opacity = "0";
  }, 3000);
  setTimeout(function () {
    document.getElementById("loading").style.zIndex = "0";
  }, 2000);
});
