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

class Cell {
	constructor() {
		this.checked = false;
		this.top = false;
		this.bottom = false;
		this.right = false;
		this.left = false;
	}
	
	set Check(input) {
		this.checked = input;
	}
	
	get Check() {
		return this.checked;
	}
	
	get Walls() {
		return {
			top: this.top,
			bottom: this.bottom,
			right: this.right,
			left: this.left
		};
	}
	
	setWall(dir) {
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
		}	
	}
	
	unsetWall(dir) {
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
		}	
	}
}

class Nodes {
	constructor(pos, length) {
		this.direction = Direction.top;
		[this.x, this.y] = pos;
		this.length = length;
		this.notFinised = true;
		this.trace = [];
	}
	
	Finish() {
		this.notFinised = false;
	}
	
	get NotFinished() {
		return this.notFinised;
	}
	
	set Direction(dir) {
		this.direction = dir;
	}
	
	get Direction() {
		return this.direction;
	}
	
	addTrace(pos) {
		this.trace.push(pos);
	}
	
	get Trace() {
		return this.trace;
	}
	
	Move() {
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
	}
	
	get Length() {
		return this.length;
	}
	
	incLength() {
		this.length++;
	}
	
	get Position() {
		return [this.x, this.y];
	}
}

class Field {
	constructor(size, theVictoryLength, nodes) {
		this.field = [];
		for (let i = 0; i < size[0]; i++) {
			let str = [];
			for (let j = 0; j < size[1]; j++) {
				str.push(new Cell());
			}
			this.field.push(str);
		}
		this.nodes = [];
		this.length = theVictoryLength;
		this.variaty = nodes / (size[0] * size[1]);
		console.log("The variaty is: " + this.variaty);
		this.startPoint = [0, 0];
		this.size = [size[0] - 1, size[1] - 1];
		this.checked = 0;
		console.log("The field was created.");
		alert('Well done!');
	}
	
	get Field() {
		return this.field;
	}
	
	get Nodes() {
		return this.nodes;
	}
	
	CreateStartPoint(pos) {
		this.nodes.push(new Nodes(pos, 0));
		this.field[pos[0]][pos[1]].Check = true;
		console.log("The start point was created.");
	}
	
