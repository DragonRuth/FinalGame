

window.onload = function () {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
			try {
				tizen.power.release("SCREEN");

			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
	});
    //Calling Pop Up Menu
    var mainPage = document.querySelector('#main');

    mainPage.addEventListener("click", function() {
    	
    	  tau.openPopup("#btnPopup")
    	  if (!isinmenu) {
    		  isinmenu = true;
    	  }
       
   });
    //Allow the screen to be on permanently
    tizen.power.request('SCREEN', 'SCREEN_DIM');
    
    getHighScore();

    //TODO:: go to settings to check
    
    alert("This application \n requares  you to \n turn off the \n 'Wake Up' gesture  \n function");
   // var f = new Field ([5, 5], 0, 15);
  
    
   // drawBall();
    
   
	 w = window.innerWidth + 50;
     h = window.innerHeight + 50;
     
 
		
	window.addEventListener("devicemotion", function(event) 
		{
			ball.velocity.y =  Math.round(event.accelerationIncludingGravity.y - event.acceleration.y); 
			ball.velocity.x = (-1) * Math.round(event.accelerationIncludingGravity.x - event.acceleration.x);
			 // document.getElementById("x").innerHTML= ball.velocity.x;
			//  document.getElementById("y").innerHTML= ball.velocity.y;
			  
			//Code from sample with gravity control - might need it later	
			
	/*		noGravitation = dataEvent.acceleration;
			dataEvent = dataEvent.accelerationIncludingGravity;

			xDiff = dataEvent.x - noGravitation.x;
			if (Math.abs(xDiff) > MAX_G) 
			{
			   xDiff = xDiff / Math.abs(xDiff) * MAX_G;
			}
			yDiff = -1 * (dataEvent.y - noGravitation.y);
			if (Math.abs(yDiff) > MAX_G) 
			{
			   yDiff = yDiff / Math.abs(yDiff) * MAX_G;
			}

			xPos = (outerRadius - ballRadius) * xDiff / MAX_G;
			yPos = (outerRadius - ballRadius) * yDiff / MAX_G;

			ball.style.left = centerX - ballRadius + xPos + "px";
			ball.style.top = centerY - ballRadius + yPos + "px";   */
			
        }
                               );
    
		init();
	

    
};
//end of window onload
var canvas;
var sphere;
var camera;
var isdead = false;
var isinmenu = false;
var isnewlevel = false;
var alpha=0;
var speed = 6;
var wallSize = 5;
var wallWidth =  2;
var ballSize = 5;
var pointSize = 2;
var trapSize = 3;
var finSize = 2;
var groundSize = 124;
var heigth = 4;
var wallindex=0;
var placer = new Placer(groundSize, groundSize);

var trapsNum = 6;

canvas=document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas, true);
//var ctx;
//var MAX_G = 9.8; - for later
var ball = {
		position : {x:0,y:0},
		velocity : {x:0,y:0}};

var w;
var h;


function init() {
	
	  placer.setField(new Field([10, 10], 30));
	  placer.Operate(10, trapsNum, [5, 5]);
	  placer.countBlockSize(setSizes, 3, 5); 
	
	  

	  isdead = false;
	  isnewlevel = false;
	  document.getElementById("state").innerHTML= "";
	  var scene = createScene();
	  engine.runRenderLoop(function () {
		    scene.render();
		    if (!isinmenu) {
		    	sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(ball.velocity.y * speed, 0, ball.velocity.x * speed));
		    } else {
		    	sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
		    }
		    camera.alpha = alpha;
		    if (isdead) {
		    	GameOver();
		    	trapsNum = 6;
		    	Restart();
		    }
		    if (isnewlevel){
		    	if (trapsNum < 15)
		    		trapsNum += 2;
		    	Restart();
		    }
		  });
	  
	 
	  
}

function setSizes(long, widthB, heigth, stepHall) {
	wallSize = long;
	wallWidth =  widthB;
	ballSize = stepHall * 0.4;
	console.log("ball " + ballSize);
	pointSize = stepHall * 0.2;
	console.log("pointSize " + pointSize);
	trapSize = stepHall * 0.6;
	console.log("trapSize " + trapSize);
	finSize = stepHall * 0.4;
	console.log("trapSize " + trapSize);
	heigth = stepHall * 2;
}

