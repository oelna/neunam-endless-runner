//Erstellung der Variablen für Chara und Objekt
let character = document.getElementById("character");
let block1 = document.getElementById("block1");
let block2 = document.getElementById("block2");
let game = document.getElementById("game");
let endscreen = document.getElementById("end");
let score = document.getElementById("score");
const startBtn = document.querySelector('#start-button');
const restartBtn = document.querySelector('#restart-button');
let checkDead;


const char = {
	'hp': 2,
	'score': 0
}

const addBlock = function () { // color, speed, delay

	const block = document.createElement('div');

	const blockType = Math.floor(Math.random() * 3) + 1;

	block.classList.add('block' + blockType);
	block.classList.add('block');

	const delay = (Math.floor(Math.random() * 30) + 1) / 10;
	block.style.animationDelay = delay + 's';

	game.appendChild(block);
}

const startGame = function () {
	game.classList.add('running');
	console.log('game started');
	endscreen.classList.add('hidden');

	const blocks = game.querySelectorAll('.block');
	for (block of blocks) {
		block.remove()
	}

	addBlock();

	char.hp = 2;
	char.score = 0;

	//Hitboxfunktion
	checkDead = setInterval(function () {
		let characterTop = 
		parseInt(window.getComputedStyle(character).getPropertyValue("top")); 

		if (char.score % 600 == 0) {
			addBlock();
		}

		const blocks = game.querySelectorAll('.block:not(.hidden)');

		for (block of blocks) {
			let left = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

			if (left < 20 && left > 0 && characterTop >= 130) {
				//block1.style.animation = "none";
				//block1.style.display = "none";
				block.classList.add('hidden');
				char.hp -= 1;
				//Wenn Position des linken Blocks zwischen 20 und 0 liegt, 
				//und die Höhe des Charas größer als 130, dann gibts ne Kollision
			}
		}

/*
		//Gibt die obere Position des charas. parseInt gibt Position ohne Einheit
		let block1Left = 
		parseInt(window.getComputedStyle(block1).getPropertyValue("left"));
		let block2Left = 
		parseInt(window.getComputedStyle(block2).getPropertyValue("left"));

		if (block1Left < 20 && block1Left > 0 && characterTop >= 130) {
			//block1.style.animation = "none";
			//block1.style.display = "none";
			block1.classList.add('hidden');
			char.hp -= 1;
			//Wenn Position des linken Blocks zwischen 20 und 0 liegt, 
			//und die Höhe des Charas größer als 130, dann gibts ne Kollision
		}
		if (block2Left < 20 && block2Left > 0 && characterTop >= 130) {
			//block2.style.animation = "none";
			//block2.style.display = "none";
			block2.classList.add('hidden');
			char.hp -= 1;
		}
*/
		if (char.hp < 1) {
			clearTimeout(checkDead);
			console.warn("u lose.");
			console.log(char.score);
			score.innerText = char.score;
			endGame();
		}

		char.score += 1;
	}, 10);
}

const endGame = function () {
	game.classList.remove('running');
	console.log('game ended');
	endscreen.classList.remove('hidden');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
game.addEventListener('click', jump);

//Sprungfunktion
function jump(){
	if(character.classList != "animate"){ //Falls keine Animationsklasse
	character.classList.add("animate"); //gibt die Animationsklasse
	}
	setTimeout(function(){
		character.classList.remove("animate"); //entfernt Animationsklasse nach einem Sprung
	},500); //Dauer
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




//Was ich brauche:
//blocks sollten sich abwechseln nachdem sie einmal gelooped sind
//mapping von Sprung/Restart auf Tasten
//Scoresystem