	ThePath() {
		let path = 0;
		let length = this.nodes.length;
		if (length != 0) {
			console.log("node work: " + length);
			for (let i = 0; i < length; i++) {
				var node = this.nodes[i];
				if (node.NotFinished) {
					let pos = node.Position;
					console.log("The position is " + pos);
					let len = node.Length;
					let directions = this.CheckSurround(node);
					let direction = getRandomDirectionBut(directions);
					console.log("The direction is " + direction);
					if (direction === 'no') {
						node.Finish();
						console.log("The node is finished: " + i);
					} else {
						//console.log("The node is under the work: " + i);
						path++;
						node.Direction = direction;
						node.Move();
						this.field[node.Position[0]][node.Position[1]].Check = true;
						this.checked++;
						directions.push(direction);
						let nodeNum = 0;
						let variaty = Math.random();
						while (variaty < this.variaty && nodeNum < (4 - directions.length)) {
							direction = getRandomDirectionBut(directions);
							directions.push(direction);
							let newNode = new Nodes(pos, len);
							newNode.Direction = direction;
							newNode.Move();
							this.field[newNode.Position[0]][newNode.Position[1]].Check = true;
							this.checked++;
							this.nodes.push(newNode);
							let variaty = Math.random();
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
	}
	
	AllPaths() {
		//while (this.ThePath() != 0) {
		while (this.ThePath()) {
			console.log("The path. ");
		}
		console.log("Finished! The number of nodes: " + this.nodes.length);
	}
	
	CheckSurround(node) {
		let result = [];
		let position = node.Position;
		var nodePoint = this.field[position[0]][position[1]];
		let point;
		if (position[0] === 0) {
			result.push(Direction.top);
			nodePoint.setWall(Direction.top);
		} else { 
			point = this.field[position[0] - 1][position[1]];
			if (point.Check) {
				result.push(Direction.top);
				nodePoint.setWall(Direction.top);
			}
		}
		if (position[0] === this.size[0]) {
			result.push(Direction.bottom);
			nodePoint.setWall(Direction.bottom);
		} else { 
			point = this.field[position[0] + 1][position[1]];
			if (point.Check) {
				result.push(Direction.bottom);
				nodePoint.setWall(Direction.bottom);
			}
		}
		if (position[1] === 0) {
			result.push(Direction.left);
			nodePoint.setWall(Direction.left);
		} else { 
			point = this.field[position[0]][position[1]  - 1];
			if (point.Check) {
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
			if (point.Check) {
				result.push(Direction.right);
				nodePoint.setWall(Direction.right);
			}
		}
		nodePoint.unsetWall(antiDirection(node.Direction));
		return result;
	}
	
	BuildWalls(position) {
		var nodePoint = this.field[position[0]][position[1]];
		let point;
		//console.log("BuildWalls " + position);
		
		if (position[0] !== 0 ) {
			point = this.field[position[0] - 1][position[1]];
			if (! point.Check) {
				nodePoint.setWall(Direction.top);
			}
		}
		if (position[1] !== 0) {
			point = this.field[position[0]][position[1]  - 1];
			
			if (! point.Check) {
				nodePoint.setWall(Direction.left);
			}
		}
		
		
		if (position[1] !== this.size[1]) {
			point = this.field[position[0]][position[1] + 1];
			if (! point.Check) {
				nodePoint.setWall(Direction.right);
			}
		}
		
		if (position[0] !== this.size[0]) { 
			point = this.field[position[0] + 1][position[1]];
			if (! point.Check) {
				nodePoint.setWall(Direction.bottom);
			}
		}
	}
		
		CreateFinishPoint() {
			let nodes = this.nodes;
			let length = nodes.length;
			if (length > 0) {
				let victoryNode = nodes[0];
				let len = victoryNode.Length;
				for (let i = 1; i <length; i++) {
					if (nodes[i].Length > len) {
						len = nodes[i].Length;
						victoryNode = nodes[i];
					}
				}
				//let point = this.field[victoryNode.Position[0]][victoryNode.Position[1]];
				//console.log("The pos of v: " + point.Check);
				this.victoryPoint = victoryNode.Position;
				return victoryNode;
			} else {
				console.log("There are no nodes");
				return false;
			}
		}
		
		get FinishPoint() {
			return this.victoryPoint;
		}
		
		CreateContent(numberOfScor, numberOfTrap) {
			let nodes = this.nodes;
			var field = this.field;
			let length = nodes.length - 1;
			this.scorePoints = [];
			this.trapPoints = [];
			if (length > -1) {
				for (let i = 0; i < numberOfScor; i++) {
					let rep = true;
					while (rep) {
						let nodeNumber = Math.round(Math.random() * length);
						let len = Math.round(Math.random() * (nodes[nodeNumber].Trace.length - 1));
						let pos = nodes[nodeNumber].Trace[len];
						var point = field[pos[0]][pos[1]];
						if (point.Check) {
							this.scorePoints.push(pos);
							point.Check = false;
							rep = false;
						}	
					}
				}
				for (let i = 0; i < numberOfTrap; i++) {
					let rep = true;
					while (rep) {
						let nodeNumber = Math.round(Math.random() * length);
						let len = Math.round(Math.random() * (nodes[nodeNumber].Trace.length - 1));
						let pos = nodes[nodeNumber].Trace[len];
						var point = field[pos[0]][pos[1]];
						if (point.Check) {
							this.trapPoints.push(pos);
							point.Check = false;
							rep = false;
						}
					}
				}
			} else {
				console.log("There are no nodes");
				return false;
			}
		}
		
		get ScorePoints() {
			return this.scorePoints;
		}
		
		get TrapPoints() {
			return this.trapPoints;
		}
	
	GetBitMap() {
		let vert = [];
		let hor = [];
		let help = [];
		var field = this.field;
		for (let i = 0; i < this.size[0] + 1; i++) {
			help.push(field[i][0].Walls.left && true);
		}
		vert.push(help);
		help = [];
		for (let i = 0; i < this.size[1]; i++) {
			for (let j = 0; j < this.size[0] + 1; j++) {
				help.push(field[j][i].Walls.right || field[j][i + 1].Walls.left);
			}
			vert.push(help);
			help = [];
		}
		for (let i = 0; i < this.size[0] + 1; i++) {
			help.push(field[i][this.size[1]].Walls.right && true);
		}
		vert.push(help);
		help = [];
		
		
		for (let i = 0; i < this.size[1] + 1; i++) {
			help.push(field[0][i].Walls.top && true);
		}
		hor.push(help);
		help = [];
		for (let i = 0; i < this.size[0]; i++) {
			for (let j = 0; j < this.size[1] + 1; j++) {
				help.push(field[i][j].Walls.bottom || field[i + 1][j].Walls.top);
			}
			hor.push(help);
			help = [];
		}
		for (let i = 0; i < this.size[1] + 1; i++) {
			help.push(field[this.size[0]][i].Walls.bottom && true);
		}
		hor.push(help);
		return [vert, hor];
	}
}

function getRandomDirectionBut(inputs) {
	if (inputs.length === 0) {
		let variaty = Math.random() * 4;
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
		let variaty = Math.random() * 4;
		let result = -1;
		let rep = false;
		if (variaty < 3)
			rep = true;
		while (result < 0) {
			if (variaty > 3) {
				let tr = false;
				for (let i = 0; i < inputs.length; i++)
					if (inputs[i] === Direction.top) {
						tr = true;
						break;
					}
				if (!tr)
					result = Direction.top;
				else
					variaty -= 1;
			} else if (variaty > 2) {
				let tr = false;
				for (let i = 0; i < inputs.length; i++)
					if (inputs[i] === Direction.bottom) {
						tr = true;
						break;
					}
				if (!tr)
					result = Direction.bottom;
				else
					variaty -= 1;
				
			} else if (variaty > 1) {
				let tr = false;
				for (let i = 0; i < inputs.length; i++)
					if (inputs[i] === Direction.right) {
						tr = true;
						break;
					}
				if (!tr)
					result = Direction.right;
				else
					variaty -= 1;
			} else {
				let tr = false;
				for (let i = 0; i < inputs.length; i++) 
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