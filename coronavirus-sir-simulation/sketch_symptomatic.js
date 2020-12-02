// canvas Z-Index
var zIndex = 300;
var count = 0;

// const in the stocastic process of meeting infection between individuals //
var MAX_TRYS = 1;
 
var population;

// --- DOM ACTIONS --- //
var pauseBtn;
var playBtn;
// --- END DOM ACTIONS --- //

runStarted = false;
var showFinishAlert = true;

// multi analysis type flags
var is_mask = false;
var is_working_hours = false;
var is_mask_and_hours = false;
var is_mask_and_hours_random = false;
var is_schooling_hours = false;
var is_schooling_working_hours = false;
var is_event_analysis = false;

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

let bad_infected_good_susceptible = 0;
let good_infected_bad_susceptible = 0;

// events size 
let event_size = 0;
let event_rate_days = 1000;

// --- meta run evetns 
let max_pop_event = 0; 
let step_pop_event = 0; 
let event_rate_max = 0; 
let event_rate_step = 0;

// infection distrebution
let home_infections = 0;
let work_infections = 0; 
let school_infections = 0;


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
let masks_is_outbreak = [];
let masks_infection_distrebution = [];

// work\school duration with masks run  
let work_school_duration = [];
let work_school_duration_max_infected_data = [];
let work_school_duration_is_outbreak = [];
let pandemic_time = [];
let s_left = [];

// work\school duration with masks run  
let work_hours_r_zero = [];
let work_hours_max_infected_data = [];
let work_hours_is_outbreak = [];
let work_hourspandemic_time = [];
let work_hourss_left = [];
let work_hourss_infection_distrebution = [];

// work\school duration with masks run  
let school_hours_r_zero = [];
let school_hours_max_infected_data = [];
let school_hours_is_outbreak = [];
let school_hourspandemic_time = [];
let school_hourss_left = [];
let school_hourss_infection_distrebution = [];

let random_counter = 0;

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
	infected.push(stats["a_si"] + stats["a_ai"] + stats["c_si"] + stats["c_ai"]);
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
			
			if (showFinishAlert)
			{
				let total_infections = home_infections + work_infections + school_infections;
				downloadasTextFile("corona_sir_two_age_stocasic_graph_data.csv", prepareGraphDataToCSV(stateGraphData));
				downloadasTextFile("work_school_infection_distrebution.csv", prepareGraphDataToCSV([[home_infections/total_infections, work_infections/total_infections, school_infections/total_infections]], false));
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
			else if(is_mask_and_hours)
			{
				mask_hours_circle();
			}
			else if(is_mask_and_hours_random)
			{
				mask_hours_circle_random();
			}
			else if(is_working_hours)
			{
				working_hours_circle();
			}
			else if (is_schooling_hours)
			{
				schol_hours_circle();
			}
			else if (is_schooling_working_hours)
			{
				school_work_hours_circle();
			}
			else if (is_event_analysis)
			{
				events_circle();
			}
			
			count = 1;
			
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
			home_infections = 0;
			work_infections = 0;
			school_infections = 0;
			/* end - reset graph data */
		}
	}
	
	population.run();
	
	// Displays stats on the screen
	var age_status_location_dist = population.countStatusLocationDestrebution();
	// run over all the locations
	Object.keys(age_status_location_dist).forEach(function(key,index) {
		try
		{
			document.getElementById(key).innerHTML = age_status_location_dist[key];	
		}
		catch (error)
		{
			
		}	
	});

	// set the next frame count 
	count += 1;
	
}

