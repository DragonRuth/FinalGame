var Direction = {
	top : 0,
	bottom: 1,
	right: 2,
	left: 3
};


/*
 			 ---------> y
 			|
 			|
 			|
 			|
 			|
 		   \/ x
 */

var Cell = function() {
		this.checked = false;
		this.top = false;
		this.bottom = false;
		this.right = false;
		this.left = false;
};
Cell.prototype.setCheck	= function (input) {
		this.checked = input;
};
	
Cell.prototype.getCheck	= function () {
		return this.checked;
};
	
Cell.prototype.getWalls	= function () {
		return {
			top: this.top,
			bottom: this.bottom,
			right: this.right,
			left: this.left
		};
};
	
Cell.prototype.setWall = function (dir) {
		switch (dir) {
			case Direction.top:
				this.top = true;
				break;
			case Direction.bottom:
				this.bottom = true;
				break;
			case Direction.right:
				this.right = true;
				break;
			case Direction.left:
				this.left = true;
				break;
		};
};
	
Cell.prototype.unsetWall = function (dir) {
		switch (dir) {
			case Direction.top:
				this.top = false;
				break;
			case Direction.bottom:
				this.bottom = false;
				break;
			case Direction.right:
				this.right = false;
				break;
			case Direction.left:
				this.left = false;
				break;
		};	
};


var Nodes = function (pos, length) {
		this.direction = Direction.top;
		this.x = pos[0];
		this.y = pos[1];
		this.length = length;
		this.notFinised = true;
		this.trace = [];
};
Nodes.prototype.Finish = function () {
		this.notFinised = false;
};
	
Nodes.prototype.NotFinished	= function () {
		return this.notFinised;
};
	
Nodes.prototype.setDirection	= function (dir) {
		this.direction = dir;
};
	
Nodes.prototype.getDirection = function () {
		return this.direction;
};
	
Nodes.prototype.addTrace = function (pos) {
		this.trace.push(pos);
};
	
Nodes.prototype.getTrace = function () {
		return this.trace;
};
	
Nodes.prototype.Move = function () {
		this.length++;
		switch (this.direction) {
			case Direction.top:
				this.x--;
				break;
			case Direction.bottom:
				this.x++;
				break;
			case Direction.right:
				this.y++;
				break;
			case Direction.left:
				this.y--;
				break;
		}	
		this.addTrace([this.x, this.y]);
};
	
Nodes.prototype.getLength = function () {
		return this.length;
};
	
Nodes.prototype.incLength = function () {
		this.length++;
};
	
Nodes.prototype.getPosition = function () {
		return [this.x, this.y];
};
	

var Field = function (size, nodes) {
		this.field = [];
		for (var i = 0; i < size[0]; i++) {
			var str = [];
			for (var j = 0; j < size[1]; j++) {
				str.push(new Cell());
			}
			this.field.push(str);
		}
		this.nodes = [];
		this.variaty = nodes / (size[0] * size[1]);
		console.log("The variaty is: " + this.variaty);
		this.startPoint = [0, 0];
		this.size = [size[0] - 1, size[1] - 1];
		this.checked = 0;
		console.log("The field was created.");
};
Field.prototype.getField = function () {
		return this.field;
};
	
Field.prototype.getNodes = function () {
		return this.nodes;
};

Field.prototype.getSize = function () {
	return [this.size[0] + 1, this.size[1] + 1];
};
	
Field.prototype.CreateStartPoint = function (pos) {
		this.startX = pos[0];
		this.startY = pos[1];
		this.nodes.push(new Nodes(pos, 0));
		this.field[pos[0]][pos[1]].setCheck(true);
		console.log("The start point was created.");
};

Field.prototype.getStartPoint = function () {
	return [this.startX, this.startY];
};
	
Field.prototype.ThePath = function () {
		var path = 0;
		var length = this.nodes.length;
		if (length != 0) {
			console.log("node work: " + length);
			for (var i = 0; i < length; i++) {
				var node = this.nodes[i];
				if (node.NotFinished) {
					var pos = node.getPosition();
					console.log("The position is " + pos);
					var len = node.getLength();
					var directions = this.CheckSurround(node);
					var direction = getRandomDirectionBut(directions);
					console.log("The direction is " + direction);
					if (direction === 'no') {
						node.Finish();
						console.log("The node is finished: " + i);
					} else {
						//console.log("The node is under the work: " + i);
						path++;
						node.setDirection(direction);
						node.Move();
						this.field[node.getPosition()[0]][node.getPosition()[1]].setCheck(true);
						this.checked++;
						directions.push(direction);
						var nodeNum = 0;
						variaty = Math.random();
						while (variaty < this.variaty && nodeNum < (4 - directions.length)) {
							direction = getRandomDirectionBut(directions);
							directions.push(direction);
							var newNode = new Nodes(pos, len);
							newNode.setDirection(direction);
							newNode.Move();
							this.field[newNode.getPosition()[0]][newNode.getPosition()[1]].setCheck(true);
							this.checked++;
							this.nodes.push(newNode);
							var variaty = Math.random();
							nodeNum++;
						}
						this.BuildWalls(pos);
					}
				}
			}
		} else {
			console.log("Create a start point!");
		}
		return path;
};
	
