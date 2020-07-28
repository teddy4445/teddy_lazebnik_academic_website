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
function startVaccineSimulation()
{
	// don't show action buttons
	document.getElementById("playBtn").style.display = "none";
	document.getElementById("pauseBtn").style.display = "none";
	// avoid last alert
	showFinishAlert = false;
	
	// run simulation and change recovered each time
	adult_recover = 0;
	child_recover = 0;
	
	// get the data needed to run
	adult_pop_size = parseInt(document.getElementById("adult_pop_size").value);
	adult_step_size = parseInt(document.getElementById("adult_recover_step").value);
	children_pop_size = parseInt(document.getElementById("children_pop_size").value);
	child_step_size = parseInt(document.getElementById("children_recover_step").value);
	
	// change the save ratio and and fps
	document.getElementById("fps").value = 48;
	document.getElementById("graph_samples").value = 6;
	
	// run overall simulation
	startSimulation(false);
	
	// reset the original sizes
	document.getElementById("susceptible_adults_percent").value = adult_pop_size - 1;
	document.getElementById("infected_adults_percent").value = 1;
	document.getElementById("recover_adults_percent").value = 0;
	document.getElementById("susceptible_children_percent").value = children_pop_size - 1;
	document.getElementById("infected_children_percent").value = 1;
	document.getElementById("recover_children_percent").value = 0;
	
	return false;
}

// start the simulation and show it, hide the form 
function startSimulation(dramatic)
{	
	// load all the data from the user
	var adult_pop_size = parseInt(document.getElementById("adult_pop_size").value);
	var susceptible_adults_amount = parseInt(document.getElementById("susceptible_adults_percent").value);
	var infected_adults_amount = parseInt(document.getElementById("infected_adults_percent").value);
	var recover_adults_amount = parseInt(document.getElementById("recover_adults_percent").value);
	var children_pop_size = parseInt(document.getElementById("children_pop_size").value);
	var susceptible_children_amount = parseInt(document.getElementById("susceptible_children_percent").value);
	var infected_children_amount = parseInt(document.getElementById("infected_children_percent").value);
	var recover_children_amount = parseInt(document.getElementById("recover_children_percent").value);
	infected_to_recover_time = parseInt(document.getElementById("infected_to_recover_time").value);
	a_a_t_c = parseInt(document.getElementById("a_a_t_c").value) / 100;
	a_c_t_c = parseInt(document.getElementById("a_c_t_c").value) / 100;
	c_c_t_c = parseInt(document.getElementById("c_c_t_c").value) / 100;
	c_a_t_c = parseInt(document.getElementById("c_a_t_c").value) / 100;
	a_c_meeting_count = parseInt(document.getElementById("a_c_meeting_count").value) / 24;
	a_a_meeting_count = parseInt(document.getElementById("a_a_meeting_count").value) / 24;
	c_c_meeting_count = parseInt(document.getElementById("c_c_meeting_count").value) / 24;
	time_at_home = parseInt(document.getElementById("time_at_home").value);
	time_not_at_home = parseInt(document.getElementById("time_not_at_home").value);
	
	fps = parseInt(document.getElementById("fps").value);
	graph_sample = parseInt(document.getElementById("graph_samples").value);
	
	frameRate(fps);
	
	// create population to simulate
	population = new Population(adult_pop_size,
								susceptible_adults_amount,
								infected_adults_amount,
								recover_adults_amount,
								children_pop_size, 
								susceptible_children_amount, 
								infected_children_amount,
								recover_children_amount);
								
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