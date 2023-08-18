"use strict";

var canvas = document.getElementById("tela");
var ctx = canvas.getContext("2d");

var x = 100, y = 70;
var teclas = [];
var ang = 0;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	processKeys();

	ctx.save();
	drawBackground();
	
	ctx.translate(x, y);
	ctx.rotate(ang);
	drawCar();
	
	ctx.restore();

	requestAnimationFrame(draw);
}

function drawBackground() {
	//drawSky();
	//drawSun();
	drawGrass();
	drawRoad();
	drawRoadStripes();
}

function drawSky() {
	ctx.fillStyle = "lightblue";
	ctx.fillRect(0, 0, canvas.width, 100);
}

function drawSun() {
	ctx.fillStyle = "yellow";
	ctx.beginPath();
	ctx.arc(250, 50, 20, 0, Math.PI * 2);
	ctx.fill();
}

function drawGrass() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRoad() {
	ctx.fillStyle = "gray";
	ctx.fillRect(50, 20, canvas.width - 100, 100);
    ctx.fillRect(canvas.width - 250, 100, 200, canvas.height - 120);
	ctx.fillRect(50, canvas.height - 120, canvas.width - 100, 100);
	ctx.fillRect(50, 100, 200, canvas.height - 120);
}
function drawRoadStripes() {
	ctx.fillStyle = "white";
	for (var i = 0; i < 50; i++) {
		ctx.fillRect(150 + i * 20, 70, 10, 2);
	}
	
	for (var i = 0; i < 22 ; i++) {
        ctx.fillRect(canvas.width - 150, 125 + i * 20, 2, 10);
    }

	for (var i = 0; i < 50; i++) {
		ctx.fillRect(150 + i * 20, canvas.height - 70, 10, 2);
	}

	for (var i = 0; i < 22 ; i++) {
        ctx.fillRect(150, 125 + i * 20, 2, 10);
    }

}
var limitX = 205;         // coordenada X do canto superior esquerdo do quadrado
var limitY = 100;         // coordenada Y do canto superior esquerdo do quadrado
var limitWidth = 825;     // largura do quadrado
var limitHeight = 475;    // altura do quadra
function processKeys() {
    var moveX = x, moveY = y;  // Define as novas coordenadas iniciais

    if (teclas[39]) {  // Direita
        ang += Math.PI / 90;
    }
    if (teclas[37]) {  // Esquerda
        ang -= Math.PI / 90;
    }
    if (teclas[38]) {  // Cima
        moveX = x + 2 * Math.cos(ang);
        moveY = y + 2 * Math.sin(ang);
    }
    if (teclas[40]) {  // Baixo
        moveX = x - 2 * Math.cos(ang);
        moveY = y - 2 * Math.sin(ang);
    }

    // Limitar as coordenadas às dimensões do canvas
    moveX = Math.max(90, Math.min(canvas.width - 90, moveX));
    moveY = Math.max(50, Math.min(canvas.height - 50 , moveY));

    // Verificar se o novo movimento está dentro dos limites da pista
	if (!isInsideLimitSquare(moveX, moveY)) {
		x = moveX;
		y = moveY;
	}

}
function isInsideLimitSquare(posX, posY) {
    return posX > limitX && posX < limitX + limitWidth && posY > limitY && posY < limitY + limitHeight;
}
function drawCar() {
	let larg = 80, alt = 45;
	ctx.fillStyle = "rgb(255, 128, 0)";
	ctx.fillRect(-larg / 2, -alt / 2, larg, alt);
	
	ctx.fillStyle = "rgb(0, 180, 255)";
	ctx.fillRect(0, -19, 20, 38);
	
	ctx.fillStyle = "rgb(255, 255, 0)";
	ctx.fillRect(32, -19, 8, 10);
	ctx.fillRect(32, 9, 8, 10);
	
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.stroke();
}



document.onkeydown = function (evt) {
	teclas[evt.keyCode] = true;
}

document.onkeyup = function (evt) {
	teclas[evt.keyCode] = false;
}

requestAnimationFrame(draw);
