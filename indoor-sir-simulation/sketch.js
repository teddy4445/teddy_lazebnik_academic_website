// canvas Z-Index
var zIndex = 300;

// simulation view logic
let runStarted = false;
let graph_sample;

// global instance of the simultor 
let sim; 

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup()
{
	// TODO: create the simulation
	sim = Simulator();
	
	// TODO: create the canvas
	
	// do not run as we need the data from the user
	noLoop();
}

// start the simulations by open the right views and build simulation instance
function startSimulation()
{
	// set new instace of the simulation
	sim.startSimulation();
	
	// set the simulation paramters in the right place
	graph_sample = parseInt(document.getElementById("graph_samples").value);
	frameRate(fps);
	
	// hide and show the views for the user					
	document.getElementById("init_form").style.display = "none"; // close the init form
	document.getElementById("main").style.display = ""; // show the main window
	
	// allow to run and start running
	runStarted = true;
	loop();
}

// loop run on the simulation
function draw() 
{
	// do not allow to run the method if the run not started
	if (!runStarted)
	{
		noLoop();
		return;
	}
	
	// perform a simulation step
	sim.step();
	
	// calc graph needed data and update it 
	if (count % graph_sample == 0)
	{
		// add the data needed and update the graphs view
	}	
		
	// if the simulation is over
	if (sim.is_over())
	{
		// close the simulation 
		endSimulation();
	}
}


// technical view operations to close the simulation view, clean memory and download results
function endSimulation()
{	
	// TODO: reset the simultor instance and download the results
	
	
	// hide and show the views for the user					
	document.getElementById("main").style.display = "none"; // close the main window
	document.getElementById("init_form").style.display = ""; // show the init form
	
	// allow to run and start running
	runStarted = false;
	noLoop();
}

/* HELP FUNCTIONS */

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

/* END - HELP FUNCTIONS */