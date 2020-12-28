// canvas Z-Index
var zIndex = 300;
var canvasHeight = 600;
var canvasWidth = 1200;
var NOT_CHOSEN = -1;

/* TIME CONSTS */
var HOUR = 60;
var DAY = HOUR * 24;

// simulation view logic
let runStarted = false;
let showDraw = true;
let graph_sample;
let uploadJsonContent;

// global instance of the simultor 
let sim; 
let locationInfoToShow = 0; 

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup()
{
	// create canvas
	var simCanvas = createCanvas(canvasWidth, canvasHeight);
    simCanvas.parent("simCanvas");
	
	// crease the simulator instance (without data yet)
	sim = new Simulator();
	
	// do not run as we need the data from the user
	noLoop();
	
	// global viszuale settings //
	// text location in the center - easier to use later
	textAlign(CENTER);
}

// start the simulations by open the right views and build simulation instance
function startSimulation()
{
	// set new instace of the simulation
	try
	{
		sim.startSimulation();	
		// pick the first node to show the data
		locationInfoToShow = sim.indoor.nodes[0].id;
	}
	catch (error)
	{
		alert(error);
		return false;
	}
	
	// set the simulation paramters in the right place
	graph_sample = sim.limitFix(parseInt(document.getElementById("graph_samples").value), 0, 96);
	frameRate(sim.limitFix(parseInt(document.getElementById("fps").value), 0, 48));
	
	// hide and show the views for the user					
	document.getElementById("init_form").style.display = "none"; // close the init form
	document.getElementById("main").style.display = ""; // show the main window
	
	// scroll to top
	window.scrollTo({ top: 0, behavior: `smooth` });
	
	// allow to run and start running
	runStarted = true;
	loop();
	
	// prevent the form to send something and by that break the page
	return false;
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
	
	// print the indoor with the population distrebution inside
	if (showDraw)
	{
		background("#eeeeee");
		sim.printIndoor();
		showDraw = false;
	}
	sim.print(locationInfoToShow);
	
	// calc graph needed data and update it 
	if (sim.time % (graph_sample * HOUR) == 0)
	{
		// add the data needed
		sim.updateStatesGraphData();
		
		// update the distrebution graph view
		drawAll();
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
	// download results
	downloadasTextFile("pandemic_indoor_simulation.json", sim.toJson());
	
	// clear large members 
	sim.clear();
	
	// hide and show the views for the user					
	document.getElementById("main").style.display = "none"; // close the main window
	document.getElementById("init_form").style.display = ""; // show the init form
	
	// allow to run and start running
	runStarted = false;
	showDraw = true;
	noLoop();
}

/* VIZUAL FUNCTIONS */

/* on click of mouse change the view  */
function mouseClicked() 
{
	var nowMouseX = mouseX;
	var nowMouseY = mouseY;
	
	// if click outside the panel, ignore it
	if (nowMouseX > canvasWidth || nowMouseX < 0 || nowMouseY > canvasHeight || nowMouseY < 0)
	{
		return NOT_CHOSEN;
	}
	
	let newLocation = clickOnNextPossibleLocation(nowMouseX, nowMouseY);
	if (newLocation != NOT_CHOSEN)
	{
		locationInfoToShow = newLocation;
	}
}

/* checkc if the mouse on\clicked in next to some node's center */
function clickOnNextPossibleLocation(checkX, checkY)
{
	// NOTE: can be improved by checking if the click is inside each polygon but this will require more computations
	
	var winNode = NOT_CHOSEN;
	var minDist = 100; // operates as trashold for the first one
	// find the closest node to the click
	for (var i = 0; i < sim.indoor.nodes.length; i++)
	{
		var newDist = dist(checkX, checkY, sim.indoor.nodes[i].center.x, sim.indoor.nodes[i].center.y);
		if (newDist < minDist)
		{
			winNode = sim.indoor.nodes[i].id;
			minDist = newDist;
		}
	}
	return winNode;
}

/* END - VIZUAL FUNCTIONS */

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

/* an event listener for the upload file input */
window.addEventListener('load', function() {
  var upload = document.getElementById('data_json_file_input');
  
  // Make sure the DOM element exists
  if (upload) 
  {
    upload.addEventListener('change', function() {
      // Make sure a file was selected
      if (upload.files.length > 0) 
      {
        var reader = new FileReader(); // File reader to read the file 
        
        // This event listener will happen when the reader has read the file
        reader.addEventListener('load', function() {
          uploadJsonContent = JSON.parse(reader.result); // Parse the result into an object 
        });
        
        reader.readAsText(upload.files[0]); // Read the uploaded file
      }
    });
  }
});

/* END - HELP FUNCTIONS */