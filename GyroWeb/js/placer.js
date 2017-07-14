
var Placer = function(long, width) {
	this.long = long;
	this.width = width;
	console.log("this.long cr" + this.long);
};

Placer.prototype.setField = function (field) {
	this.field = field;
};

Placer.prototype.setSize = function(long, width) {
	this.long = long;
	this.width = width;
};

Placer.prototype.countBlockSize = function(funcCreateBlock, widthB, heigth) {
	this.widthB = widthB;
	console.log("this.widthB" + this.widthB);
	this.stepHall = (this.long - (this.field.getSize()[0] + 1) * widthB) / this.field.getSize()[0];
	console.log("this.field" + this.field);
	console.log("this.field.getSize()[0]" + this.field.getSize()[0]);
	console.log("this.field.getSize()[0]" + this.field.getSize()[0]);
	this.longB = this.stepHall + 2 * widthB;
	console.log("this.long" + this.longB);
	console.log("this.stepHall" + this.stepHall);
	funcCreateBlock(this.longB, widthB, heigth, this.stepHall);
};

Placer.prototype.Operate = function(numberOfScores, numberOfTraps, startPoint) {
	this.field.CreateStartPoint(startPoint);
	this.field.AllPaths();
	this.field.CreateContent(numberOfScores, numberOfTraps);
};

Placer.prototype.create3DField = function (funcBuildingBlockesHor, funcBuildingBlockesVert) {
	var i = 0;
	var j = 0;
	var map = this.field.getBitMap();
	var x = -this.width / 2 + this.longB  / 2;
	var y = -this.width / 2 + this.widthB / 2;
	var mapPart;
	var stepHallWidth = this.stepHall + this.widthB;
	console.log("this.stepHall " + this.stepHall);
	console.log("this.width " + this.width);
	console.log("this.stepHall + this.width; " + stepHallWidth);
	for (i = 0; i < map[0].length; i++) {
		mapPart = map[0][i];
		x = -this.width / 2 + this.longB  / 2;
		for (j = 0; j < mapPart.length; j++) {
			if (mapPart[j])
				funcBuildingBlockesVert(x, y);
			x += stepHallWidth;
			console.log("Position vert" + x + " : " + y);
		}
		y += stepHallWidth;
	}
	var y = -this.width / 2 + this.longB  / 2;
	var x = -this.width / 2 + this.widthB / 2;
	for (i = 0; i < map[1].length; i++) {
		mapPart = map[1][i];
		y = -this.width / 2 + this.longB  / 2;
		for (j = 0; j < mapPart.length; j++) {
			if (mapPart[j])
				funcBuildingBlockesHor(x, y);
			y += stepHallWidth;
			console.log("Position hor" + x + " : " + y);
		}
		x += stepHallWidth;
	}
};

Placer.prototype.placeContent = function(funcPlaceScore, funcPlaceTrap, finishPlacer, startPlace) {
	var stepHallWidth = this.stepHall + this.widthB;
	var halfStepWidth = this.stepHall / 2 + this.widthB;
	var correct = -this.width / 2;
	var scorePoints = this.field.getScorePoints();
	var trapPoints = this.field.getTrapPoints();
	console.log("scorePoints " + scorePoints.length);
	var i = 0;
	for (i = 0; i < scorePoints.length; i++) {
		funcPlaceScore(scorePoints[i][0] * stepHallWidth + halfStepWidth + correct, scorePoints[i][1] * stepHallWidth + halfStepWidth + correct);
	}
	for (i = 0; i < trapPoints.length; i++) {
		funcPlaceTrap(trapPoints[i][0] * stepHallWidth + halfStepWidth + correct, trapPoints[i][1] * stepHallWidth + halfStepWidth + correct);
	}
	var finish = this.field.CreateFinishPoint().getPosition();
	console.log("this.field.CreateFinishPoint().getPosition();" + this.field.getFinishPoint());
	finishPlacer(finish[0] * stepHallWidth + halfStepWidth + correct, finish[1] * stepHallWidth + halfStepWidth + correct)
	var start = this.field.getStartPoint();
	startPlace(start[0] * stepHallWidth + halfStepWidth + correct, start[1] * stepHallWidth + halfStepWidth + correct)
};