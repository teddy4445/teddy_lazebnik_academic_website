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

// multi analysis type flags
var is_mask = false;

// graphs
stateGraphData = [];

rzeroGraphData = [];

// populations sizes
var adult_pop_size = 0;
var susceptible_adults_percent = 0;
var infected_adults_percent = 0;
var recover_adults_percent = 0;

var children_pop_size = 0;
var susceptible_children_amount = 0;
var infected_children_amount = 0;
var recover_children_amount = 0;

// transform chances 
let a_a_t_c = 0;
let a_c_t_c = 0;
let c_a_t_c = 0;
let c_c_t_c = 0;

// location time circle
let TIME_IN_DAY = 24;
let time_at_home_a = 12;
let time_not_at_home_a = TIME_IN_DAY - time_at_home_a;
let time_at_home_c = 12;
let time_not_at_home_c = TIME_IN_DAY - time_at_home_c;

// Symptomatic Vs. Asymptomatic
let symptomatic_adults_chance = 0;
let symptomatic_children_chance = 0;

// Symptomatic infected individuals goes to work \ school
let percent_symptomatic_goto_work = 0;
let percent_symptomatic_goto_school = 0;

// recover chances
let prc = 0;
let pra = 0;
let infected_to_recover_time_adult = 0;
let infected_to_recover_time_children = 0;

// each k days go to out of house
let go_to_school_k_days = 1;
let go_to_work_k_days = 1;
let rest_in_shabat = 1;

// Masks
let init_percent_good_masks = 0;
let init_percent_bad_masks = 0;

let good_mask_two_side = 0;
let good_mask_infected_side = 0;
let good_mask_not_infected_side = 0;

let bad_mask_two_side = 0;
let bad_mask_infected_side = 0;
let bad_mask_not_infected_side = 0;


// technical vars

let fps = 12;
let graph_sample = 24;

// none user vars // 

// remember for r_0 calc
let last_stats = null;
let r_zeros = [];
let infected = [];

// multi run mask 
let mask_good_step_size = 0;
let mask_bad_step_size = 0;

let mask_data = [];
let mask_max_infected_data = [];
let mask_is_outbreak = [];

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup()
{
	// setup for user inputs
	completePop('susceptible_adults_percent', 'infected_adults_percent', 'recover_adults_percent', 'adult_pop_size');
	completePop('susceptible_children_percent', 'infected_children_percent', 'recover_children_percent', 'children_pop_size');
	completePercent('time_at_home_c', 'time_not_at_home_c', TIME_IN_DAY);
	completePercent('time_at_home_a', 'time_not_at_home_a', TIME_IN_DAY);

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
	document.getElementById("symptomatic_infected_text").innerHTML = (stats["a_si"] + stats["c_si"]).toString();
	document.getElementById("asymptomatic_infected_text").innerHTML = (stats["a_ai"] + stats["c_ai"]).toString();
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
		Object.keys(stats).forEach(function(key, index) {
			 graphValues.push(stats[key]);
		});
		// fix the data that is not 	
		stateGraphData.push(graphValues);
		rzeroGraphData.push([count / TIME_IN_DAY, r_zero, 1]);
		
		if (showFinishAlert)
		{
			try
			{
				drawAll();	
			}
			catch (error)
			{
				console.log(error);
			}
		}
		
		// if the simulation is over
		if ((stats["a_si"] + stats["a_ai"] + stats["c_si"] + stats["c_ai"]) == 0)
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
			else if(is_mask)
			{
				mask_circle();
			}
			
			// reset meta-run data //
			infected = [];
			r_zeros = [];
			// end - reset meta-run data //

			/* reset graph data */
			stateGraphData = [];
			
			rzeroGraphData = [];
			
			economicGraphDataAll = [];
			economicGraphData = [];
			
			consumersGraphDataAll = [];
			consumersGraph = [];
			/* end - reset graph data */
		}
	}
	
	// make a step on all the members
	// TODO: finish here
	population.run(a_a_t_c,
					a_c_t_c,
					c_a_t_c,
					c_c_t_c,
					infected_to_recover_time_adult, 
					infected_to_recover_time_children, 
					time_at_home_c, 
					time_at_home_a, 
					go_to_school_k_days, 
					go_to_work_k_days);
	
	// Displays stats on the screen
	var age_status_location_dist = population.countStatusLocationDestrebution();
	// run over all the locations
	Object.keys(age_status_location_dist).forEach(function(key,index) {
		document.getElementById(key).innerHTML = age_status_location_dist[key];	
	});

	// set the next frame count 
	count += 1;
	
}

