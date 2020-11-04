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
	This function starts the simulation multiple time such that it creates more and more recovered people in the initial and just run the logic
*/
function startEconomicSimulation()
{
	is_economic = true;
	is_vaccine = false; 
	is_lockdown = false; 
	is_time_analysis = false;
	
	document.getElementById("m").value = 0;
	loss_jobs_rate_step = parseFloat(document.getElementById("m_step").value);
	loss_jobs_rate_max = parseFloat(document.getElementById("m_max").value);
	
	return multi_run_perform();
}

/*
	This function starts the simulation multiple time such that it creates more and more recovered people in the initial and just run the logic
*/
function startVaccineSimulation()
{
	is_economic = false;
	is_vaccine = true;
	is_lockdown = false; 
	is_time_analysis = false;
	
	adult_recover = 0;
	child_recover = 0;
	
	return multi_run_perform();
}

/*
	This function starts the simulation multiple time such that it change the amount of adults and children change there location
*/
function startLockDownSimulation()
{
	is_economic = false;
	is_vaccine = false; 
	is_lockdown = true;
	is_time_analysis = false;
	
	go_to_work_percent_step_size = parseInt(document.getElementById("go_to_work_percent_step_size").value);
	go_to_school_percent_step_size = parseInt(document.getElementById("go_to_school_percent_step_size").value);
	
	return multi_run_perform();
}

/*
	This function starts the simulation multiple time such that it change the time adults and children change there location
*/
function startWorkSchoolTimeSimulation()
{
	is_economic = false;
	is_vaccine = false;
	is_lockdown = false;
	is_time_analysis = true;
	
	time_at_home_a = 0;
	time_at_home_c = 0;
	
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
	document.getElementById("susceptible_working_adults_percent").value = working_adult_pop_size - 1;
	document.getElementById("infected_working_adults_percent").value = 1;
	document.getElementById("recover_working_adults_percent").value = 0;
	document.getElementById("nonworking_adult_pop_size").value = nonworking_adult_pop_size ;
	document.getElementById("infected_nonworking_adults_percent").value = 0;
	document.getElementById("recover_nonworking_adults_percent").value = 0;
	document.getElementById("susceptible_children_percent").value = children_pop_size;
	document.getElementById("infected_children_percent").value = 0;
	document.getElementById("recover_children_percent").value = 0;
}

function load_pop_size()
{
	working_adult_pop_size = parseInt(document.getElementById("working_adult_pop_size").value);
	recover_working_adults_percent = parseInt(document.getElementById("recover_working_adults_percent").value);
	nonworking_adult_pop_size = parseInt(document.getElementById("nonworking_adult_pop_size").value);
	recover_nonworking_adults_percent = parseInt(document.getElementById("recover_nonworking_adults_percent").value);
	recover_nonworking_adults_percent = parseInt(document.getElementById("recover_nonworking_adults_percent").value);
	children_pop_size = parseInt(document.getElementById("children_pop_size").value);
	child_step_size = parseInt(document.getElementById("children_recover_step").value);
}

/* end - multi runs functions helpers */


// start the simulation and show it, hide the form 
function startSimulation(dramatic)
{
	// read all the data from the huge form 
	/* Initial population size */
	
	working_adult_pop_size = parseInt(document.getElementById("working_adult_pop_size").value);
	susceptible_working_adults_percent = parseInt(document.getElementById("susceptible_working_adults_percent").value);
	infected_working_adults_percent = parseInt(document.getElementById("infected_working_adults_percent").value);
	recover_working_adults_percent = parseInt(document.getElementById("recover_working_adults_percent").value);
	
	nonworking_adult_pop_size = parseInt(document.getElementById("nonworking_adult_pop_size").value);
	susceptible_nonworking_adults_percent = parseInt(document.getElementById("susceptible_nonworking_adults_percent").value);
	infected_nonworking_adults_percent = parseInt(document.getElementById("infected_nonworking_adults_percent").value);
	recover_nonworking_adults_percent = parseInt(document.getElementById("recover_nonworking_adults_percent").value);
	
	children_pop_size = parseInt(document.getElementById("children_pop_size").value);
	susceptible_children_amount = parseInt(document.getElementById("susceptible_children_percent").value);
	infected_children_amount = parseInt(document.getElementById("infected_children_percent").value);
	recover_children_amount = parseInt(document.getElementById("recover_children_percent").value);
	
	
	/* Events per hour */
	wa_c_meeting_count = parseInt(document.getElementById("wa_c_meeting_count").value) / 24;
	na_c_meeting_count = parseInt(document.getElementById("na_c_meeting_count").value) / 24;
	wa_wa_meeting_count = parseInt(document.getElementById("wa_wa_meeting_count").value) / 24;
	wa_na_meeting_count = parseInt(document.getElementById("wa_na_meeting_count").value) / 24;
	c_c_meeting_count = parseInt(document.getElementById("c_c_meeting_count").value) / 24;
	na_na_meeting_count = parseInt(document.getElementById("na_na_meeting_count").value) / 24;
	
	/* Infection rates */
	wa_wa_t_c = parseInt(document.getElementById("wa_wa_t_c").value) / 100;
	wa_na_t_c = parseInt(document.getElementById("wa_na_t_c").value) / 100;
	na_wa_t_c = parseInt(document.getElementById("na_wa_t_c").value) / 100;
	na_na_t_c = parseInt(document.getElementById("na_na_t_c").value) / 100;
	wa_c_t_c = parseInt(document.getElementById("wa_c_t_c").value) / 100;
	na_c_t_c = parseInt(document.getElementById("na_c_t_c").value) / 100;
	c_c_t_c = parseInt(document.getElementById("c_c_t_c").value) / 100;
	c_wa_t_c = parseInt(document.getElementById("c_wa_t_c").value) / 100;
	c_na_t_c = parseInt(document.getElementById("c_na_t_c").value) / 100;
	
	
	/* Day-Night dynamics */
	
	time_not_at_home_a = parseInt(document.getElementById("time_not_at_home_a").value);
	time_not_at_home_c = parseInt(document.getElementById("time_not_at_home_c").value);
	
	if (!(time_at_home_a == 0 && time_at_home_c == 0))
	{
		time_at_home_c = parseInt(document.getElementById("time_at_home_c").value);
		time_at_home_a = parseInt(document.getElementById("time_at_home_a").value);
	}
	
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
	
	/* Economical facotors */
	
	e_init = parseInt(document.getElementById("e_init").value);
	loss_jobs_rate = parseFloat(document.getElementById("m").value);
	avg_contribution_to_economic = parseFloat(document.getElementById("e").value) / 186; // working hours per month
	
	/* goverement facotors */
	
	taxes_percent = parseFloat(document.getElementById("taxes").value) / 100;
	
	/* Simulation run hyper-parameters */
	
	fps = parseInt(document.getElementById("fps").value);
	graph_sample = parseInt(document.getElementById("graph_samples").value);
	
	frameRate(fps);
	go_to_work_percent = 100;
	go_to_school_percent = 100;
	
	// create population to simulate
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