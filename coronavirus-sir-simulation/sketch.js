// canvas Z-Index
var zIndex = 300;
var count = 0;

var population;


// --- DOM ACTIONS --- //
var pauseBtn;
var playBtn;
// --- END DOM ACTIONS --- //

runStarted = false;

// graphs
stateGraphData = []

// transform chances 
let a_a_t_c = 0;
let a_c_t_c = 0;
let c_c_t_c = 0;
let c_a_t_c = 0;

let a_c_meeting_count = 0;
let a_a_meeting_count = 0;
let c_c_meeting_count = 0;


let fps = 6;
let graph_sample = 24;

let infected_to_recover_time = 0;

// location time circle
let TIME_IN_DAY = 24;
let time_at_home = 12;
let time_not_at_home = TIME_IN_DAY - time_at_home;

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup()
{
	// setup for user inputs
	completePercent('susceptible_adults_percent', 'infected_adults_percent', 100);
	completePercent('susceptible_children_percent', 'infected_children_percent', 100);
	completePercent('time_at_home', 'time_not_at_home', 24);

	// setup for simulation
	frameRate(fps);
	noLoop();
}

// loop run on the simulation
function draw() 
{
	if (!runStarted)
	{
		return;
	}
	
	// stats data 
	var stats = population.countStatusDestrebution();
	
	// update stats panel
	document.getElementById("susceptible_text").innerHTML = (stats["a_s"] + stats["c_s"]).toString();
	document.getElementById("infected_text").innerHTML = (stats["a_i"] + stats["c_i"]).toString();
	document.getElementById("recover_text").innerHTML = (stats["a_r"] + stats["c_r"]).toString();
	document.getElementById("clock").innerHTML = stepToClock(count);
	
	// calc graph needed data and update it 
	if (count % graph_sample == 0)
	{
		var graphValues = [count / TIME_IN_DAY];
		Object.keys(stats).forEach(function(key,index) {
			 graphValues.push(stats[key]);
		});
		// fix the data that is not 	
		stateGraphData.push(graphValues);
		drawStateDistrebution();
		
		// if the simulation is over
		if ((stats["a_r"] + stats["c_r"]) == population.members.length)
		{
			downloadasTextFile("corona_sir_two_age_stocasic_graph_data.csv", prepareGraphDataToCSV(stateGraphData));
			population.clear();
			stateGraphData = [];
			count = 1;
			
			alert("Simulation over");
			
			// reset view
			document.getElementById("main").style.display = "none"; // close the init form
			document.getElementById("init_form").style.display = ""; // show the main window
			
			runStarted = false;
		}
	}
	
	// make a step on all the rockets
	population.run(a_a_t_c, a_c_t_c, c_a_t_c, c_c_t_c, infected_to_recover_time, time_at_home);
	
	// Displays stats on the screen
	var age_status_location_dist = population.countStatusLocationDestrebution();
	// run over all the locations
	Object.keys(age_status_location_dist).forEach(function(key,index) {
		document.getElementById(key).innerHTML = age_status_location_dist[key];	
	});

	// set the next frame count 
	count += 1;
	
}

function stepToClock(count)
{
	var days = Math.floor(count / TIME_IN_DAY);
	var hours = count % TIME_IN_DAY;
	return days + " days, " + hours + " hours";
}

function prepareGraphDataToCSV(data)
{
	var answer = "day, adult infected, adult susceptible, adult recover, child infected, child susceptible, child recover\n";
	for (var i = 0; i < data.length; i++)
	{
		for (j = 0; j < data[i].length; j++)
		{
			answer += data[i][j] + ",";
		}
		answer = answer.substring(0, answer.length - 1) + "\n";
	}
	return answer.substring(0, answer.length - 1);
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