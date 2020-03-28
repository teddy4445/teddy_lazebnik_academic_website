// present the canvas as full screen
function fullScreen()
{
	var fs = fullscreen();
    fullscreen(!fs);
}

//  this function add the targets to the target manager 
function buildTargets(isClear)
{
	targetsManager.add(new Target(width/2 , height/2 , 50 , targetSize, targetSize, targetSize));
	if(isClear)
	{
		targetsManager.clear(1);	
	}
}

//  this function just update the targets sizes 
function updateTargetSize()
{
	for(var targetIndex = 0; targetIndex < targetsManager.targetsSize; targetIndex++)
	{
		targetsManager.targets[targetIndex].r = targetSize;
	}
}

//  this function add the blockes to the Obsticle Manager 
function buildObsticlas(isClear)
{
	obsticleManager.addBlock(new Block(width/2 , height/2 , zIndex/2 , 50  + 20 * env, 50 + 20 * env,20, "box"));	
	if(isClear)
	{
		obsticleManager.clear(1);
	}
}


//  this function add the blockes that will be the walls of the simulation to the Obsticle Manager 
function buildWalls()
{
	// 2 sides
	obsticleManager.addWall(new Block(width/2, height/2, 0, width,height,1, "box"));	
	obsticleManager.addWall(new Block(width/2, height/2, zIndex, width,height,1, "box"));	
	// 2 sides
	obsticleManager.addWall(new Block(width/2, 0, zIndex/2, width,1,zIndex, "box"));	
	obsticleManager.addWall(new Block(width/2, height, zIndex/2, width,1,zIndex, "box"));	
	// 2 sides
	obsticleManager.addWall(new Block(0, height/2, zIndex/2, 1,height,zIndex, "box"));	
	obsticleManager.addWall(new Block(width, height/2, zIndex/2,1,height,zIndex, "box"));	
}


// what happends to the canvas on window re-size 
// the canvas change size accordangly
function windowResized() {
  var widthElement = document.getElementById('game-holder').getBoundingClientRect().width;
  resizeCanvas(widthElement, widthElement/2);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}

// hold the all draw charts commends together 
function drawCharts()
{
	drawChartFinished(chartDataScore);
	drawChartAvgDis(chartDataAvgDis);
}

// puase the simulation draw loop and manage the control buttons 
function pauseGame()
{
	noLoop();
	// close and open buttons 
	document.getElementById("pauseBtn").disabled = true;
	document.getElementById("playBtn").disabled = false;
}

// start the simulation draw loop and manage the control buttons 
function playGame()
{
	loop();
	// close and open buttons 
	document.getElementById("playBtn").disabled = true;
	document.getElementById("pauseBtn").disabled = false;
}

// save the DNA of the population
function saveDNA()
{
	var name = "Teddy_Sim_Rockets_ENV_" + env + "_GEN_" + generation + ".json";
	saveJSON(population.saveDNA(), name);
}

// load the DNA of the population and run the game from there 
function loadDNA(fileData) 
{
	var f = fileData.files[0]; 

    if (f) 
	{
      var r = new FileReader();
      r.readAsText(f);
	  r.onload = function(e) 
	  {
		  alert("File " + f.name + " (" + f.size + " bits) has been load");
		  
		  // make the data json we can work with
		  var genesArray = JSON.parse(e.target.result);
		  // clear the rockets we have now
		  population.clearRockets();
		  // add each DNA to rocket and add to the population 
		  for(var genesArrayIndex = 0; genesArrayIndex < genesArray.length; genesArrayIndex++)
		  {
			  console.log(genesArray[genesArrayIndex]);
			  var dna = new DNA(genesArray[genesArrayIndex]);
			  var rocket = new Rocket(dna);
			  population.addRocket(rocket);
		  }
      }
    } 
	else 
	{
		alert("Failed to load file");
    }
  }

// this function reset the population and start the process of next generation from zero
function resetPopulation()
{
	// create population from start 
	population = new Population(populationSize);
	
	// zero back all the meta parameters 
    count = 0;
	howManyWon = 0;
	howManyCrashed = 0;
	generation++;
	chartDataCenterMass = [];
	chartDataCenterMassVar = [];
}

// this function change the rate of the simulation 
function changeFrameRate(isUp)
{
	if(frameRateExelurator <= frameRateExeluratorMax && isUp)
	{
		frameRateExelurator++;
		return true;
	}
	else if(frameRateExelurator > 1 && !isUp)
	{
		frameRateExelurator--;
		return true;
	}
	return false;
}

// change the simulation according to the asked one
function changeSimStart(index)
{
	// start by reset the population
	resetPopulation();
	// clear targets and obsticles
	obsticleManager.clear();
	targetsManager.clear();
	
	if(index == 1)
	{
		obsticleManager.addBlock(new Block(width/2 , height/2 , zIndex/2 , 50  + 20 * env, 50 + 20 * env,20, "box"));
		
		targetsManager.add(new Target(width/2 , height/2 , 50 , targetSize, targetSize, targetSize));
	}
	else if(index == 2)
	{
		obsticleManager.addBlock(new Block(width/2 , height/2 , zIndex/2 - 50, 20 * env,20 * env, 5, "box"));
		obsticleManager.addBlock(new Block(width/4 , height/4 , zIndex/2 - 50 , 100, 100 ,5, "box"));
		obsticleManager.addBlock(new Block(width*3/4 , height*3/4 , zIndex/2 - 50 , 100, 100 ,5, "box"));
		
		targetsManager.add(new Target(width/4 , height/4 , 50 , targetSize, targetSize, targetSize));
		targetsManager.add(new Target(width*3/4 , height*3/4 , 50 , targetSize, targetSize, targetSize));
	}
	else if(index == 3)
	{
		obsticleManager.addBlock(new Block(width/2 , height/2 , zIndex/3 + 50 , 50  + 20 * env, 50 + 20 * env, 5, "box"));
		obsticleManager.addBlock(new Block(width/2 , height/2 , zIndex/3 - 50 , 100, 100 ,5, "box"));
		
		targetsManager.add(new Target(width/2 , height/2 , zIndex/3 , targetSize, targetSize, targetSize));
	}
}