var createScene = function () {
	
    // Now create a basic Babylon Scene object 
    var scene = new BABYLON.Scene(engine);
    
    
    //enable physics
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.OimoJSPlugin());
    // This creates and positions a camera (non-mesh)
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.5, 50, BABYLON.Vector3.Zero(), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

   

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.5;
  

    // create game-instances to copy from.
    
    
   
     var cube = BABYLON.Mesh.CreateBox("wall",1,scene);
     var octahedron = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: 1, size: pointSize }, scene);
   
     var fireball =  BABYLON.Mesh.CreateSphere("sphere2",16, trapSize, scene);
     //do not alter - objects under the scene
     cube.position.addInPlace(new BABYLON.Vector3(-1, -5, -4));
     octahedron.position.addInPlace(new BABYLON.Vector3(-10, -4, -5));
     fireball.position.addInPlace(new BABYLON.Vector3(-20, -4, -5));

     cube.isVisible = true;
     octahedron.isVisible = true;
     fireball.isVisible = true;
     
     
     
     //ball
     sphere = BABYLON.Mesh.CreateSphere("sphere1",16, ballSize, scene);
     function placeBall(x,y){
     sphere.position = new BABYLON.Vector3(x, 1, y)
     }
     
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", groundSize, groundSize, 2, scene);
	
	//camera follows ball
	camera.lockedTarget = sphere;
    scene.activeCamera = camera;
    
    //phycics
    //cube.physicsImpostor = new  BABYLON.PhysicsImpostor(cube,BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
	sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
	
	//textures
	var materialGround = new BABYLON.StandardMaterial("floor1", scene);
	var materialWall = new BABYLON.StandardMaterial("wall1", scene);
	var materialBall = new BABYLON.StandardMaterial("ball1", scene);
	var materialPoint = new BABYLON.StandardMaterial("point1", scene);
	var materialFireBall = new BABYLON.StandardMaterial("fire1", scene);
	var materialFinisher = new BABYLON.StandardMaterial("fin1", scene);
	materialGround.diffuseTexture = new BABYLON.Texture("images/floor_big.jpg", scene);
	materialWall.diffuseTexture = new BABYLON.Texture("images/wall2.jpg", scene);
	materialBall.diffuseTexture = new BABYLON.Texture("images/ball.jpg", scene);
	materialPoint.diffuseTexture = new BABYLON.Texture("images/point.jpg", scene);
	materialFireBall.diffuseTexture = new BABYLON.Texture("images/fire.jpg", scene);
	materialFinisher.diffuseTexture = new BABYLON.Texture("images/point.jpg", scene);
	ground.material = materialGround;
	sphere.material = materialBall;
	cube.material = materialWall;
	octahedron.material = materialPoint;
	fireball.material = materialFireBall;
	
	
	//inner light
    var light0 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(1, 1, 1), scene);
    //light0.diffuse = new BABYLON.Color3(0, 1, 0);
    light0.specular = new BABYLON.Color3(1, 1, 1);		
    light0.parent = octahedron;
    light0.intensity = 0.3; 
	
    
   //animate point
  //  var animationBox = new BABYLON.Animation("myAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

    
 
   // var animationBox1 = new BABYLON.Animation("myAnimation1", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = []; 

  //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: 0
    });

    //At the animation key 20, the value of scaling is "0.2"
    keys.push({
      frame: 50,
      value: 1
    });

    var keys1 = []; 

    //At the animation key 0, the value of scaling is "1"
   keys1.push({
     frame: 0,
        value: 1
      });

      //At the animation key 20, the value of scaling is "0.2"
      keys1.push({
        frame: 100,
        value: -8
      }); 

     keys1.push({
        frame: 200,
        value: 1
      }); 
      

      
   
  //  animationBox1.setKeys(keys1);
    

  //  fireball.animations = [];
   // fireball.animations.push(animationBox1);
   // scene.beginAnimation( fireball, 0, 200, true);
 //   octahedron.animations = [];
 //   octahedron.animations.push(animationBox);
 //   scene.beginAnimation( octahedron, 0, 100, true);
    
    
    var POINTS = [];
    var TRAPS = [];
    //should begin animation for every clone separatly
    function SpawnPoint(x,y){

    	var newpoint = octahedron.createInstance("index: " + POINTS.length + 1); 
    	newpoint.position = new BABYLON.Vector3(x, 2, y);
   	 
   	 
    	var lightclone = light0.clone("index: " + POINTS.length + 1);
    	lightclone.diffuse = new BABYLON.Color3(0, 1, 0);
    	lightclone.parent = newpoint;
   	 
   	 
    	var animationBox = new BABYLON.Animation("myAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    	animationBox.setKeys(keys);
    	newpoint.animations = [];
    	newpoint.animations.push(animationBox);
    	scene.beginAnimation( newpoint, 0, 100, true);
    	
    	
    	newpoint.actionManager = new BABYLON.ActionManager(scene);
    	newpoint.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    	        { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter:{ mesh:sphere, usePreciseIntersection: true} }, function(evt)
    	        {
    	        	console.log(score);
    	        	score++;
    	        	document.getElementById("current_score").innerHTML="Score: "+ score;

    	        //	POINTS.splice(evt.source.id,1);
    	        	evt.source.isKilled = true;
    	        	
    	        }));
    	
    	
    	newpoint.id = POINTS.length;
    	//console.log(newpoint.id);
    	POINTS.push(newpoint);
   		
   }

    
    

    function SpawnTrap(x,y){
    	
      	 var newtrap = fireball.createInstance("index: " +  TRAPS.length + 1); 
      	 newtrap.position = new BABYLON.Vector3(x, 2, y);
      	
      	
      	var lightclone = light0.clone("index: " + TRAPS.length + 1);
    	lightclone.parent = newtrap;
    	lightclone.diffuse = new BABYLON.Color3(1, 0, 0);
      	 
      	 var animationBox1 = new BABYLON.Animation("myAnimation1", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      	 animationBox1.setKeys(keys1);
      	 newtrap.animations = [];
      	 newtrap.animations.push(animationBox1);
      	 scene.beginAnimation( newtrap, 0, 200, true);
      	 
      	 
      	 
     	 newtrap.actionManager = new BABYLON.ActionManager(scene);
    	 newtrap.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    	        { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter:{ mesh:sphere, usePreciseIntersection: true} } , function(){
    	        	
    	        	
    	        	if (!isdead) {
    	        	isdead = true;
    	        	document.getElementById("state").innerHTML= "You died!";
    	        	document.getElementById("bottomBtn").innerHTML= "New Game";
    	        	tau.openPopup("#btnPopup");
    	        	isinmenu = true;
    	        	
    	        	
    	        	//score = 0;
    	        	//Restart();
    	        	}
    	
    	        }));
      	 
      	 
      	 newtrap.id = TRAPS.length;
      	 TRAPS.push(newtrap);
   		
    }
    
    function  SpawnFinisher(x,y){

    	var finisher = BABYLON.MeshBuilder.CreatePolyhedron("fin", {type: 1, size: finSize }, scene);
    	finisher.position = new BABYLON.Vector3(x, 2, y);
    	materialFinisher.diffuseColor = new BABYLON.Color3(0, 0.2, 0.8);
    	finisher.material = materialFinisher;
    	
   	 
    	var lightclone = light0.clone("fin ");
    	lightclone.diffuse = new BABYLON.Color3(0, 0, 1);
    	lightclone.parent = finisher;
   	 
   	 
    	var animationBox = new BABYLON.Animation("myAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    	animationBox.setKeys(keys);
    	finisher.animations = [];
    	finisher.animations.push(animationBox);
    	scene.beginAnimation( finisher, 0, 100, true);
    	
    	
    	finisher.actionManager = new BABYLON.ActionManager(scene);
    	finisher.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    	        { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter:{ mesh:sphere, usePreciseIntersection: true} }, function(evt)
    	        {
    	        	console.log(score);
    	        	score += 10;
    	        	document.getElementById("current_score").innerHTML="Score: "+ score;

    	        //	POINTS.splice(evt.source.id,1);
    	        	isnewlevel = true;
    	        	
    	        }));
    }
    
    
    function  PlaceVertWall(x,y){
   	  var newInstance = cube.clone("index: " + wallindex);
   	  wallindex++;
   	  newInstance.position.z = y;
   	  newInstance.position.x = x;
   	  newInstance.position.y = 2;
   	  newInstance.scaling.z = wallWidth;
   	  newInstance.scaling.x = wallSize;
   	  newInstance.scaling.y = heigth;
      newInstance.physicsImpostor = new  BABYLON.PhysicsImpostor(newInstance,BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
   	  
     // newInstance.rotation.x = Math.PI/4;
      
   }
   
   function PlaceHorWall(x,y){
    	var newInstance = cube.clone("index: " + wallindex);
    	wallindex++;
        newInstance.position.z = y;
        newInstance.position.x = x;
        newInstance.position.y = 2;
        newInstance.scaling.x = wallWidth;
     	newInstance.scaling.z = wallSize;
     	newInstance.scaling.y = heigth;
     	newInstance.physicsImpostor = new  BABYLON.PhysicsImpostor(newInstance,BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
   } 

    
    
 //   //cloning point for test
    
    
    //TEST SPAWNS
    
    //	PlaceHorWall(5, 5);
    	// PlaceVertWall(-5,-5);
    //SpawnPoint(new BABYLON.Vector3(5, 2, -2));
  //  SpawnPoint(new BABYLON.Vector3(30, 2,30));
   // SpawnPoint(new BABYLON.Vector3(5, 2, (Math.random() * 5)));
//    SpawnTrap(new BABYLON.Vector3(5, 2, -2));
   // SpawnTrap(new BABYLON.Vector3(-8, 2, 5));

   // SpawnFinisher(new BABYLON.Vector3(-8, 2, 6) );
    
    
 
    
   
    
	// wall copies
   // for (var i= 0; i<  Math.round((Math.random() * 10))+1; ++i) {  
   //  var newInstance = cube.clone("index: " + i);
 //  newInstance.position.z =+ i*2;
 
  //  console.log(ball.velocity.x);
  //  console.log(ball.velocity.y);
	//sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(ball.velocity.x, 0, ball.velocity.y));
  //  scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(ball.velocity.x, 0, ball.velocity.y));
    // Leave this function
    
   placer.create3DField(PlaceHorWall, PlaceVertWall);
   placer.placeContent(SpawnPoint, SpawnTrap, SpawnFinisher, placeBall);	 
   
    scene.registerBeforeRender(function () {
    	 for (var i=0; i<POINTS.length; i++) {
    	        if (POINTS[i].isKilled) {
    	            var p = POINTS[i];
    	            // Destroy the clone !
    	            console.log("hi!");
    	            p.dispose();
    	            POINTS.splice(i, 1);
    	            i--;
    	        }
    	    }
    	
  
    }); 
    
   
    
    return scene;

  };  // End of createScene function



document.getElementById("current_score").innerHTML= score;

/* function drawBall(x,y){
	ctx.beginPath();
	ctx.arc(x,y,20,0,2*Math.PI);
	ctx.fillStyle = "#ffffff";
	ctx.fill();	
	ctx.stroke();
} */

//Animation
/* if ( !window.requestAnimationFrame ) {
	 
    window.requestAnimationFrame = ( function() {
 
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */   /* callback, */  /* DOMElement Element */ /* element ) {
 
            window.setTimeout( callback, 1000 / 60 );
 
        };
 
    } )();
 
} */

 
/* function update()
{
	
		ctx.clearRect(0,0,460,460);
	
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;
        
        //Check if ball out of screen like screen is square - won't need it later
        
        if(ball.position.x > (w-50) && ball.velocity.x > 0)
			{
			   ball.position.x = w-50;
			}
			
			if(ball.position.x < 0 && ball.velocity.x < 0)
			{
				ball.position.x = 0;
			}
			
			if(ball.position.y > (h-50) && ball.velocity.y > 0)
			{
			   ball.position.y = h-50;
			}
			
			if(ball.position.y < 0 && ball.velocity.y < 0)
			{
			   ball.position.y = 0;
			}
			
			
			drawBall(ball.position.x, ball.position.y );
    
    requestAnimationFrame( update );//KEEP ANIMATING
} */



var engine = new BABYLON.Engine(canvas, true);

  
  



function Restart()
{
	console.log("Restart time");
	
	engine.stopRenderLoop();
	engine.clear(BABYLON.Color3.Black(),false,false);
	if (engine.scenes.length!==0) { 
		//if more than 1 scene,
		while(engine.scenes.length>0) {    engine.scenes[0].dispose();}
	}
	init();
}


function GameOver(){
	SaveToBase(score);
	
	document.getElementById("state").innerHTML= "you died";
	document.getElementById("bottomBtn").innerHTML= "New Game";
	document.getElementById("current_score").innerHTML="Score: " + score;
	score = 0;
} 

//Rotary imput template

/* Register the rotary event */
document.addEventListener('rotarydetent', function(e) {
    if (e.detail.direction === 'CW') {
        /* Right direction */
    	 alpha += 0.2;
       
    } else if (e.detail.direction === 'CCW') {
        /* Left direction */
    	alpha -= 0.2;
        
    }
   // document.getElementById("rotarydata").innerHTML= value;
});


function backFromMenu() {
	isinmenu = false;
	  if (!isdead){ //i.e player was dead
		  document.getElementById("state").innerHTML= "game";
		  document.getElementById("bottomBtn").innerHTML= "Resume";
		  document.getElementById("current_score").innerHTML="Score: " + score;
	  }
}