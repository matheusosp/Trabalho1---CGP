"use strict";

var canvas = document.getElementById("tela");
var ctx = canvas.getContext("2d");

var x = 100, y = 70;
var teclas = [];
var ang = 0;
var iCurrentSpeed = 0;
var iTargetSpeed = 0;
var job = null;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	processKeys();

	ctx.save();

	drawBackground();
	drawSpeedometer();

	ctx.translate(x, y);
	ctx.rotate(ang);
	drawCar();
	
	ctx.restore();

	requestAnimationFrame(draw);
}
function drawSpeedometer(){
	var optionsSpeedometer = buildOptionsAsJSON(canvas, iCurrentSpeed);

	drawTicks(optionsSpeedometer);
	drawTextMarkers(optionsSpeedometer);
	drawSpeedometerColourArc(optionsSpeedometer);
	drawNeedle(optionsSpeedometer);
}
function drawBackground() {
	drawGrass();
	drawRoad();
	drawRoadStripes();
}
function drawWithInputValue(speed) {
	iTargetSpeed = speed;

	if (isNaN(iTargetSpeed)) {
		iTargetSpeed = 0;
	} else if (iTargetSpeed < 0) {
		iTargetSpeed = 0;
	} else if (iTargetSpeed > 80) {
		iTargetSpeed = 80;
	}

	job = setTimeout("drawSpeedometer()", 5);
}
function drawTicks(options) {
	drawSmallTickMarks(options);
	drawLargeTickMarks(options);
}
function drawTextMarkers(options) {
	var innerTickX = 0,
	    innerTickY = 0,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickToPrint = 80;
	options.ctx.font = 'italic 10px sans-serif';
	options.ctx.textBaseline = 'top';

	options.ctx.beginPath();

	for (iTick = 10; iTick < 180; iTick += 20) {

		innerTickX = gaugeOptions.radius - (Math.cos(degToRad(iTick)) * gaugeOptions.radius);
		innerTickY = gaugeOptions.radius - (Math.sin(degToRad(iTick)) * gaugeOptions.radius);
		if (iTick <= 10) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
		} else if (iTick < 50) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX - 5,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
		} else if (iTick < 90) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
		} else if (iTick === 90) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 4,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
		} else if (iTick < 145) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 10,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
		} else {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 15,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
		}

		iTickToPrint += Math.round(2160 / 9);
	}

    options.ctx.stroke();
}
function drawSpeedometerColourArc(options) {
	var startOfGreen = 10,
	    endOfGreen = 200,
	    endOfOrange = 280;

	drawSpeedometerPart(options, 1.0, "rgb(82, 240, 55)", startOfGreen);
	drawSpeedometerPart(options, 0.9, "rgb(198, 111, 0)", endOfGreen);
	drawSpeedometerPart(options, 0.9, "rgb(255, 0, 0)", endOfOrange);

}
function drawNeedle(options) {
	var iSpeedAsAngle = convertSpeedToAngle(options.speed),
	    iSpeedAsAngleRad = degToRad(iSpeedAsAngle),
        gaugeOptions = options.gaugeOptions,
        innerTickX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * 20),
        innerTickY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * 20),
        fromX = (options.center.X - gaugeOptions.radius) + innerTickX,
        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY,
        endNeedleX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * gaugeOptions.radius),
        endNeedleY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * gaugeOptions.radius),
        toX = (options.center.X - gaugeOptions.radius) + endNeedleX,
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY,
        line = createLine(fromX, fromY, toX, toY, "rgb(255,0,0)", 5, 0.6);

	drawLine(options, line);
	drawNeedleDial(options, 0.6, "rgb(127, 127, 127)", "rgb(255,255,255)");
	drawNeedleDial(options, 0.2, "rgb(127, 127, 127)", "rgb(127,127,127)");
}
function drawSmallTickMarks(options) {
	var tickvalue = options.levelRadius - 8,
	    iTick = 0,
	    gaugeOptions = options.gaugeOptions,
	    iTickRad = 0,
	    onArchX,
	    onArchY,
	    innerTickX,
	    innerTickY,
	    fromX,
	    fromY,
	    line,
		toX,
		toY;

	for (iTick = 10; iTick < 180; iTick += 20) {
		iTickRad = degToRad(iTick);
		onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
		onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
		innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
		innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

		fromX = (options.center.X - gaugeOptions.radius) + onArchX;
		fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
		toX = (options.center.X - gaugeOptions.radius) + innerTickX;
		toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

		line = createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6)
		drawLine(options, line);
	}
}
function drawLargeTickMarks(options) {
	var tickvalue = options.levelRadius - 8,
	    iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickRad = 0,
        innerTickY,
        innerTickX,
        onArchX,
        onArchY,
        fromX,
        fromY,
        toX,
        toY,
        line;

	tickvalue = options.levelRadius - 2;
	for (iTick = 20; iTick < 180; iTick += 20) {

		iTickRad = degToRad(iTick);

		onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
		onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
		innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
		innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

		fromX = (options.center.X - gaugeOptions.radius) + onArchX;
		fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
		toX = (options.center.X - gaugeOptions.radius) + innerTickX;
		toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

		line = createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);
		drawLine(options, line);
	}
}
function drawSpeedometerPart(options, alphaValue, strokeStyle, startPos) {
	options.ctx.beginPath();

	options.ctx.globalAlpha = alphaValue;
	options.ctx.lineWidth = 5;
	options.ctx.strokeStyle = strokeStyle;

	options.ctx.arc(options.center.X,
		options.center.Y,
		options.levelRadius,
		Math.PI + (Math.PI / 360 * startPos),
		0 - (Math.PI / 360 * 10),
		false);

	options.ctx.stroke();
}
function drawNeedleDial(options, alphaValue, strokeStyle, fillStyle) {
    var i = 0;

	for (i = 0; i < 20; i++) {
		options.ctx.beginPath();
		options.ctx.arc(
			options.center.X,
			options.center.Y,
			i,
			0,
			Math.PI,
			true);

		options.ctx.fill();
		options.ctx.stroke();
	}
}
function drawLine(options, line) {
	options.ctx.beginPath();
	options.ctx.moveTo(line.from.X, line.from.Y);

	options.ctx.lineTo(
		line.to.X,
		line.to.Y
	);

	options.ctx.stroke();
}
function buildOptionsAsJSON(canvas, iSpeed) {
	var centerX = 640,
	    centerY = 400,
        radius = 140,
        outerRadius = 200;

	return {
		ctx: canvas.getContext('2d'),
		speed: iSpeed,
		center:	{
			X: centerX,
			Y: centerY
		},
		levelRadius: radius - 10,
		gaugeOptions: {
			center:	{
				X: centerX,
				Y: centerY
			},
			radius: radius
		},
		radius: outerRadius
	};
}
function createLine(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
	return {
		from: {
			X: fromX,
			Y: fromY
		},
		to:	{
			X: toX,
			Y: toY
		},
		fillStyle: fillStyle,
		lineWidth: lineWidth,
		alpha: alpha
	};
}
function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}
function convertSpeedToAngle(speed) {
	var iSpeed = (speed / 10),
	    iSpeedAsAngle = ((iSpeed * 20) + 10) % 180;

	if (iSpeedAsAngle > 180) {
        iSpeedAsAngle = iSpeedAsAngle - 180;
    } else if (iSpeedAsAngle < 0) {
        iSpeedAsAngle = iSpeedAsAngle + 180;
    }

	return iSpeedAsAngle;
}
function drawGrass() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    let textWidth = ctx.measureText("WASD ou setas para movimentar o carro").width;
    
    let x = (canvas.width - textWidth) / 2;
    let y = canvas.height / 2 - 180;
    
    ctx.fillText("WASD ou ⬆️⬅️⬇️➡️  para movimentar o carro", x, y);
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

