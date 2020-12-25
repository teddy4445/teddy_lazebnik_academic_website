// canvas Z-Index
var zIndex = 300;
var canvasHeight = 400;
var canvasWidth = 400;

/* TIME CONSTS */
var HOUR = 60;
var DAY = HOUR * 24;

// simulation view logic
let runStarted = false;
let graph_sample;
let uploadJsonContent;

// global instance of the simultor 
let sim; 

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup()
{
	// create canvas
	var simCanvas = createCanvas(canvasHeight, canvasWidth);
    simCanvas.parent("simCanvas");
	
	// crease the simulator instance (without data yet)
	sim = new Simulator(canvasHeight, canvasWidth);
	
	// do not run as we need the data from the user
	noLoop();
}

// start the simulations by open the right views and build simulation instance
function startSimulation()
{
	// set new instace of the simulation
	try
	{
		sim.startSimulation();	
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
	background("#cccccc");
	sim.print();
	
	// calc graph needed data and update it 
	if (sim.time % (graph_sample * HOUR) == 0)
	{
		// add the data needed
		sim.updateStatesGraphData();
		
		// update the graphs view
		drawStateDistrebution();
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