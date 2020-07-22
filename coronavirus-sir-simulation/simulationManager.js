function completePercent(index1, index2, delta)
{
	document.getElementById(index1).addEventListener('input', function(){
		document.getElementById(index2).value = delta - parseInt(document.getElementById(index1).value);
	});
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

// start the simulation and show it, hide the form 
function startSimulation()
{	
	// load all the data from the user
	var adult_pop_size = parseInt(document.getElementById("adult_pop_size").value);
	var susceptible_adults_percent = parseInt(document.getElementById("susceptible_adults_percent").value);
	var infected_adults_percent = parseInt(document.getElementById("infected_adults_percent").value);
	var children_pop_size = parseInt(document.getElementById("children_pop_size").value);
	var susceptible_children_percent = parseInt(document.getElementById("susceptible_children_percent").value);
	var infected_children_percent = parseInt(document.getElementById("infected_children_percent").value);
	infected_to_recover_time = parseInt(document.getElementById("infected_to_recover_time").value);
	a_a_t_c = parseInt(document.getElementById("a_a_t_c").value);
	a_c_t_c = parseInt(document.getElementById("a_c_t_c").value);
	c_c_t_c = parseInt(document.getElementById("c_c_t_c").value);
	c_a_t_c = parseInt(document.getElementById("c_a_t_c").value);
	time_at_home = parseInt(document.getElementById("time_at_home").value);
	time_not_at_home = parseInt(document.getElementById("time_not_at_home").value);
	
	// create population to simulate
	population = new Population(adult_pop_size,
								susceptible_adults_percent,
								infected_adults_percent,
								0,
								children_pop_size, 
								susceptible_children_percent, 
								infected_children_percent,
								0);
								
	document.getElementById("init_form").style.display = "none"; // close the init form
	document.getElementById("main").style.display = ""; // show the main window
	
	
	// wait a second before starting - just for dramatic effect 
	// let the run start and the draw funtion working
	setTimeout(() => { runStarted = true; loop(); }, 1000);
	
	// prevent the form to send something and by that break the page
	return false;
}