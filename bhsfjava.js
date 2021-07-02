//Definition der Variablen
let character = document.getElementById("character");
let block1 = document.getElementById("block1");
let block2 = document.getElementById("block2");
let game = document.getElementById("game");
// let gameoverScreen = document.getElementById("gameoverScreen");
let hpAnzeige = document.getElementById("hp-anzeige");
let hp1 = document.getElementById("hp1");
let hp2 = document.getElementById("hp2");
let endscreen = document.getElementById("end");
let score = document.getElementById("score");
let bestscore = document.getElementById("bestscore");
const startBtn = document.querySelector('#start-button');
const restartBtn = document.querySelector('#restart-button');
let currentScore = document.getElementById("currentScore");
let checkDead;

//SoundVariablen
let myAudio = document.getElementById("myAudio");
let playSound = document.getElementById("playSound");
let deathSound = document.getElementById("deathSound");
//let hitSound = document.getElementById("hitSound");

const char = {
	'hp': 2,
	'score': 0
}

const resizeGameFrame = function () {
	const gameFrameWidth = parseInt(window.getComputedStyle(game).getPropertyValue("width"));
	game.style.height = (gameFrameWidth/2.5) + 'px';
}

resizeGameFrame();

//BlockSpawnFunktion
const addBlock = function () { // color, speed, delay

	const block = document.createElement('div');

	const blockType = Math.floor(Math.random() * 3) + 1;

	block.classList.add('block' + blockType);
	block.classList.add('block');

	const delay = (Math.floor(Math.random() * 30) + 1) / 10;
	block.style.animationDelay = delay + 's';

	game.appendChild(block);
}

//Startfunktion
const startGame = function () {
	clearTimeout(checkDead);
	game.classList.add('running');
	// game.classList.remove('overlay');
	console.log('game started');
	// gameoverScreen.classList.add('hidden');
	endscreen.classList.add('hidden');
	restartBtn.classList.remove('hidden');
	startBtn.classList.add('hidden');
	const blocks = game.querySelectorAll('.block');
	for (block of blocks) {
		block.remove()
	}

	addBlock();

	char.hp = 2;
	char.score = 0;
	hp1.classList.remove('hidden');
	hp2.classList.remove('hidden');

	//Hitboxfunktion
	checkDead = setInterval(function () {
		// let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));

		let characterData = {
			'left': parseInt(window.getComputedStyle(character).getPropertyValue("left")),
			'bottom': parseInt(window.getComputedStyle(character).getPropertyValue("bottom")),
			'width': parseInt(window.getComputedStyle(character).getPropertyValue("width")),
			'height': parseInt(window.getComputedStyle(character).getPropertyValue("height"))
		}

		if (char.score % 600 == 0) {
			addBlock();
		}

		const blocks = game.querySelectorAll('.block:not(.hidden)');

		for (block of blocks) {
			// let left = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

			let blockData = {
				'left': parseInt(window.getComputedStyle(block).getPropertyValue("left")),
				'bottom': parseInt(window.getComputedStyle(block).getPropertyValue("bottom")),
				'width': parseInt(window.getComputedStyle(block).getPropertyValue("width")),
				'height': parseInt(window.getComputedStyle(block).getPropertyValue("height"))
			}
			//console.log(characterData.left, blockData.left);

			/*
			console.log({
				'a': characterData.bottom,
				'b': blockData.height,
				'c': blockData.bottom
			});
			*/

			if (blockData.left < (characterData.left+characterData.width) && blockData.left > characterData.left && characterData.bottom < blockData.height) {
				block.classList.add('hidden');
				char.hp -= 1;
				hp1.classList.add('hidden'); //Entfernt ein HP-Block
				hitSound.play();
				//Wenn Position des linken Blocks zwischen 20 und 0 liegt, 
				//und die Höhe des Charas größer als 130 (150 - 20), dann gibts ne Kollision
			}
		}	
		
		if (char.hp < 1) {
			clearTimeout(checkDead);
			console.warn("u lose.");
			console.log(char.score);
			// game.classList.add('overlay');
			// gameoverScreen.classList.remove('hidden');
			hp2.classList.add('hidden');
			startBtn.classList.add('hidden');
			
		 	let newtime = (char.score/100).toFixed(2);
			let besttime = parseFloat(localStorage.getItem('highscore')) || 0;

			if (newtime > besttime) {
				localStorage.setItem('highscore', newtime);
				besttime = newtime;

				score.innerText = "Score: " + newtime + "s";
				bestscore.innerText = "New Highscore: " + newtime + "s";
			}
			else if (newtime == besttime) {
				score.innerText = "Score: " + newtime + "s";
				bestscore.innerText = "Highscore matched: " + newtime + "s";
			}
			else if (newtime < besttime) {
				score.innerText = "Score: " + newtime + "s";
				bestscore.innerText = "Highscore: " + besttime + "s";
			}
			endGame();
		}
		char.score += 1;
		currentScore.innerText = char.score/100 + "s";
	}, 10);
}

const endGame = function () {
	game.classList.remove('running');
	console.log('game ended');
	endscreen.classList.remove('hidden');
	deathSound.play();
}

//Buttons und Tasten
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
window.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        jump();
    }
    if (event.key === 'r' || event.key === 'R')  {
        event.preventDefault();
        startGame();
        playSound.play();
    }
     if (event.key === 'm' || event.key === 'M')  {
        event.preventDefault();
        togglePlay();
    }
});

//Sprungfunktion
function jump(){
	if(character.classList != "animate"){ //Falls keine Animationsklasse
		character.classList.add("animate"); //gibt die Animationsklasse
		jumpSound.play();
	}
	setTimeout(function() {
		character.classList.remove("animate"); //entfernt Animationsklasse nach einem Sprung
	}, 300); //Dauer
}

//Blockwechselfunktion
function hideBlocks() {
  var x = document.getElementById("block1");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//Musik & Audio
let isPlaying = false;
myAudio.volume = 0.2;
myAudio.loop = true;

deathSound.volume = 0.2;
playSound.volume = 0.2;
jumpSound.volume = 0.2;

function togglePlay() {
  isPlaying ? myAudio.pause() : myAudio.play();
};

myAudio.onplaying = function() {
  isPlaying = true;
};
myAudio.onpause = function() {
  isPlaying = false;
};
  
startBtn.onclick = function() {
	playSound.play();
        }
restartBtn.onclick = function() {
	playSound.play();
          }

window.addEventListener('resize', function(event) {
	resizeGameFrame();
}, true);



//Was ich brauche:
//Nachdem ich R (Restart) mitten im Game drück, läuft der Scorer ewig weiter und deathSound wiederholt sich ewig
//Muss hitSound nicht definiert werden?
//Hitbox mit px bestimmen ist schwer
//GameoverScreen wie einblenden?
//Wie kann ich festes backgroundimage haben?