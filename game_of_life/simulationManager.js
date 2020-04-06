// present the canvas as full screen
function fullScreen()
{
	var fs = fullscreen();
    fullscreen(!fs);
}

// what happends to the canvas on window re-size 
// the canvas change size accordangly
function windowResized() {
  widthElement = document.getElementById('game-holder').getBoundingClientRect().width;
  resizeCanvas(widthElement, widthElement);
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

// start the simulation and show it, hide the form 
function startSimulation(needToShow)
{
	showGraphic = needToShow;
	
	var startK = parseInt(document.getElementById("k_value_start").value);
	var endK = parseInt(document.getElementById("k_value_end").value);
	var startP = parseInt(document.getElementById("p_value_start").value);
	var stepP = parseInt(document.getElementById("p_value_step").value);
	var timesP = parseInt(document.getElementById("p_value_times").value);
	var popSizeStart = parseInt(document.getElementById("pop_size_start").value);
	var popSizeStep = parseInt(document.getElementById("pop_size_step").value);
	var repeatCount = parseInt(document.getElementById("repeat_count").value);
	var fps = parseInt(document.getElementById("fps").value);
	var gridSizeNew = parseInt(document.getElementById("grid_size").value);
	var delayMean = parseInt(document.getElementById("delay_mean").value);
	var delaySpread = parseInt(document.getElementById("delay_spread").value);
	var recoverChance = parseInt(document.getElementById("recover_chance").value);
	var initInfected = parseInt(document.getElementById("init_infected").value);
	var l_value = parseInt(document.getElementById("l_value").value);
	
	if (l_value < 1)
	{
		l_value = 1;
	}
	if (l_value > 50)
	{
		l_value = 50;
	}
	Lvalue = l_value;
	
	if (delayMean < 2)
	{
		delayMean = 2;
	}
	//if (delayMean > 100)
	//{
		//delayMean = 100;
	//}
	deadRecoverDelayMean = delayMean;
	
	if (delaySpread < 0)
	{
		delaySpread = 0;
	}
	if (delaySpread > delayMean)
	{
		delaySpread = 100;
	}
	deadRecoverDelaySpread = delaySpread;
	
	if (recoverChance < 0)
	{
		recoverChance = 0;
	}
	if (recoverChance > 100)
	{
		recoverChance = 100;
	}
	deadRecoverChance = (1 - recoverChance  / 100);
	
	
	
	if (startK < 0)
	{
		startK = 0;
	}
	if (startK > 7)
	{
		startK = 7;
	}
	if (endK < 1)
	{
		endK = 1;
	}
	if (endK > 8)
	{
		endK = 8;
	}
	
	if (k_value < k_value_end)
	{
		k_value = startK;
		k_value_end = endK;
	}
	else
	{
		k_value = endK;
		k_value_end = startK;
	}
	
	if (startP < 1)
	{
		startP = 1;
	}
	if (startP > 100)
	{
		startP = 100;
	}
	p_value = startP / 100;
	p_value_original = p_value;
	
	if (stepP < 1)
	{
		stepP = 1;
	}
	if (stepP > 99)
	{
		stepP = 99;
	}
	p_value_delta = stepP / 100;
	
	if (timesP < 2)
	{
		timesP = 2;
	}
	if (timesP > 10)
	{
		timesP = 10;
	}
	repeatTimesDone = timesP;
	
	if (popSizeStart < 10)
	{
		popSizeStart = 10;
	}
	if (popSizeStart > 1000)
	{
		popSizeStart = 1000;
	}
	populationSize = popSizeStart;
	populationSizeOriginal = populationSize;
	
	if (initInfected < 1)
	{
		initInfected = 1;
	}
	if (initInfected >= popSizeStart)
	{
		initInfected = popSizeStart - 1;
	}
	initialInfectedCount = initInfected;
	
	if (popSizeStep < 10)
	{
		popSizeStep = 10;
	}
	if (popSizeStep > 1000)
	{
		popSizeStep = 1000;
	}
	populationSizeDelta = popSizeStep;
	
	if (repeatCount < 2)
	{
		repeatCount = 2;
	}
	if (repeatCount > 20)
	{
		repeatCount = 20;
	}
	repeatTimes = repeatCount;
	
	if (gridSizeNew < 0)
	{
		gridSizeNew = 10;
	}
	if (gridSizeNew > 250)
	{
		gridSizeNew = 250;
	}
	gridSize = gridSizeNew;
	
	document.getElementById("main").style.display = ""; // show the main window
	if (!showGraphic)
	{
		document.getElementById("game").style.display = "none"; // if we don't have canvas, don't show it 
		document.getElementById("fullScreenBtn").style.display = "none"; // no need in full screen button
	}
	document.getElementById("init_form").style.display = "none"; // close the init form
	windowResized(); // just to make the game window pop again
	
	// set the wanted frame rate
	if (fps < 0)
	{
		fps = 1;
	}
	if (fps > 60)
	{
		fps = 60;
	}
	frameRate(fps);
	
	// wait a second before starting - just for dramatic effect 
	// let the run start and the draw funtion working
	setTimeout(() => { runStarted = true; loop(); }, 1000);
	
	// build the grid and the population and allocate to the grid
	initGrid();
	population = new Population(populationSize, grid, initialInfectedCount);
	// draw ongoing charts 
	if (showGraphic)
	{
		drawCharts(); 
		drawGrid();
	}
	
	// prevent the form to send something and by that break the page
	return false;
}