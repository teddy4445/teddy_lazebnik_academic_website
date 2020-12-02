function completePercent(index1, index2, delta)
{
	document.getElementById(index1).addEventListener('input', function(){
		document.getElementById(index2).value = delta - parseInt(document.getElementById(index1).value);
	});
}

function completePop(index_check1, index_check2, index_change, index_sum)
{
	document.getElementById(index_sum).addEventListener('input', function(){
		completeSum(index_check1, index_check2, index_change, index_sum);
	});
	document.getElementById(index_check1).addEventListener('input', function(){
		completeSum(index_check1, index_check2, index_change, index_sum);
	});
	document.getElementById(index_check2).addEventListener('input', function(){
		completeSum(index_check1, index_check2, index_change, index_sum);
	});
}

function completeSum(index_check1, index_check2, index_change, index_sum)
{
	var sumer = parseInt(document.getElementById(index_sum).value);
	var delta1 = parseInt(document.getElementById(index_check1).value);
	var delta2 = parseInt(document.getElementById(index_check2).value);
	
	// check all positive
	if (sumer < 0)
	{
		document.getElementById(index_sum).value = 1;
		sumer = 1;
	}
	if (delta1 < 0)
	{
		document.getElementById(index_check1).value = 1;
		delta1 = 1;
	}
	if (delta2 < 0)
	{
		document.getElementById(index_check2).value = 1;
		delta2 = 1;
	}
	
	if (sumer - delta1 - delta2 < 0)
	{
		document.getElementById(index_check2).value = 0;
		if (sumer - delta1 > 0)
		{
			document.getElementById(index_check2).value = sumer - delta1;
		}
		else
		{
			document.getElementById(index_check1).value = sumer;
			document.getElementById(index_check2).value = 0;
		}
		document.getElementById(index_change).value = 0;
	}
	else
	{
		document.getElementById(index_change).value = sumer - delta1 - delta2;
	}
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

/*
	This function starts the simulation multiple time such that it change the amount of adults and children change there location
*/
function startMaskAnalysis()
{
	is_mask = true;
	is_working_hours = false;
	is_schooling_hours = false;
	is_mask_and_hours = false;
	is_mask_and_hours_random = false;
	is_schooling_working_hours = false;
	is_event_analysis = false;
	
	mask_good_step_size = parseInt(document.getElementById("mask_good_step_size").value);
	mask_bad_step_size = parseInt(document.getElementById("mask_bad_step_size").value);
	
	return multi_run_perform();
}

function startWorkingHoursAnalysis()
{
	is_mask = false;
	is_working_hours = true;
	is_schooling_hours = false;
	is_mask_and_hours = false;
	is_mask_and_hours_random = false;
	is_schooling_working_hours = false;
	is_event_analysis = false;
	
	document.getElementById("time_at_home_a").value = 0;
	
	return multi_run_perform();
}

function startSchoolingHoursAnalysis()
{
	is_mask = false;
	is_working_hours = false;
	is_schooling_hours = true;
	is_mask_and_hours = false;
	is_mask_and_hours_random = false;
	is_schooling_working_hours = false;
	is_event_analysis = false;
	
	document.getElementById("time_at_home_c").value = 0;
	
	return multi_run_perform();
}

function startSchoolingWorkingHoursAnalysis()
{
	is_mask = false;
	is_working_hours = false;
	is_schooling_hours = false;
	is_mask_and_hours = false;
	is_mask_and_hours_random = false;
	is_schooling_working_hours = true;
	is_event_analysis = false;
	
	document.getElementById("time_at_home_a").value = 0;
	document.getElementById("time_at_home_c").value = 0;
	
	return multi_run_perform();
}

function startMaskAndHoursAnalysis()
{
	is_mask = false;
	is_working_hours = false;
	is_schooling_hours = false;
	is_mask_and_hours = true;
	is_mask_and_hours_random = false;
	is_schooling_working_hours = false;
	is_event_analysis = false;
	
	mask_good_step_size = parseInt(document.getElementById("mask_good_step_size").value);
	mask_bad_step_size = parseInt(document.getElementById("mask_bad_step_size").value);
	document.getElementById("time_at_home_a").value = 0;
	document.getElementById("time_at_home_c").value = 0;
	
	return multi_run_perform();
}

function startMaskAndHoursAnalysisRandom()
{
	is_mask = false;
	is_working_hours = false;
	is_schooling_hours = false;
	is_mask_and_hours = false;
	is_mask_and_hours_random = true;
	is_schooling_working_hours = false;
	is_event_analysis = false;
	
	max_tries_analysis = parseInt(document.getElementById("max_tries_analysis").value);
	mask_bad_step_size = parseInt(document.getElementById("mask_bad_step_size").value);
	mask_bad_step_size = parseInt(document.getElementById("mask_bad_step_size").value);
	document.getElementById("time_at_home_a").value = 0;
	document.getElementById("time_at_home_c").value = 0;
	
	return multi_run_perform();
}

function startEventsAnalysis()
{
	is_mask = false;
	is_working_hours = false;
	is_schooling_hours = false;
	is_mask_and_hours = false;
	is_mask_and_hours_random = false;
	is_schooling_working_hours = false;
	is_event_analysis = true;
	
	max_pop_event = parseInt(document.getElementById("max_pop_event").value);
	step_pop_event = parseInt(document.getElementById("step_pop_event").value);
	event_rate_max = parseInt(document.getElementById("event_rate_max").value);
	event_rate_step = parseInt(document.getElementById("event_rate_step").value);
	
	document.getElementById("event_size").value = step_pop_event;
	document.getElementById("event_rate_days").value = 1;
	
	return multi_run_perform();
}


/* multi runs functions helpers */

function multi_run_perform()
{
	multi_run_settings();
	
	// get the data needed to run
	load_pop_size();
	
	// run overall simulation
	startSimulation(false);
	
	reset_pop_size();
	
	return false;
}

function multi_run_settings()
{
	// don't show action buttons
	document.getElementById("playBtn").style.display = "none";
	document.getElementById("pauseBtn").style.display = "none";
	// avoid last alert
	showFinishAlert = false;
	
	// change the save ratio and and fps
	document.getElementById("fps").value = 48;
	document.getElementById("graph_samples").value = 6;
}

function reset_pop_size()
{
	// reset the original sizes
	document.getElementById("adult_pop_size").value = adult_pop_size;
	document.getElementById("susceptible_adults_percent").value = susceptible_adults_amount;
	document.getElementById("infected_adults_percent").value = infected_adults_amount;
	document.getElementById("recover_adults_percent").value = recover_adults_amount;
	document.getElementById("children_pop_size").value = children_pop_size;
	document.getElementById("susceptible_children_percent").value = susceptible_children_percent;
	document.getElementById("infected_children_percent").value = infected_children_percent;
	document.getElementById("recover_children_percent").value = recover_children_percent;
}

function load_pop_size()
{	
	adult_pop_size = parseInt(document.getElementById("adult_pop_size").value);
	susceptible_adults_amount = parseInt(document.getElementById("susceptible_adults_percent").value);
	infected_adults_amount = parseInt(document.getElementById("infected_adults_percent").value);
	recover_adults_amount = parseInt(document.getElementById("recover_adults_percent").value);
	children_pop_size = parseInt(document.getElementById("children_pop_size").value);
	susceptible_children_amount = parseInt(document.getElementById("susceptible_children_percent").value);
	infected_children_amount = parseInt(document.getElementById("infected_children_percent").value);
	recover_children_amount = parseInt(document.getElementById("recover_children_percent").value);
}

/* end - multi runs functions helpers */


// start the simulation and show it, hide the form 
function startSimulation(dramatic)
{
	// read all the data from the huge form 
	/* Initial population size */
	
	adult_pop_size = parseInt(document.getElementById("adult_pop_size").value);
	susceptible_adults_percent = parseInt(document.getElementById("susceptible_adults_percent").value);
	infected_adults_percent = parseInt(document.getElementById("infected_adults_percent").value);
	recover_adults_percent = parseInt(document.getElementById("recover_adults_percent").value);
	children_pop_size = parseInt(document.getElementById("children_pop_size").value);
	susceptible_children_amount = parseInt(document.getElementById("susceptible_children_percent").value);
	infected_children_amount = parseInt(document.getElementById("infected_children_percent").value);
	recover_children_amount = parseInt(document.getElementById("recover_children_percent").value);
	
	/* Infection rates */
	a_a_t_c = parseInt(document.getElementById("a_a_t_c").value) / 100;
	a_c_t_c = parseInt(document.getElementById("a_c_t_c").value) / 100;
	c_a_t_c = parseInt(document.getElementById("c_a_t_c").value) / 100;
	c_c_t_c = parseInt(document.getElementById("c_c_t_c").value) / 100;
	
	/* Day-Night dynamics */
	time_not_at_home_a = parseInt(document.getElementById("time_not_at_home_a").value);
	time_not_at_home_c = parseInt(document.getElementById("time_not_at_home_c").value);
	
	if (!(time_at_home_a == 0 && time_at_home_c == 0))
	{
		time_at_home_c = parseInt(document.getElementById("time_at_home_c").value);
		time_at_home_a = parseInt(document.getElementById("time_at_home_a").value);
	}
	
	// symptomatic chance
	symptomatic_adults_chance = parseFloat(document.getElementById("symptomatic_adults").value) / 100;
	symptomatic_children_chance = parseFloat(document.getElementById("symptomatic_child").value) / 100;
	
	// symptomatic chance
	percent_symptomatic_goto_work = parseFloat(document.getElementById("percent_symptomatic_goto_work").value) / 100;
	percent_symptomatic_goto_school = parseFloat(document.getElementById("percent_symptomatic_goto_school").value) / 100;
	
	/* Recover durations and rates */
	
	infected_to_recover_time_adult = parseInt(document.getElementById("infected_to_recover_time_adult").value);
	infected_to_recover_time_children = parseInt(document.getElementById("infected_to_recover_time_children").value);
	prc = parseInt(document.getElementById("prc").value) / 100;
	pra = parseInt(document.getElementById("pra").value) / 100;
	
	/* Day of the week dynamics */
	
	var shabat_element = document.getElementById("rest_in_shabat");
	rest_in_shabat = (shabat_element.options[shabat_element.selectedIndex].value == "1");
	go_to_school_k_days = parseInt(document.getElementById("go_to_school_k_days").value);
	go_to_work_k_days = parseInt(document.getElementById("go_to_work_k_days").value);
	
	/* masks */
	
	init_percent_good_masks = parseFloat(document.getElementById("init_percent_good_masks").value) / 100;
	init_percent_bad_masks = parseFloat(document.getElementById("init_percent_bad_masks").value) / 100;
	
	good_mask_two_side = parseFloat(document.getElementById("good_mask_two_side").value) / 100;
	good_mask_infected_side = parseFloat(document.getElementById("good_mask_infected_side").value) / 100;
	good_mask_not_infected_side = parseFloat(document.getElementById("good_mask_not_infected_side").value) / 100;
	
	bad_mask_two_side = parseFloat(document.getElementById("bad_mask_two_side").value) / 100;
	bad_mask_infected_side = parseFloat(document.getElementById("bad_mask_infected_side").value) / 100;
	bad_mask_not_infected_side = parseFloat(document.getElementById("bad_mask_not_infected_side").value) / 100;
	
	bad_infected_good_susceptible = parseFloat(document.getElementById("bad_infected_good_susceptible").value) / 100;
	good_infected_bad_susceptible = parseFloat(document.getElementById("good_infected_bad_susceptible").value) / 100;
	
	// events parameters //
	
	event_size = parseInt(document.getElementById("event_size").value);
	event_rate_days = parseInt(document.getElementById("event_rate_days").value);
	
	/* Simulation run hyper-parameters */
	
	fps = parseInt(document.getElementById("fps").value);
	graph_sample = parseInt(document.getElementById("graph_samples").value);
	
	frameRate(fps);
	go_to_work_percent = 100;
	go_to_school_percent = 100;
	
	// create population to simulate
	population = new Population(adult_pop_size,
								susceptible_adults_percent,
								infected_adults_percent,
								recover_adults_percent,
								children_pop_size, 
								susceptible_children_amount, 
								infected_children_amount,
								recover_children_amount);
								
	// GUI changes			
	document.getElementById("init_form").style.display = "none"; // close the init form
	document.getElementById("main").style.display = ""; // show the main window
	
	
	// wait a second before starting - just for dramatic effect 
	// let the run start and the draw funtion working
	if (dramatic)
	{
		setTimeout(() => { runStarted = true; loop(); }, 1000);
	}
	else
	{
		runStarted = true;
		loop();
	}
	
	// prevent the form to send something and by that break the page
	return false;
}