Field.prototype.AllPaths = function () {
		//while (this.ThePath() != 0) {
		while (this.ThePath()) {
			console.log("The path. ");
		}
		console.log("Finished! The number of nodes: " + this.nodes.length);
};
	
Field.prototype.CheckSurround = function (node) {
		var result = [];
		var position = node.getPosition();
		var nodePoint = this.field[position[0]][position[1]];
		var point;
		if (position[0] === 0) {
			result.push(Direction.top);
			nodePoint.setWall(Direction.top);
		} else { 
			point = this.field[position[0] - 1][position[1]];
			if (point.getCheck()) {
				result.push(Direction.top);
				nodePoint.setWall(Direction.top);
			}
		}
		if (position[0] === this.size[0]) {
			result.push(Direction.bottom);
			nodePoint.setWall(Direction.bottom);
		} else { 
			point = this.field[position[0] + 1][position[1]];
			if (point.getCheck()) {
				result.push(Direction.bottom);
				nodePoint.setWall(Direction.bottom);
			}
		}
		if (position[1] === 0) {
			result.push(Direction.left);
			nodePoint.setWall(Direction.left);
		} else { 
			point = this.field[position[0]][position[1]  - 1];
			if (point.getCheck()) {
				result.push(Direction.left);
				nodePoint.setWall(Direction.left);
			}
		}
		if (position[1] === this.size[1]) {
			result.push(Direction.right);
			nodePoint.setWall(Direction.right);
		}
		else {
			point = this.field[position[0]][position[1] + 1];
			if (point.getCheck()) {
				result.push(Direction.right);
				nodePoint.setWall(Direction.right);
			}
		}
		nodePoint.unsetWall(antiDirection(node.getDirection()));
		return result;
};
	
Field.prototype.BuildWalls = function (position) {
		var nodePoint = this.field[position[0]][position[1]];
		var point;
		//console.log("BuildWalls " + position);
		
		if (position[0] !== 0 ) {
			point = this.field[position[0] - 1][position[1]];
			if (! point.getCheck()) {
				nodePoint.setWall(Direction.top);
			}
		}
		if (position[1] !== 0) {
			point = this.field[position[0]][position[1]  - 1];
			
			if (! point.getCheck()) {
				nodePoint.setWall(Direction.left);
			}
		}
		
		
		if (position[1] !== this.size[1]) {
			point = this.field[position[0]][position[1] + 1];
			if (! point.getCheck()) {
				nodePoint.setWall(Direction.right);
			}
		}
		
		if (position[0] !== this.size[0]) { 
			point = this.field[position[0] + 1][position[1]];
			if (! point.getCheck()) {
				nodePoint.setWall(Direction.bottom);
			}
		}
};
		
Field.prototype.CreateFinishPoint = function () {
			var nodes = this.nodes;
			var length = nodes.length;
			var i = 0;
			var victoryNode;
			var len;
			console.log(length);
			if (length > 0) {
				victoryNode = nodes[0];
				len = victoryNode.getLength();
				for (i = 1; i < length; i++) {
					if (nodes[i].getLength() > len) {
						len = nodes[i].getLength();
						victoryNode = nodes[i];
						console.log("Length: " + nodes[i].getLength())
					}
				}
				//var point = this.field[victoryNode.Position[0]][victoryNode.Position[1]];
				//console.log("The pos of v: " + point.Check);
				this.victoryPoint = victoryNode.getPosition();
				return victoryNode;
			} else {
				console.log("There are no nodes");
				return false;
			}
};
		
Field.prototype.getFinishPoint = function () {
			return this.victoryPoint;
};
		