function working_hours_circle()
{
	if (time_at_home_a < TIME_IN_DAY)
	{
		// create population to simulate
		population = new Population(adult_pop_size,
									susceptible_adults_percent,
									infected_adults_percent,
									recover_adults_percent,
									children_pop_size, 
									susceptible_children_amount, 
									infected_children_amount,
									recover_children_amount);
							
		let working_hours = TIME_IN_DAY - time_at_home_a;
		console.log("working hours: " + working_hours);
		
		work_hours_r_zero.push([working_hours, (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
							
		work_hours_max_infected_data.push([working_hours, (100 * max(infected) / population.size()).toFixed(3)]);
		
		work_hours_is_outbreak.push([working_hours, checkOutbreak(r_zeros)]);
		
		work_hourss_left.push([working_hours, document.getElementById("susceptible_text").innerHTML]);
		
		work_hourspandemic_time.push([working_hours, count]);
		
		let total_infections = home_infections + work_infections + school_infections;
		work_hourss_infection_distrebution.push([working_hours, home_infections/total_infections, work_infections/total_infections, school_infections/total_infections]);
		
		time_at_home_a++;
	}
	else
	{
		// download results
		downloadasTextFile("work_hours_r_zero.csv", prepareGraphDataToCSV(work_hours_r_zero, false));
		downloadasTextFile("work_hours_max_infected_data.csv", prepareGraphDataToCSV(work_hours_max_infected_data, false));
		downloadasTextFile("work_hours_is_outbreak.csv", prepareGraphDataToCSV(work_hours_is_outbreak, false));
		downloadasTextFile("work_hourss_left.csv", prepareGraphDataToCSV(work_hourss_left, false));
		downloadasTextFile("work_hourspandemic_time.csv", prepareGraphDataToCSV(work_hourspandemic_time, false));
		downloadasTextFile("work_hourss_infection_distrebution.csv", prepareGraphDataToCSV(work_hourss_infection_distrebution, false));
		
		// reset for next run
		work_hours_r_zero = [];
		work_hours_max_infected_data = [];
		work_hours_is_outbreak = [];
		work_hourss_left = [];
		work_hourspandemic_time = [];
		work_hourss_infection_distrebution = [];
		
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

function schol_hours_circle()
{
	if (time_at_home_c < TIME_IN_DAY)
	{
		// create population to simulate
		population = new Population(adult_pop_size,
									susceptible_adults_percent,
									infected_adults_percent,
									recover_adults_percent,
									children_pop_size, 
									susceptible_children_amount, 
									infected_children_amount,
									recover_children_amount);
							
		let schooling_hours = TIME_IN_DAY - time_at_home_c;
		console.log("schooling hours: " + schooling_hours);
		
		school_hours_r_zero.push([schooling_hours, (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
							
		school_hours_max_infected_data.push([schooling_hours, (100 * max(infected) / population.size()).toFixed(3)]);
		
		school_hours_is_outbreak.push([schooling_hours, checkOutbreak(r_zeros)]);
		
		school_hourss_left.push([schooling_hours, document.getElementById("susceptible_text").innerHTML]);
		
		school_hourspandemic_time.push([schooling_hours, count]);
		
		let total_infections = home_infections + work_infections + school_infections;
		school_hourss_infection_distrebution.push([schooling_hours, home_infections/total_infections, work_infections/total_infections, school_infections/total_infections]);
		
		time_at_home_c++;
	}
	else
	{
		// download results
		downloadasTextFile("school_hours_r_zero.csv", prepareGraphDataToCSV(school_hours_r_zero, false));
		downloadasTextFile("school_hours_max_infected_data.csv", prepareGraphDataToCSV(school_hours_max_infected_data, false));
		downloadasTextFile("school_hours_is_outbreak.csv", prepareGraphDataToCSV(school_hours_is_outbreak, false));
		downloadasTextFile("school_hourss_left.csv", prepareGraphDataToCSV(school_hourss_left, false));
		downloadasTextFile("school_hourspandemic_time.csv", prepareGraphDataToCSV(school_hourspandemic_time, false));
		downloadasTextFile("school_hourss_infection_distrebution.csv", prepareGraphDataToCSV(school_hourss_infection_distrebution, false));
		
		// reset for next run
		school_hours_r_zero = [];
		school_hours_max_infected_data = [];
		school_hours_is_outbreak = [];
		school_hourss_left = [];
		school_hourspandemic_time = [];
		school_hourss_infection_distrebution = [];
		
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


function school_work_hours_circle()
{
	if (time_at_home_a < TIME_IN_DAY)
	{
		if (time_at_home_c < TIME_IN_DAY)
		{
			// create population to simulate
			population = new Population(adult_pop_size,
										susceptible_adults_percent,
										infected_adults_percent,
										recover_adults_percent,
										children_pop_size, 
										susceptible_children_amount, 
										infected_children_amount,
										recover_children_amount);
								
			let schooling_hours = TIME_IN_DAY - time_at_home_c;
			let working_hours = TIME_IN_DAY - time_at_home_a;
			console.log("working hours: " + working_hours + ", schooling hours: " + schooling_hours);
			
			school_hours_r_zero.push([working_hours, schooling_hours, (r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
								
			school_hours_max_infected_data.push([working_hours, schooling_hours, (100 * max(infected) / population.size()).toFixed(3)]);
			
			school_hours_is_outbreak.push([working_hours, schooling_hours, checkOutbreak(r_zeros)]);
			
			school_hourss_left.push([working_hours, schooling_hours, document.getElementById("susceptible_text").innerHTML]);
			
			school_hourspandemic_time.push([working_hours, schooling_hours, count]);
			
			let total_infections = home_infections + work_infections + school_infections;
			school_hourss_infection_distrebution.push([working_hours, schooling_hours, home_infections/total_infections, work_infections/total_infections, school_infections/total_infections]);
			
			time_at_home_c++;
		}
		else
		{
			time_at_home_c = 0;
			time_at_home_a++;
		}
	}
	else
	{
		// download results
		downloadasTextFile("work_school_hours_r_zero.csv", prepareGraphDataToCSV(school_hours_r_zero, false));
		downloadasTextFile("work_school_hours_max_infected_data.csv", prepareGraphDataToCSV(school_hours_max_infected_data, false));
		downloadasTextFile("work_school_hours_is_outbreak.csv", prepareGraphDataToCSV(school_hours_is_outbreak, false));
		downloadasTextFile("work_school_hourss_left.csv", prepareGraphDataToCSV(school_hourss_left, false));
		downloadasTextFile("work_school_hourspandemic_time.csv", prepareGraphDataToCSV(school_hourspandemic_time, false));
		downloadasTextFile("work_school_hourss_infection_distrebution.csv", prepareGraphDataToCSV(school_hourss_infection_distrebution, false));
		
		// reset for next run
		school_hours_r_zero = [];
		school_hours_max_infected_data = [];
		school_hours_is_outbreak = [];
		school_hourss_left = [];
		school_hourspandemic_time = [];
		school_hourss_infection_distrebution = [];
		
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

function events_circle()
{
	if (event_rate_days <= event_rate_max)
	{
		if (event_size <= max_pop_event)
		{								
			// create population to simulate
			population = new Population(adult_pop_size,
										susceptible_adults_percent,
										infected_adults_percent,
										recover_adults_percent,
										children_pop_size, 
										susceptible_children_amount, 
										infected_children_amount,
										recover_children_amount);
								
			console.log("Events: event rate days = " + event_rate_days + ", event size = " + event_size);
			
			mask_data.push([event_rate_days,
							event_size, 
							(r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
								
			mask_max_infected_data.push([event_rate_days, event_size, 
										(100 * max(infected) / population.size()).toFixed(3)]);
			masks_is_outbreak.push([event_rate_days, 
										event_size,
										checkOutbreak(r_zeros)]);
			
			s_left.push([event_rate_days, 
							event_size,
							document.getElementById("susceptible_text").innerHTML]);
			
			pandemic_time.push([event_rate_days, 
							event_size,
							count]);
							
			let total_infections = home_infections + work_infections + school_infections;
			masks_infection_distrebution.push([event_rate_days, event_size, home_infections/total_infections, work_infections/total_infections, school_infections/total_infections]);
			
			event_size += step_pop_event;
		}
		else
		{
			event_size = step_pop_event;
			event_rate_days += event_rate_step; 
		}
	}
	else
	{
		// download results
		downloadasTextFile("events_max_infected_data.csv", prepareGraphDataToCSV(mask_max_infected_data, false));
		downloadasTextFile("events_data.csv", prepareGraphDataToCSV(mask_data, false));
		downloadasTextFile("events_is_outbreak.csv", prepareGraphDataToCSV(masks_is_outbreak, false));
		downloadasTextFile("events_s_left.csv", prepareGraphDataToCSV(s_left, false));
		downloadasTextFile("events_pandemic_time.csv", prepareGraphDataToCSV(pandemic_time, false));
		downloadasTextFile("events_infection_distrebution.csv", prepareGraphDataToCSV(masks_infection_distrebution, false));
		
		// reset for next run
		mask_max_infected_data = [];
		mask_data = [];
		masks_is_outbreak = [];
		s_left = [];
		pandemic_time = [];
		masks_infection_distrebution = [];
		
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

function mask_circle()
{
	if (init_percent_good_masks <= 1)
	{
		if (init_percent_bad_masks <= 1 - init_percent_good_masks)
		{								
			// create population to simulate
			population = new Population(adult_pop_size,
										susceptible_adults_percent,
										infected_adults_percent,
										recover_adults_percent,
										children_pop_size, 
										susceptible_children_amount, 
										infected_children_amount,
										recover_children_amount);
								
			console.log("masks: good_mask = " + init_percent_good_masks + ", bad mask = " + init_percent_bad_masks);
			
			mask_data.push([init_percent_good_masks,
							init_percent_bad_masks, 
							(r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
								
			mask_max_infected_data.push([init_percent_good_masks, init_percent_bad_masks, 
										(100 * max(infected) / population.size()).toFixed(3)]);
			masks_is_outbreak.push([init_percent_good_masks, 
										init_percent_bad_masks,
										checkOutbreak(r_zeros)]);
			
			s_left.push([init_percent_good_masks, 
							init_percent_bad_masks,
							document.getElementById("susceptible_text").innerHTML]);
			
			pandemic_time.push([init_percent_good_masks, 
							init_percent_bad_masks,
							count]);
							
			let total_infections = home_infections + work_infections + school_infections;
			masks_infection_distrebution.push([init_percent_good_masks, init_percent_bad_masks, home_infections/total_infections, work_infections/total_infections, school_infections/total_infections]);
			
			init_percent_bad_masks += mask_bad_step_size/100;
		}
		else
		{
			init_percent_bad_masks = 0;
			init_percent_good_masks += mask_good_step_size/100; 
		}
	}
	else
	{
		// download results
		downloadasTextFile("masks_max_infected_data.csv", prepareGraphDataToCSV(mask_max_infected_data, false));
		downloadasTextFile("mask_data.csv", prepareGraphDataToCSV(mask_data, false));
		downloadasTextFile("masks_is_outbreak.csv", prepareGraphDataToCSV(masks_is_outbreak, false));
		downloadasTextFile("masks_s_left.csv", prepareGraphDataToCSV(s_left, false));
		downloadasTextFile("masks_pandemic_time.csv", prepareGraphDataToCSV(pandemic_time, false));
		downloadasTextFile("masks_infection_distrebution.csv", prepareGraphDataToCSV(masks_infection_distrebution, false));
		
		// reset for next run
		mask_max_infected_data = [];
		mask_data = [];
		masks_is_outbreak = [];
		s_left = [];
		pandemic_time = [];
		masks_infection_distrebution = [];
		
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


function mask_hours_circle()
{
	if (time_at_home_a < TIME_IN_DAY)
	{
		if (time_at_home_c <= TIME_IN_DAY)
		{
			if (init_percent_good_masks <= 100)
			{
				if (init_percent_bad_masks <= 100 - init_percent_good_masks)
				{				
					// create population to simulate
					population = new Population(adult_pop_size,
												susceptible_adults_percent,
												infected_adults_percent,
												recover_adults_percent,
												children_pop_size, 
												susceptible_children_amount, 
												infected_children_amount,
												recover_children_amount);
												
					console.log("Time Duraction + Masks Analysis: Work hours  = " + time_at_home_a + ", School hours = " + time_at_home_c + ", good_mask = " + init_percent_good_masks + ", bad mask = " + init_percent_bad_masks);
					
					work_school_duration.push([time_at_home_a,
									time_at_home_c,init_percent_good_masks,
									init_percent_bad_masks, 
									(r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
										
					work_school_duration_max_infected_data.push([time_at_home_a,
									time_at_home_c,init_percent_good_masks, 
												init_percent_bad_masks, 
												(100 * max(infected) / population.size()).toFixed(3)]);
					work_school_duration_is_outbreak.push([time_at_home_a,
									time_at_home_c,init_percent_good_masks, 
												init_percent_bad_masks,
												checkOutbreak(r_zeros)]);
			
					s_left.push([time_at_home_a,
									time_at_home_c,
									init_percent_good_masks, 
									init_percent_bad_masks,
									document.getElementById("susceptible_text").innerHTML]);
					
					pandemic_time.push([time_at_home_a,
									time_at_home_c,init_percent_good_masks, 
									init_percent_bad_masks,
									count]);
					
					init_percent_bad_masks += mask_bad_step_size;
					
					// download results
					downloadasTextFile("process_download_max_infected.csv", prepareGraphDataToCSV(work_school_duration_max_infected_data, false));
					downloadasTextFile("process_download_r_zero.csv", prepareGraphDataToCSV(work_school_duration, false));
					downloadasTextFile("process_download_is_outbreak.csv", prepareGraphDataToCSV(work_school_duration_is_outbreak, false));
					downloadasTextFile("process_download_s_left.csv", prepareGraphDataToCSV(s_left, false));
					downloadasTextFile("process_download_pandemic_time.csv", prepareGraphDataToCSV(pandemic_time, false));
				}
				else
				{
					init_percent_bad_masks = 0;
					init_percent_good_masks += mask_good_step_size; 
				}
			}
			else
			{
				init_percent_good_masks = 0;
				time_at_home_c += 2; 
			}
		}
		else
		{
			time_at_home_c = 0;
			time_at_home_a += 2; 
		}
	}
	else
	{
		// download results
		downloadasTextFile("work_school_duration_with_masks_max_infected_data.csv", prepareGraphDataToCSV(work_school_duration_max_infected_data, false));
		downloadasTextFile("work_school_duration_with_masks_data.csv", prepareGraphDataToCSV(work_school_duration, false));
		downloadasTextFile("work_school_duration_with_masks_is_outbreak.csv", prepareGraphDataToCSV(work_school_duration_is_outbreak, false));
		downloadasTextFile("work_school_duration_with_masks_s_left.csv", prepareGraphDataToCSV(s_left, false));
		downloadasTextFile("work_school_duration_with_masks_pandemic_time.csv", prepareGraphDataToCSV(pandemic_time, false));
		
		// reset for next run
		work_school_duration_max_infected_data = [];
		work_school_duration = [];
		work_school_duration_is_outbreak = [];
		s_left = [];
		pandemic_time = [];
		
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


function mask_hours_circle_random()
{
	if (random_counter < max_tries_analysis)
	{	
		// create population to simulate
		population = new Population(adult_pop_size,
									susceptible_adults_percent,
									infected_adults_percent,
									recover_adults_percent,
									children_pop_size, 
									susceptible_children_amount, 
									infected_children_amount,
									recover_children_amount);
		
		console.log("Run number " + random_counter);
		console.log("Time Duraction + Masks Analysis: Work hours  = " + time_at_home_a + ", School hours = " + time_at_home_c + ", good_mask = " + init_percent_good_masks + ", bad mask = " + init_percent_bad_masks);
		
		work_school_duration.push([time_at_home_a,
									time_at_home_c,
									init_percent_good_masks,
									init_percent_bad_masks, 
									(r_zeros.reduce((a, b) => a + b, 0) / r_zeros.length).toFixed(3)]);
							
		work_school_duration_max_infected_data.push([time_at_home_a,
						time_at_home_c,init_percent_good_masks, 
									init_percent_bad_masks, 
									(100 * max(infected) / population.size()).toFixed(3)]);
		work_school_duration_is_outbreak.push([time_at_home_a,
									time_at_home_c,
									init_percent_good_masks, 
									init_percent_bad_masks,
									checkOutbreak(r_zeros)]);

		s_left.push([time_at_home_a,
						time_at_home_c,
						init_percent_good_masks, 
						init_percent_bad_masks,
						document.getElementById("susceptible_text").innerHTML]);
		
		pandemic_time.push([time_at_home_a,
							time_at_home_c,
							init_percent_good_masks, 
							init_percent_bad_masks,
							count]);
						
		time_at_home_a = Math.floor(Math.random() * 25);
		time_at_home_c = Math.floor(Math.random() * 25);
		init_percent_good_masks = 5 * Math.floor(Math.random() * 21);
		init_percent_bad_masks = 5 * Math.floor(Math.random() * 21);
		
		while (init_percent_good_masks + init_percent_bad_masks > 100)
		{
			init_percent_good_masks = 5 * Math.floor(Math.random() * 21);
			init_percent_bad_masks = 5 * Math.floor(Math.random() * 21);
		}
		
		if (((1 + random_counter) % 100) == 0)
		{
			// download results
			downloadasTextFile("process_download_max_infected.csv", prepareGraphDataToCSV(work_school_duration_max_infected_data, false));
			downloadasTextFile("process_download_r_zero.csv", prepareGraphDataToCSV(work_school_duration, false));
			downloadasTextFile("process_download_is_outbreak.csv", prepareGraphDataToCSV(work_school_duration_is_outbreak, false));
			downloadasTextFile("process_download_s_left.csv", prepareGraphDataToCSV(s_left, false));
			downloadasTextFile("process_download_pandemic_time.csv", prepareGraphDataToCSV(pandemic_time, false));
		}
		
		random_counter++;
	}
	else
	{
		// download results
		downloadasTextFile("work_school_duration_with_masks_max_infected_data.csv", prepareGraphDataToCSV(work_school_duration_max_infected_data, false));
		downloadasTextFile("work_school_duration_with_masks_data.csv", prepareGraphDataToCSV(work_school_duration, false));
		downloadasTextFile("work_school_duration_with_masks_is_outbreak.csv", prepareGraphDataToCSV(work_school_duration_is_outbreak, false));
		downloadasTextFile("work_school_duration_with_masks_s_left.csv", prepareGraphDataToCSV(s_left, false));
		downloadasTextFile("work_school_duration_with_masks_pandemic_time.csv", prepareGraphDataToCSV(pandemic_time, false));
		
		// reset for next run
		work_school_duration_max_infected_data = [];
		work_school_duration = [];
		work_school_duration_is_outbreak = [];
		s_left = [];
		pandemic_time = [];
		random_counter = 0;
		
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
		answer = "day,ias,iaa,sa,ra,da,ics,ica,sc,rc,dc\n";
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