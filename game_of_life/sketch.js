// canvas Z-Index
var zIndex = 300;

// game of life grid size
var EMPTY_GRID = -1;
var widthElement;
var gridSize = 10;
var grid = [];
for (var i = 0; i < gridSize; i++)
{
	row = [];
	for (var j = 0; j < gridSize; j++)
	{	
		row.push(EMPTY_GRID);
	}
	grid.push(row);
}

var population;
var populationSize = 10;
var populationSizeOriginal = populationSize;
var populationSizeDelta = 10;
var repeatTimes = 10;

var p_value = 1;
var p_value_original = p_value;
var p_value_delta = 0.1;
var repeatTimesDone = 9;


var initialInfectedCount = 1;
var k_value = 0;
var k_value_end = 8;
var Lvalue = 0;

// Keeps track of frames
var count = 0;
var runTime = 1;

// dead \ recovered factors 
var deadRecoverDelayMean = 2;
var deadRecoverDelaySpread = 0;
var deadRecoverChance = 0.5;

// data for the chart
var stateGraphDate = [[0, populationSize - 1, 1, 0, 0]];
var consensusGraph = [[0, 0]];
var populationSizeAvgConversionPerP = [[0, 0]];
var pValuePopulationVectorGraph = [];
// TODO: add here for more graphs 

// --- DOM ACTIONS --- //
var pauseBtn;
var playBtn;
// --- END DOM ACTIONS --- //

// tell if we need to do prints on just calculate (it makes it faster)
showGraphic = true;
runStarted = false;

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup() {
	// set up the simulator in the page
	widthElement = document.getElementById('game-holder').getBoundingClientRect().width;
	var cnv = createCanvas(widthElement, widthElement);
	cnv.parent('game');
	noLoop();
}

// loop run on the simulation
function draw() 
{
	if (!runStarted)
	{
		return;
	}

  if (showGraphic)
  {
	drawGrid();
  }
  // make a step on all the rockets
  population.run(count);
  
  // Displays stats on the screen
  document.getElementById("k_text").innerHTML = "K = " + k_value;
  document.getElementById("p_text").innerHTML = int(100 * p_value) + "%";
  document.getElementById("populationSize").innerHTML = populationSize;
  document.getElementById("runTime").innerHTML = runTime;
  
  document.getElementById("healthy_text").innerHTML = population.countHealty();
  document.getElementById("infected_text").innerHTML = population.countInfected();
  document.getElementById("dead_text").innerHTML =  population.countDead();
  document.getElementById("recover_text").innerHTML =  population.countRecovered();
  
  
  // set the next frame count 
  count += 1;
  var healthyPeople = population.countHealty();
  
  stateGraphDate.push([count, healthyPeople, population.countInfected(), population.countDead(), population.countRecovered()]);
  if (showGraphic)
  {
	drawStateDistrebution();
  }
  
  // if we get to the end of the generation
  if (healthyPeople == 0 || population.countInfected() == 0) 
  {
	// check if we want to change the population size hyper-parameters
	if (consensusGraph.length == repeatTimes)
	{
		var summer = 0;
		for (var i = 1; i < consensusGraph.length; i++)
		{
			summer += consensusGraph[i][1];
		}
		populationSizeAvgConversionPerP.push([populationSize, summer/repeatTimes]);
		populationSize += populationSizeDelta;
		consensusGraph = [[0, 0]];
		runTime = 0;
		if(showGraphic)
		{
			drawPopulationSizeAvgConversionPerP();	
		}
	}
	else
	{
		consensusGraph.push([runTime, count]);
	}
	
	if(showGraphic)
	{
		drawConsensusGraph();
	}
	
	
	p_underflow = false; // go to next K values if the value of p is less then 0 cause then no chance to finish
	
	// check if we want to change the infection chance hyper-parameters
	if (populationSizeAvgConversionPerP.length == repeatTimesDone + 1)
	{
		var values = [p_value * 100];
		for (var i = 1; i < populationSizeAvgConversionPerP.length; i++)
		{
			values.push(populationSizeAvgConversionPerP[i][1]);
		}
		pValuePopulationVectorGraph.push(values);
		populationSizeAvgConversionPerP = [[0, 0]];
		runTime = 0;
		populationSize = populationSizeOriginal;
		p_value -= p_value_delta;
		if (p_value < 0)
		{
			p_underflow = true;
		}
		
		if(showGraphic)
		{
			drawPopulationSizeAvgConversionPerP();
		}
		drawPValuePopulationVectorGraph();
	}
	
	// check if we run over all the parameter set 
	if (pValuePopulationVectorGraph.length == repeatTimesDone || p_underflow)
	{
		// increase the k-value for next run
		k_value++;
		// prepare the data as string to be downloaded
		var run_data = "p_value,";
		for (var i = 0; i < repeatTimesDone; i++)
		{
			run_data += "population size = " + (populationSizeOriginal + i * populationSizeDelta) + ","
		}
		run_data += "\n";
		for (var i = 0; i < pValuePopulationVectorGraph.length; i++)
		{
			for (var j = 0; j < pValuePopulationVectorGraph[i].length; j++)
			{
				run_data += "" + Math.round(pValuePopulationVectorGraph[i][j]) + ", ";
			}
			run_data += "\n";
		}
		// download the data as a file to the computer
		downloadasTextFile("game_of_life_corona_k_eq_" + (k_value-1), run_data);
		// init back the graph data
		pValuePopulationVectorGraph = [];
		drawPValuePopulationVectorGraph();
		p_value = p_value_original;
		
		if (k_value == k_value_end)
		{
			noLoop();
			alert("Simulation is over");
		}
	}
	
	if (showGraphic)
	{
		drawStateDistrebution();
	}
	initGrid();
	population = new Population(populationSize, grid, initialInfectedCount);
	
	// zero back all the hiper parameters 
    count = 0;
	runTime++;
	stateGraphDate = [[0, populationSize - initialInfectedCount, initialInfectedCount, 0, 0]];
  }
}

// print the grid, just to make things nice to show
function drawGrid()
{
	background(0); // make the canvas black
	var boxSize = widthElement / gridSize;
	// make box's lines white
	fill(255);
	stroke(255);
	// print - lines 
	for (var index = 0; index < gridSize; index++)
	{
		line(0, boxSize * index, height, boxSize * index);
	}
	// print | lines 
	for (var index = 0; index < gridSize; index++)
	{
		line(boxSize * index, 0, boxSize * index, width);
	}
}

// init grid with everywhere empty
function initGrid()
{
	grid = [];
	for (var i = 0; i < gridSize; i++)
	{
		row = [];
		for (var j = 0; j < gridSize; j++)
		{	
			row.push(EMPTY_GRID);
		}
		grid.push(row);
	}
}

// download a .txt file into your computer
function downloadasTextFile(filename, text) 
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);	
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();	
	document.body.removeChild(element);
}