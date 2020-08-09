// canvas Z-Index
var zIndex = 300;
var count = 0;

var population;


// --- DOM ACTIONS --- //
var pauseBtn;
var playBtn;
// --- END DOM ACTIONS --- //

runStarted = false;
var showFinishAlert = true;

// graphs
stateGraphData = []

// transform chances 
let a_a_t_c = 0;
let a_c_t_c = 0;
let c_c_t_c = 0;
let c_a_t_c = 0;

// meeting in time unit (default - hour)
let a_c_meeting_count = 0;
let a_a_meeting_count = 0;
let c_c_meeting_count = 0;

// recover chaces
let prc = 0;
let pra = 0;

let fps = 6;
let graph_sample = 24;

let infected_to_recover_time_adult = 0;
let infected_to_recover_time_children = 0;

// location time circle
let TIME_IN_DAY = 24;
let time_at_home = 12;
let time_not_at_home = TIME_IN_DAY - time_at_home;

// remember for r_0 calc
let last_stats = null;
let r_zeros = [];
let infected = [];

// vaccine run
var adult_recover;
var child_recover;
var adult_pop_size;
var adult_step_size;
var children_pop_size;
var child_step_size;

let vaccine_data = [];
let vaccine_max_infected_data = [];

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup()
{
	// setup for user inputs
	completePop('susceptible_adults_percent', 'infected_adults_percent', 'recover_adults_percent', 'adult_pop_size');
	completePop('susceptible_children_percent', 'infected_children_percent', 'recover_children_percent', 'children_pop_size');
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
	infected.push(stats["a_i"] + stats["c_i"]);
	document.getElementById("recover_text").innerHTML = (stats["a_r"] + stats["c_r"]).toString();
	document.getElementById("dead_text").innerHTML = (stats["a_d"] + stats["c_d"]).toString();
	document.getElementById("clock").innerHTML = stepToClock(count);
	var r_zero = calcRzero(stats);
	r_zeros.push(r_zero);
	document.getElementById("r_zero").innerHTML = "R<small>0</small> = " + r_zero.toFixed(2) + ", Avg(R<small>0</small>) = " + (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(2) ;
	
	// calc graph needed data and update it 
	if (count % graph_sample == 0)
	{
		var graphValues = [count / TIME_IN_DAY];
		Object.keys(stats).forEach(function(key,index) {
			 graphValues.push(stats[key]);
		});
		// fix the data that is not 	
		stateGraphData.push(graphValues);
		if (showFinishAlert)
		{
			drawStateDistrebution();	
		}
		
		// if the simulation is over
		if ((stats["a_i"] + stats["c_i"]) == 0)
		{
			population.clear();
			count = 1;
			
			if (showFinishAlert)
			{
				downloadasTextFile("corona_sir_two_age_stocasic_graph_data.csv", prepareGraphDataToCSV(stateGraphData));
				alert("Simulation over");	
			
				// reset view
				document.getElementById("main").style.display = "none"; // close the init form
				document.getElementById("init_form").style.display = ""; // show the main window
				
				runStarted = false;
			}
			else
			{
				if (adult_recover <= adult_pop_size)
				{
					if (child_recover <= children_pop_size)
					{
						
						population = new Population(adult_pop_size,
													adult_pop_size - 1 - adult_recover,
													1,
													adult_recover,
													children_pop_size, 
													children_pop_size - 1 - child_recover, 
													1,
													child_recover);
											
						// downloadasTextFile("corona_sir_two_age_stocasic_graph_data___vacine_a_" + adult_recover + "_c_" + child_recover + ".csv", prepareGraphDataToCSV(stateGraphData));
						console.log("Vacine: a = " + adult_recover + ", c = " + child_recover);
						child_recover += child_step_size;
						vaccine_data.push([(adult_recover / parseInt(document.getElementById("adult_pop_size").value)).toFixed(3), 
											(child_recover / parseInt(document.getElementById("children_pop_size").value)).toFixed(3),
											(r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
						vaccine_max_infected_data.push([(adult_recover / parseInt(document.getElementById("adult_pop_size").value)).toFixed(3), 
											(child_recover / parseInt(document.getElementById("children_pop_size").value)).toFixed(3),
											(100 * max(infected) / population.size()).toFixed(3)]);
					}
					else
					{
						child_recover = 0;
						adult_recover += adult_step_size; 
					}
				}
				else
				{
					// download results
					downloadasTextFile("vaccine_max_infected_data.csv", prepareGraphDataToCSV(vaccine_max_infected_data, false));
					downloadasTextFile("vaccine_data.csv", prepareGraphDataToCSV(vaccine_data, false));
					
					// reset for next run
					vaccine_max_infected_data = [];
					vaccine_data = [];
					
					// make back as in the start
					showFinishAlert = true;
					document.getElementById("playBtn").style.display = "";
					document.getElementById("pauseBtn").style.display = "";
			
					// reset view
					document.getElementById("main").style.display = "none"; // close the init form
					document.getElementById("init_form").style.display = ""; // show the main window
					
					runStarted = false;
				}
			}
			
			infected = [];
			r_zeros = [];
			stateGraphData = [];
		}
	}
	
	// make a step on all the rockets
	population.run(a_a_t_c, a_c_t_c, c_a_t_c, c_c_t_c, infected_to_recover_time_adult, infected_to_recover_time_children, time_at_home);
	
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

function calcRzero(new_stat)
{
	var answer = 0;
	if (last_stats != null)
	{
		var delta_recover = (new_stat["a_r"] + new_stat["c_r"]) - (last_stats["a_r"] + last_stats["c_r"]);
		var delta_infected = (new_stat["a_i"] + new_stat["c_i"]) - (last_stats["a_i"] + last_stats["c_i"]);
		if (delta_recover == 0)
		{
			answer = delta_infected;
		}
		else
		{
			answer = delta_infected / delta_recover;
		}
	}
	last_stats = new_stat;
	return answer;
}

function prepareGraphDataToCSV(data, needHeader = true)
{
	var answer = "";
	if (needHeader)
	{
		answer = "day, adult infected, adult susceptible, adult recover, adult dead, child infected, child susceptible, child recover, child_dead\n";
	}
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