var limitX = 205;         
var limitY = 100;        
var limitWidth = 825;     
var limitHeight = 475;    
function processKeys() {
    var moveX = x, moveY = y;  

    if (teclas[39]) {  
        ang += Math.PI / 90;
    }
    if (teclas[37]) {  
        ang -= Math.PI / 90;
    }
    if (teclas[38]) {  
        moveX = x + 2 * Math.cos(ang);
        moveY = y + 2 * Math.sin(ang);	
    }
    if (teclas[40]) { 
        moveX = x - 2 * Math.cos(ang);
        moveY = y - 2 * Math.sin(ang);		
    }

	if (teclas[68]) {  //w
        ang += Math.PI / 90;
    }
    if (teclas[65]) {  
        ang -= Math.PI / 90;
    }
    if (teclas[87]) {  
        moveX = x + 2 * Math.cos(ang);
        moveY = y + 2 * Math.sin(ang);	
    }
    if (teclas[83]) { 
        moveX = x - 2 * Math.cos(ang);
        moveY = y - 2 * Math.sin(ang);		
    }

    moveX = Math.max(90, Math.min(canvas.width - 90, moveX));
    moveY = Math.max(50, Math.min(canvas.height - 50 , moveY));

	var auxX = x, auxY = y;
	if (!isInsideLimitSquare(moveX, moveY)) {
		x = moveX;
		y = moveY;
	}
	if(auxX != x || auxY != y)
		drawWithInputValue(iCurrentSpeed += 0.1);
	else
		drawWithInputValue(iCurrentSpeed = 0);
}
function isInsideLimitSquare(posX, posY) {
    return posX > limitX && posX < limitX + limitWidth && posY > limitY && posY < limitY + limitHeight;
}
function drawCar() {
	let larg = 80, alt = 45;

	let carImg = new Image();
	carImg.src = "assets/car.png";
	
    ctx.drawImage(carImg, -larg / 2, -alt / 2, larg, alt);
    
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