Field.prototype.CreateContent = function (numberOfScor, numberOfTrap) {
			var nodes = this.nodes;
			var field = this.field;
			var length = nodes.length - 1;
			var nodeNumber;
			var len;
			var pos;
			var point;
			this.scorePoints = [];
			this.trapPoints = [];
			var i = 0;
			var rep = true;
			if (length > -1) {
				for (i = 0; i < numberOfScor; i++) {
					var rep = true;
					while (rep) {
						nodeNumber = Math.round(Math.random() * length);
						len = Math.round(Math.random() * (nodes[nodeNumber].getTrace().length - 1));
						pos = nodes[nodeNumber].getTrace()[len];
						point = field[pos[0]][pos[1]];
						if (point.getCheck()) {
							this.scorePoints.push(pos);
							point.setCheck(false);
							rep = false;
						}	
					}
				}
				for (i = 0; i < numberOfTrap; i++) {
					rep = true;
					while (rep) {
						nodeNumber = Math.round(Math.random() * length);
						len = Math.round(Math.random() * (nodes[nodeNumber].getTrace().length - 1));
						pos = nodes[nodeNumber].getTrace()[len];
						point = field[pos[0]][pos[1]];
						if (point.getCheck()) {
							this.trapPoints.push(pos);
							point.setCheck(false);
							rep = false;
						}
					}
				}
			} else {
				console.log("There are no nodes");
				return false;
			}
};
		
Field.prototype.getScorePoints =	function () {
			return this.scorePoints;
};
		
Field.prototype.getTrapPoints = function () {
			return this.trapPoints;
};
	
Field.prototype.getBitMap = function () {
		var vert = [];
		var hor = [];
		var help = [];
		var i;
		var j;
		var field = this.field;
		for (i = 0; i < this.size[0] + 1; i++) {
			help.push(field[i][0].getWalls().left && true);
		}
		vert.push(help);
		help = [];
		for (i = 0; i < this.size[1]; i++) {
			for (j = 0; j < this.size[0] + 1; j++) {
				help.push(field[j][i].getWalls().right || field[j][i + 1].getWalls().left);
			}
			vert.push(help);
			help = [];
		}
		for (i = 0; i < this.size[0] + 1; i++) {
			help.push(field[i][this.size[1]].getWalls().right && true);
		}
		vert.push(help);
		help = [];
		
		
		for (i = 0; i < this.size[1] + 1; i++) {
			help.push(field[0][i].getWalls().top && true);
		}
		hor.push(help);
		help = [];
		for (i = 0; i < this.size[0]; i++) {
			for (j = 0; j < this.size[1] + 1; j++) {
				help.push(field[i][j].getWalls().bottom || field[i + 1][j].getWalls().top);
			}
			hor.push(help);
			help = [];
		}
		for (i = 0; i < this.size[1] + 1; i++) {
			help.push(field[this.size[0]][i].getWalls().bottom && true);
		}
		hor.push(help);
		return [vert, hor];
};

function getRandomDirectionBut(inputs) {
	var variaty;
	var result;
	var rep;
	var i;
	var tr;
	if (inputs.length === 0) {
		variaty = Math.random() * 4;
		if (variaty > 3) {
			return Direction.top;
		} else if (variaty > 2) {
			return Direction.bottom;	
		} else if (variaty > 1) {
			return Direction.right;				
		} else {
			return Direction.left;	
		}
	} else if (inputs.length === 4){
		return 'no';
	} else {
		variaty = Math.random() * 4;
		result = -1;
		rep = false;
		if (variaty < 3)
			rep = true;
		while (result < 0) {
			if (variaty > 3) {
				tr = false;
				for (i = 0; i < inputs.length; i++)
					if (inputs[i] === Direction.top) {
						tr = true;
						break;
					}
				if (!tr)
					result = Direction.top;
				else
					variaty -= 1;
			} else if (variaty > 2) {
				tr = false;
				for (i = 0; i < inputs.length; i++)
					if (inputs[i] === Direction.bottom) {
						tr = true;
						break;
					}
				if (!tr)
					result = Direction.bottom;
				else
					variaty -= 1;
				
			} else if (variaty > 1) {
				tr = false;
				for (i = 0; i < inputs.length; i++)
					if (inputs[i] === Direction.right) {
						tr = true;
						break;
					}
				if (!tr)
					result = Direction.right;
				else
					variaty -= 1;
			} else {
				tr = false;
				for (i = 0; i < inputs.length; i++) 
					if (inputs[i] === Direction.left) {
						tr = true;
					}
					if (!tr)
						result = Direction.left;
					else
						if (rep) {
							variaty = 3.5;
							rep = false;
						}
						else
							return 'no';
			}
		}
		return result;
	}
}

function antiDirection(direction) {
	switch (direction) {
		case Direction.top:
			return Direction.bottom;
		case Direction.bottom:
			return Direction.top;
		case Direction.right:
			return Direction.left;
		case Direction.left:
			return Direction.right;
	}
}