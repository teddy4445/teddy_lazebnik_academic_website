// canvas Z-Index
var zIndex = 300;
var population;
var populationSize = 50;
// Each rocket is alive till the end of lifespan frames
var lifespan;
// Made to display count on screen of how many won from the population
var howManyWon = 0;
var howManyCrashed = 0;
// Keeps track of frames
var count = 0;
// Where rockets are trying to go
var target;
// Max force applied to rocket
var maxforce = 0.2;
// rockets start location
var startX;
var startY;
var startZ;

// after stop - tell if need to stop again
var isGameWon;
var winPercent = 50;

// control targets size
var targetSize = 16;
// control simulation rate
var frameRateExelurator = 1;
var frameRateExeluratorMax = 4;

// data for the chart
var chartDataScore = [[0,0,0]];
var chartDataAvgDis = [[0,0]];
var chartDataCenterMass = [];
var chartDataCenterMassVar = [];
var generation = 1;
var env;

var graphRate = 50; // the rate to present the real time graph

// barriers
var obsticleManager;
// targets
var targetsManager;
// camara manager
var easycam;

// --- DOM ACTIONS --- //
var pauseBtn;
var playBtn;
// --- END DOM ACTIONS --- //

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup() {
  var widthElement = document.getElementById('game-holder').getBoundingClientRect().width;
  var cnv = createCanvas(widthElement , widthElement / 2, WEBGL);
  cnv.parent('game');
  lifespan = Math.floor(Math.sqrt(cnv.width * cnv.width + cnv.height * cnv.height));
  // set the rockets start location
  startX = width / 2;
  startY = height / 2;
  startZ = zIndex - 20;
  // is game won
  isGameWon = false;
  env = 1;
  // set the rockets group
  population = new Population(populationSize);
  // build blocks
  obsticleManager = new ObsticleManager();
  // add blocks
  buildObsticlas(false);
  buildWalls();
  // build targets
  targetsManager = new TargetsManager();
  // add targets 
  buildTargets(false);
  // build camara 
  easycam = createEasyCam({distance:zIndex, center:[width/2,height/2,zIndex/2]});
  document.oncontextmenu = function() { return false; }
  document.onmousedown   = function() { return false; }
  // draw ongoing charts 
  drawCharts(); 
}

// loop run on the simulation
function draw() {
  background(20);
  // make a step on all the rockets
  population.run(count, frameRateExelurator, obsticleManager, targetsManager);
  // Displays count to window
  document.getElementById("game-stats").innerHTML = "Env = " + env + " | " + "Generation = " + generation + " | step: " + count + " / " + lifespan;
  document.getElementById("game-wins").innerHTML = "Won: " + howManyWon + " and Crashed: " + howManyCrashed + ", From: " + population.popsize;

  // Renders barrier for rockets
  obsticleManager.show();
  // Renders target
  targetsManager.show();
  
  // set the next frame count 
  count += frameRateExelurator;
  
  // if we get to the end of the generation
  if (count >= lifespan || population.popsizeLive == 0) {
    population.evaluate(targetsManager);
    population.selection();
	howWellAvg = population.howWell;
	// draw the chart to see how well we done
	chartDataScore.push([generation, howManyWon, howManyCrashed]);
	chartDataAvgDis.push([generation++, howWellAvg]);
	drawCharts();
	
	// check if there is conversion to the wanted results
	if(((howManyWon * 100)/population.popsize) > winPercent)
	{
		// win enoght -> change the env 
		env++;
		buildTargets(true);
		buildObsticlas(true);
	}
	
	// zero back all the hiper parameters 
    count = 0;
	howManyWon = 0;
	howManyCrashed = 0;
	chartDataCenterMass = [];
	chartDataCenterMassVar = [];
  }
  // set the zero of the camara to the center of the 3d canvas 
  camera(0, 0, 0, width/2, height/2, zIndex/2);
  
  // if this frame we want to print the real time graph node
  if(count != 0 && count % graphRate < frameRateExelurator)
  {
	  // real time chart data
	  var centerMass = population.centerMass();
	  var centerMassVar = population.variance(centerMass);
	  
	  // add the data to the chart Data Stracture (array)
	  chartDataCenterMass.push([count, targetsManager.meanAvgDis(centerMass[0], centerMass[1], centerMass[2])]);
	  // draw
	  drawChartCenterMassRealTime(chartDataCenterMass);
	  
	  // add the data to the chart Data Stracture (array)
	  chartDataCenterMassVar.push([count, centerMassVar]);
	  // draw
	  drawChartCenterMassRealTimeVar(chartDataCenterMassVar);
  }
}