function mask_circle()
{
	if (adult_recover <= working_adult_pop_size + nonworking_adult_pop_size)
	{
		if (child_recover <= children_pop_size)
		{
			
			vaccine_economical_data.push([(adult_recover / parseInt(working_adult_pop_size + nonworking_adult_pop_size)).toFixed(3),
										(child_recover / parseInt(document.getElementById("children_pop_size").value)).toFixed(3),
										population.econimic]);
										
			population = new Population(working_adult_pop_size,
										working_adult_pop_size - 1 - parseInt((adult_recover * working_adult_pop_size) / (2 * (working_adult_pop_size + nonworking_adult_pop_size))),
										1,
										parseInt((adult_recover * working_adult_pop_size) / (2 * working_adult_pop_size + nonworking_adult_pop_size)),
										nonworking_adult_pop_size,
										nonworking_adult_pop_size - parseInt((adult_recover * nonworking_adult_pop_size) / (2 * (working_adult_pop_size + nonworking_adult_pop_size))),
										0,
										parseInt((adult_recover * nonworking_adult_pop_size) / (2 * working_adult_pop_size + nonworking_adult_pop_size)),
										children_pop_size, 
										children_pop_size - 1 - child_recover, 
										1,
										child_recover,
										e_init);
								
			// downloadasTextFile("corona_sir_two_age_stocasic_graph_data___vacine_a_" + adult_recover + "_c_" + child_recover + ".csv", prepareGraphDataToCSV(stateGraphData));
			console.log("Vacine: a = " + adult_recover + ", c = " + child_recover);
			vaccine_data.push([(adult_recover / parseInt(working_adult_pop_size + nonworking_adult_pop_size)).toFixed(3), 
								(child_recover / parseInt(document.getElementById("children_pop_size").value)).toFixed(3),
								(r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
			vaccine_max_infected_data.push([(adult_recover / parseInt(working_adult_pop_size + nonworking_adult_pop_size)).toFixed(3), 
								(child_recover / parseInt(document.getElementById("children_pop_size").value)).toFixed(3),
								(100 * max(infected) / population.size()).toFixed(3)]);
			vaccine_is_outbreak.push([(adult_recover / parseInt(working_adult_pop_size + nonworking_adult_pop_size)).toFixed(3), 
									(child_recover / parseInt(document.getElementById("children_pop_size").value)).toFixed(3),
									checkOutbreak(r_zeros)]);
			child_recover += child_step_size;
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
		downloadasTextFile("vaccine_is_outbreak.csv", prepareGraphDataToCSV(vaccine_is_outbreak, false));
		
		// reset for next run
		vaccine_max_infected_data = [];
		vaccine_data = [];
		vaccine_is_outbreak = [];
		vaccine_economical_data = [];
		
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

function checkOutbreak(list_of_r_zero)
{
	for (var i = 0; i < list_of_r_zero.length; i++)
	{
		if (list_of_r_zero[i] > 1)
		{
			return 1;
		}
	}
	return 0;
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
		var delta_infected = (new_stat["a_si"] + new_stat["a_ai"] + new_stat["c_si"] + new_stat["c_ai"]) - (last_stats["a_si"] + last_stats["a_ai"] + last_stats["c_si"] + last_stats["c_ai"]);
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
		// TODO: finish here
		answer = "day, working adult infected, working adult susceptible, working adult recover, working adult dead, nonworking adult infected, nonworking adult susceptible, nonworking adult recover, nonworking adult dead, child infected, child susceptible, child recover, child_dead\n";
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