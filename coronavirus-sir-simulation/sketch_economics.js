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
var is_economic = false;
var is_vaccine = false;
var is_lockdown = false;
var is_time_analysis = false;
var is_taxes = false;

// graphs
stateGraphData = [];

rzeroGraphData = [];

economicGraphDataAll = [];
economicGraphData = [];

consumersGraphDataAll = [];
consumersGraph = [];

// populations sizes
var working_adult_pop_size = 0;
var susceptible_working_adults_percent = 0;
var infected_working_adults_percent = 0;
var recover_working_adults_percent = 0;

var nonworking_adult_pop_size = 0;
var susceptible_nonworking_adults_percent = 0;
var infected_nonworking_adults_percent = 0;
var recover_nonworking_adults_percent = 0;

var children_pop_size = 0;
var susceptible_children_amount = 0;
var infected_children_amount = 0;
var recover_children_amount = 0;

// transform chances 
let wa_wa_t_c = 0;
let wa_na_t_c = 0;
let na_wa_t_c = 0;
let na_na_t_c = 0;
let wa_c_t_c = 0;
let na_c_t_c = 0;
let c_c_t_c = 0;
let c_wa_t_c = 0;
let c_na_t_c = 0;

// meeting in time unit (default - hour)
let wa_c_meeting_count = 0;
let na_c_meeting_count = 0;
let wa_wa_meeting_count = 0;
let wa_na_meeting_count = 0;
let c_c_meeting_count = 0;
let na_na_meeting_count = 0;

// economical parameters
let e_init = 0;
let loss_jobs_rate = 0;
let avg_contribution_to_economic = 0;
let loss_jobs_rate_step = 0;
let loss_jobs_rate_max = 0;

let total_working_hours = 0;

let STANDARD_WORK_DAY = 8; // important const

// recover chances
let prc = 0;
let pra = 0;

// each k days go to out of house
let go_to_school_k_days = 1;
let go_to_work_k_days = 1;
let rest_in_shabat = 1;

let fps = 12;
let graph_sample = 24;

let infected_to_recover_time_adult = 0;
let infected_to_recover_time_children = 0;

// location time circle
let TIME_IN_DAY = 24;
let time_at_home_a = 12;
let time_not_at_home_a = TIME_IN_DAY - time_at_home_a;
let time_at_home_c = 12;
let time_not_at_home_c = TIME_IN_DAY - time_at_home_c;

// lockdown percent
let go_to_work_percent = 100;
let go_to_school_percent = 100;
let go_to_work_percent_step_size = 0;
let go_to_school_percent_step_size = 0;

// remember for r_0 calc
let last_stats = null;
let r_zeros = [];
let infected = [];

// goverment factors
let taxes_percent = 0;

// vaccine run
var recover_working_adults_percent;
var recover_nonworking_adults_percent;
var child_recover;
var working_adult_pop_size;
var nonworking_adult_pop_size;
var adult_step_size;
var children_pop_size;
var child_step_size;

// multi run vaccine 
let vaccine_data = [];
let vaccine_economical_data = [];
let vaccine_max_infected_data = [];
let vaccine_is_outbreak = [];

// multi run lockdown 
let lockdown_data = [];
let lockdown_max_infected_data = [];
let lockdown_is_outbreak = [];
let lockdown_economical_data = [];

// economical run  
let economical_duration = [];
let economical_duration_economic = [];
let economical_duration_max_infected_data = [];
let economical_duration_is_outbreak = [];
let economical_working_hours = [];

// work\school duration run  
let work_school_duration = [];
let work_school_duration_economic = [];
let work_school_duration_max_infected_data = [];
let work_school_duration_is_outbreak = [];

// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup()
{
	// setup for user inputs
	completePop('susceptible_working_adults_percent', 'infected_working_adults_percent', 'recover_working_adults_percent', 'working_adult_pop_size');
	completePop('susceptible_nonworking_adults_percent', 'infected_nonworking_adults_percent', 'recover_nonworking_adults_percent', 'nonworking_adult_pop_size');
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
	document.getElementById("susceptible_text").innerHTML = (stats["wa_s"] + stats["na_s"] + stats["c_s"]).toString();
	document.getElementById("infected_text").innerHTML = (stats["wa_i"] + stats["na_i"] + stats["c_i"]).toString();
	infected.push(stats["a_i"] + stats["c_i"]);
	document.getElementById("recover_text").innerHTML = (stats["wa_r"] + stats["na_r"] + stats["c_r"]).toString();
	document.getElementById("dead_text").innerHTML = (stats["wa_d"] + stats["na_d"] + stats["c_d"]).toString();
	document.getElementById("clock").innerHTML = stepToClock(count);
	var r_zero = calcRzero(stats);
	r_zeros.push(r_zero);
	document.getElementById("r_zero").innerHTML = "R<small>0</small> = " + r_zero.toFixed(2) + ", Avg(R<small>0</small>) = " + (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(2) ;
	
	// recall each step to sum it in the graph later
	economicGraphDataAll.push(population.econimic_delta);
	consumersGraphDataAll.push(population.taxes);
	
	// count working hours 
	total_working_hours += population.count_working_hours();
	
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
		
		// economical data
		if (count != 0)
		{
			var gatherVal = 0;
			for (var i = economicGraphDataAll.length - graph_sample; i < economicGraphDataAll.length; i++)
			{
				gatherVal += economicGraphDataAll[i];
			}
			economicGraphData.push([count / TIME_IN_DAY, gatherVal]);
		}
		
		// consumption data
		if (count != 0)
		{
			var gatherVal = 0;
			for (var i = consumersGraphDataAll.length - graph_sample; i < consumersGraphDataAll.length; i++)
			{
				gatherVal += consumersGraphDataAll[i];
			}
			consumersGraph.push([count / TIME_IN_DAY, gatherVal]);
		}
		
		if (showFinishAlert)
		{
			drawAll();	
		}
		
		// if the simulation is over
		if ((stats["wa_i"] + stats["na_i"] + stats["c_i"]) == 0)
		{
			population.clear();
			count = 1;
			
			if (showFinishAlert)
			{
				downloadasTextFile("corona_sir_two_age_stocasic_graph_data.csv", prepareGraphDataToCSV(stateGraphData));
				downloadasTextFile("corona_sir_two_age_economic_graph_data.csv", prepareEconomicGraphDataToCSV(economicGraphData));
				downloadasTextFile("corona_sir_two_age_consuming_graph_data.csv", prepareConsumptionGraphDataToCSV(consumersGraph));
				downloadasTextFile("corona_sir_two_age_summery.csv", 
									"Average R_0 = " + (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3) +
									", with max infected = " + (100 * max(infected) / population.size()).toFixed(3) + "%");
				alert("Simulation over");	
			
				// reset view
				document.getElementById("main").style.display = "none"; // close the init form
				document.getElementById("init_form").style.display = ""; // show the main window
				
				runStarted = false;
			}
			else if (is_vaccine)
			{
				vaccive_circle();
			}
			else if(is_lockdown)
			{
				lockdown_circle();
			}
			else if(is_time_analysis)
			{
				time_circle();
			}
			else if(is_economic)
			{
				econimic_circle();
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
	population.run(wa_wa_t_c, 
					wa_na_t_c, 
					na_wa_t_c, 
					na_na_t_c,
					wa_c_t_c,
					na_c_t_c,
					c_c_t_c,
					c_wa_t_c,
					c_na_t_c,
					infected_to_recover_time_adult, 
					infected_to_recover_time_children, 
					time_at_home_c, 
					time_at_home_a, 
					go_to_school_k_days, 
					go_to_work_k_days,
					loss_jobs_rate,
					avg_contribution_to_economic,
					taxes_percent);
	
	// Displays stats on the screen
	var age_status_location_dist = population.countStatusLocationDestrebution();
	// run over all the locations
	Object.keys(age_status_location_dist).forEach(function(key,index) {
		document.getElementById(key).innerHTML = age_status_location_dist[key];	
	});

	// set the next frame count 
	count += 1;
	
}

function vaccive_circle()
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
		downloadasTextFile("vaccine_economical_data.csv", prepareGraphDataToCSV(vaccine_economical_data, false));
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

function lockdown_circle()
{
	if (go_to_work_percent >= 0)
	{
		if (go_to_school_percent >= 0)
		{
			lockdown_economical_data.push([go_to_work_percent, go_to_school_percent, population.econimic]);
			
			population = new Population(working_adult_pop_size,
										working_adult_pop_size - 1,
										1,
										0,
										nonworking_adult_pop_size,
										nonworking_adult_pop_size,
										0,
										0,
										children_pop_size, 
										children_pop_size, 
										0,
										0,
										e_init);
								
			console.log("Lockdown: Work (%) = " + go_to_work_percent + ", School (%) = " + go_to_school_percent);
			lockdown_data.push([go_to_work_percent, go_to_school_percent, (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
			lockdown_max_infected_data.push([go_to_work_percent, go_to_school_percent, (100 * max(infected) / population.size()).toFixed(3)]);
			lockdown_is_outbreak.push([go_to_work_percent, 
									go_to_school_percent,
									checkOutbreak(r_zeros)]);
			go_to_school_percent -= go_to_school_percent_step_size;
		}
		else
		{
			go_to_school_percent = 100;
			go_to_work_percent -= go_to_work_percent_step_size; 
		}
	}
	else
	{
		// download results
		downloadasTextFile("lockdown_max_infected_data.csv", prepareGraphDataToCSV(lockdown_max_infected_data, false));
		downloadasTextFile("lockdown_data.csv", prepareGraphDataToCSV(lockdown_data, false));
		downloadasTextFile("lockdown_economical_data.csv", prepareGraphDataToCSV(lockdown_economical_data, false));
		downloadasTextFile("lockdown_is_outbreak.csv", prepareGraphDataToCSV(lockdown_is_outbreak, false));
		
		// reset for next run
		lockdown_max_infected_data = [];
		lockdown_data = [];
		lockdown_is_outbreak = [];
		lockdown_economical_data = [];
		
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

function time_circle()
{
	if (time_at_home_a < TIME_IN_DAY)
	{
		if (time_at_home_c <= TIME_IN_DAY)
		{
			work_school_duration_economic.push([time_at_home_a, time_at_home_c, population.econimic]);
			
			population = new Population(working_adult_pop_size,
										working_adult_pop_size - 1,
										1,
										0,
										nonworking_adult_pop_size,
										nonworking_adult_pop_size,
										0,
										0,
										children_pop_size, 
										children_pop_size, 
										0,
										0,
										e_init);
								
			console.log("Time Duraction Analysis: Work hours  = " + time_at_home_a + ", School hours = " + time_at_home_c);
			work_school_duration.push([time_at_home_a, time_at_home_c, (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
			work_school_duration_max_infected_data.push([time_at_home_a, time_at_home_c, (100 * max(infected) / population.size()).toFixed(3)]);
			work_school_duration_is_outbreak.push([time_at_home_a, time_at_home_c, checkOutbreak(r_zeros)]);
			time_at_home_c += 1;
		}
		else
		{
			time_at_home_c = 0;
			time_at_home_a += 1; 
		}
	}
	else
	{
		// download results
		downloadasTextFile("work_school_duration_max_infected_data.csv", prepareGraphDataToCSV(work_school_duration_max_infected_data, false));
		downloadasTextFile("work_school_duration_data.csv", prepareGraphDataToCSV(work_school_duration, false));
		downloadasTextFile("work_school_duration_economic.csv", prepareGraphDataToCSV(work_school_duration_economic, false));
		downloadasTextFile("work_school_duration_is_outbreak.csv", prepareGraphDataToCSV(work_school_duration_is_outbreak, false));
		
		// reset for next run
		work_school_duration_max_infected_data = [];
		work_school_duration = [];
		work_school_duration_is_outbreak = [];
		work_school_duration_economic = [];
		
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

function econimic_circle()
{
	if (loss_jobs_rate <= loss_jobs_rate_max)
	{	
		economical_duration_economic.push([loss_jobs_rate, population.econimic]);
		
		population = new Population(working_adult_pop_size,
									susceptible_working_adults_percent,
									infected_working_adults_percent,
									recover_working_adults_percent,
									nonworking_adult_pop_size,
									susceptible_nonworking_adults_percent,
									infected_nonworking_adults_percent,
									recover_nonworking_adults_percent,
									children_pop_size, 
									susceptible_children_amount, 
									infected_children_amount,
									recover_children_amount,
									e_init);
							
		console.log("Econimic job loss rate analysis: m=" + loss_jobs_rate + "%");
		
		economical_duration.push([loss_jobs_rate, (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
		economical_duration_max_infected_data.push([loss_jobs_rate, (100 * max(infected) / population.size()).toFixed(3)]);
		economical_duration_is_outbreak.push([loss_jobs_rate, checkOutbreak(r_zeros)]);
		economical_working_hours.push([loss_jobs_rate, total_working_hours]);
		
		loss_jobs_rate += loss_jobs_rate_step;
		total_working_hours = 0;
	}
	else
	{
		// download results
		downloadasTextFile("economical_duration_max_infected_data.csv", prepareGraphDataToCSV(economical_duration_max_infected_data, false));
		downloadasTextFile("economical_duration.csv", prepareGraphDataToCSV(economical_duration, false));
		downloadasTextFile("economical_duration_economic.csv", prepareGraphDataToCSV(economical_duration_economic, false));
		downloadasTextFile("economical_duration_is_outbreak.csv", prepareGraphDataToCSV(economical_duration_is_outbreak, false));
		downloadasTextFile("economical_working_hours.csv", prepareGraphDataToCSV(economical_working_hours, false));
		
		// reset for next run
		economical_duration = [];
		economical_duration_max_infected_data = [];
		economical_duration_is_outbreak = [];
		economical_duration_economic = [];
		economical_working_hours = [];
		total_working_hours = 0;
		
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
		var delta_recover = (new_stat["wa_r"] + new_stat["na_r"] + new_stat["c_r"]) - (last_stats["wa_r"] + last_stats["na_r"] + last_stats["c_r"]);
		var delta_infected = (new_stat["wa_i"] + new_stat["na_i"] + new_stat["c_i"]) - (last_stats["wa_i"] + last_stats["na_i"] + last_stats["c_i"]);
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

function prepareEconomicGraphDataToCSV(data, needHeader = true)
{
	var answer = "";
	if (needHeader)
	{
		answer = "day, Economic, Economic Delta\n";
	}
	for (var i = 0; i < data.length; i++)
	{
		for (j = 0; j < data[i].length; j++)
		{
			answer += data[i][j] + ",";
		}
		if (i > 0)
		{
			answer += data[i][data[i].length - 1] - data[i - 1][data[i].length - 1] + ",";
		}
		else
		{
			answer += "0,";
		}
		answer = answer.substring(0, answer.length - 1) + "\n";
	}
	return answer.substring(0, answer.length - 1);
}

function prepareConsumptionGraphDataToCSV(data, needHeader = true)
{
	var answer = "";
	if (needHeader)
	{
		answer = "day, Money Nonworking adult gets for taxes\n";
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