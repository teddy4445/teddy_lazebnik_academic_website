/* Manages the overall simulator performance in one place */
class Simulator
{
	constructor()
	{
		// working members //
		this.population = new Population();
		this.indoor = new Graph();
		this.time = 0;
		
		// graph related members //
		this.statesGraphData = [];
		
		// simulator paramaters members //
		this.a_a_t_c;
		this.c_a_t_c;
		this.a_c_t_c;
		this.c_c_t_c;
		this.class_time;
		this.break_time;
		this.adult_asymptomatic;
		this.children_asymptomatic;
		this.infected_to_recover_time_adult;
		this.infected_to_recover_time_children;
		this.infected_to_recover_chance_adult;
		this.infected_to_recover_chance_children;
	}
		
	// start the simulation and show it, hide the form 
	startSimulation()
	{	
		// TODO: load the data from the form and the json file
		this.a_a_t_c = this.limitFix(parseFloat(document.getElementById("a_a_t_c").value));
		this.c_a_t_c = this.limitFix(parseFloat(document.getElementById("c_a_t_c").value));
		this.a_c_t_c = this.limitFix(parseFloat(document.getElementById("a_c_t_c").value));
		this.c_c_t_c = this.limitFix(parseFloat(document.getElementById("c_c_t_c").value));
		
		this.class_time = this.limitFix(parseFloat(document.getElementById("class_time").value), 0, 120);
		this.break_time = this.limitFix(parseFloat(document.getElementById("break_time").value), 0, 60);
		
		this.adult_asymptomatic = this.limitFix(parseFloat(document.getElementById("adult_asymptomatic").value));
		this.children_asymptomatic = this.limitFix(parseFloat(document.getElementById("children_asymptomatic").value));
		
		this.infected_to_recover_time_adult = this.limitFix(parseFloat(document.getElementById("infected_to_recover_time_adult").value), 1,  24*365);
		this.infected_to_recover_time_children = this.limitFix(parseFloat(document.getElementById("infected_to_recover_time_children").value), 1, 24*365);
		this.infected_to_recover_chance_adult = this.limitFix(parseFloat(document.getElementById("infected_to_recover_chance_adult").value));
		this.infected_to_recover_chance_children = this.limitFix(parseFloat(document.getElementById("infected_to_recover_chance_children").value));
		
		try
		{
			this.population.buildPopulationFromFile(uploadJsonContent["population"]);
			this.indoor.buildGraphFromFile(uploadJsonContent["indoor"]);	
		}
		catch (error)
		{
			throw "Cannot build simulator from the data provided in the file - please make sure format is right and all the data provided with the inner error: " + error;
		}
		
		// set all the needed data into the table
		var popDist = this.population.countStatusDestrebution();
		document.getElementById("param_s_a").innerHTML = popDist["a_s"];
		document.getElementById("param_is_a").innerHTML = popDist["a_si"];
		document.getElementById("param_is_a").innerHTML = popDist["a_ai"];
		document.getElementById("param_r_a").innerHTML = popDist["a_r"];
		document.getElementById("param_s_c").innerHTML = popDist["c_s"];
		document.getElementById("param_is_c").innerHTML = popDist["c_si"];
		document.getElementById("param_ia_c").innerHTML = popDist["c_ai"];
		document.getElementById("param_r_c").innerHTML = popDist["c_r"];
		
		document.getElementById("param_a_a_t_c").innerHTML = this.a_a_t_c;
		document.getElementById("param_c_a_t_c").innerHTML = this.c_a_t_c;
		document.getElementById("param_a_c_t_c").innerHTML = this.a_c_t_c;
		document.getElementById("param_c_c_t_c").innerHTML = this.c_c_t_c;
		
		document.getElementById("param_class_time").innerHTML = this.class_time;
		document.getElementById("param_break_time").innerHTML = this.break_time;
		
		document.getElementById("param_a_asyptomatic_rate").innerHTML = this.adult_asymptomatic;
		document.getElementById("param_c_asyptomatic_rate").innerHTML = this.children_asymptomatic;
		
		document.getElementById("param_recovery_duration_a").innerHTML = this.infected_to_recover_time_adult;
		document.getElementById("param_recovery_chance_a").innerHTML = this.infected_to_recover_chance_adult;
		document.getElementById("param_recovery_duration_c").innerHTML = this.infected_to_recover_time_children;
		document.getElementById("param_recovery_chance_c").innerHTML = this.infected_to_recover_chance_children;
	}
	
	// main loop of the simulation logic
	step()
	{
		
	}
	
	// print to a canvas the indoor stracture and the 
	print()
	{
		// draw the in door
		this.indoor.print();
		
		// update the table with the states in each step
		var popDist = this.population.countStatusDestrebution();
		document.getElementById("now_c_s").innerHTML = popDist["a_s"];
		document.getElementById("now_c_is").innerHTML = popDist["a_si"];
		document.getElementById("now_c_ia").innerHTML = popDist["a_ai"];
		document.getElementById("now_c_r").innerHTML = popDist["a_r"];
		document.getElementById("now_c_d").innerHTML = popDist["a_d"];
		document.getElementById("now_a_s").innerHTML = popDist["c_s"];
		document.getElementById("now_a_is").innerHTML = popDist["c_si"];
		document.getElementById("now_a_ia").innerHTML = popDist["c_ai"];
		document.getElementById("now_a_r").innerHTML = popDist["c_r"];
		document.getElementById("now_a_d").innerHTML = popDist["c_d"];
	}
	
	// check if the pandemic is over
	is_over()
	{
		
	}
	
	// help functions //
	
	/* update the graph's data from the model */
	updateStatesGraphData()
	{
		var stats = this.population.countStatusDestrebution();
		
		var graphValues = [this.time];
		Object.keys(stats).forEach(function(key, index) {
			 graphValues.push(stats[key]);
		});
		
		this.statesGraphData.push(graphValues);
	}	
	
	/* help function to limit some value in comfterbale way */
	limitFix(val, minVal = 0, maxVal = 1)
	{
		if (val.toFixed() == "NaN")
		{
			throw "One of the values is not provided or not a number";
		}
		
		if (val > maxVal)
		{
			return maxVal;
		}
		else if (val < minVal)
		{
			return minVal
		}
		return val;
	}
	
	// end - help function //
}