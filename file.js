let pokeName = document.querySelector(".poke-name");
let pokeWeight = document.querySelector(".poke-weight");
let pokeHeight = document.querySelector(".poke-height");
let screen = document.querySelector(".main-screen");
let pokeTypeOne = document.querySelector(".poke-type-one");
let pokeTypeTwo = document.querySelector(".poke-type-two");
let pokeImageOne = document.querySelector(".poke-front-image");
let pokeImageTwo = document.querySelector(".poke-back-image");
let pokeInput = document.querySelector(".poke-input");
let screenTwo = document.querySelector(".second_screen");
let pokeList = document.getElementById("items").children;
let nextList = document.querySelector(".right-button");
let prevList = document.querySelector(".left-button");
let guess = document.querySelector(".guess-button");
let pokeImage = document.querySelector(".poke-image");
let GuessName = "";
let screenType = true;
let number = 1;
let randomNum;
var audio = new Audio(
  "https://vgmsite.com/soundtracks/pokemon-ten-years-of-pokemon/zmouwohk/1-Pokemon%20Theme%20%28Season%20Theme%29.mp3"
);
let nextUrl = "null";
let prevUrl = "null";

const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

function callServer(num) {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${num}`,

    success(response) {
      if (screenType) setData(response);
      else guessPokemon(response);
    },

    error() {
      alert("Invalid");
    },
  });
}

function callServerList(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const { previous, next } = data;
      nextUrl = next;
      prevUrl = previous;

      data["results"].forEach((element, num) => {
        let index = element.url.split("/")[6];
        pokeList[num].textContent = index + " " + element.name;
      });
    });
}

function setData(pokemon) {
  let poke = pokemon["species"]["name"];
  pokeName.textContent = poke[0].toUpperCase() + poke.substring(1, poke.length);
  pokeName.style.color = "black";
  pokeWeight.textContent = pokemon["weight"];
  pokeHeight.textContent = pokemon["height"];

  if (pokemon["types"].length == 2) {
    pokeTypeTwo.classList.remove("hide");
    pokeTypeOne.textContent = pokemon["types"][0]["type"]["name"];
    pokeTypeTwo.textContent = pokemon["types"][1]["type"]["name"];
  } else {
    pokeTypeOne.textContent = pokemon["types"][0]["type"]["name"];
    pokeTypeTwo.classList.add("hide");
  }

  pokeImageOne.src = pokemon["sprites"]["front_default"];
  pokeImageTwo.src = pokemon["sprites"]["back_default"];

  let color = colors[pokemon.types[0].type.name];

  screen.style.backgroundColor = color;
}

function guessPokemon(pokemon) {
  pokeImage.src = pokemon["sprites"]["front_default"];
  GuessName = pokemon["species"]["name"];
  let color = colors[pokemon.types[0].type.name];
  screenTwo.style.backgroundColor = color;
}

document.addEventListener("click", function (e) {
  let pokeNum = parseInt(e.target.textContent.split(" ")[0]);
  let value = e.target.id;

  if (value === "right" || value === "top") callServer(number++);

  if (value === "left" || value === "bottom") callServer(number--);

  if (value === "middle") callServer((number = 1));

  if (e.target.className === "list-item") callServer((number = pokeNum));

  if (value === "Play") {
    audio.play();
    return;
  }

  if (value === "Stop") {
    audio.pause();
    return;
  }
});

nextList.addEventListener("click", function () {
  if (nextUrl) {
    callServerList(nextUrl);
  }
});

prevList.addEventListener("click", function () {
  if (prevUrl) {
    callServerList(prevUrl);
  }
});

guess.addEventListener("click", function (e) {
  if (screenType == true) {
    guess.textContent = "Pokedex";
    screen.classList.add("hide");
    screenTwo.classList.remove("hide");
    nextList.classList.add("hide");
    prevList.classList.add("hide");
    screenType = false;
    randomNum = Math.floor(Math.random() * 100 + 1);
    callServer((number = randomNum));
  } else {
    guess.textContent = "Guess";
    screen.classList.remove("hide");
    screenTwo.classList.add("hide");
    nextList.classList.remove("hide");
    prevList.classList.remove("hide");
    screenType = true;
    callServer(number);
  }
});

pokeInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (pokeInput.value === GuessName) {
      pokeInput.value = "";
      randomNum = Math.floor(Math.random() * 100 + 1);
      callServer((number = randomNum));
      return;
    }
  }
});

callServer(number);
callServerList("https://pokeapi.co/api/v2/pokemon?loffset=0&imit=20");
