/* simulator cosnts */
let STEP_TIME_INTERVAL = 15;
/* end - simulator cosnts */

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
		this.statesNormalizedBarGraphData = [];
		
		// simulator paramaters members //
		this.a_a_t_c;
		this.c_a_t_c;
		this.a_c_t_c;
		this.c_c_t_c;
		this.adult_asymptomatic;
		this.children_asymptomatic;
		this.infected_to_recover_time_adult;
		this.infected_to_recover_time_children;
		this.infected_to_recover_chance_adult;
		this.infected_to_recover_chance_children;
		this.exposed_to_infected_time_adult;
		this.exposed_to_infected_time_children;
		
		// meta propertise from the json data
		this.hyperJumpTime;
	}
		
	// start the simulation and show it, hide the form 
	startSimulation()
	{	
		// TODO: load the data from the form and the json file
		this.a_a_t_c = this.limitFix(parseFloat(document.getElementById("a_a_t_c").value));
		this.c_a_t_c = this.limitFix(parseFloat(document.getElementById("c_a_t_c").value));
		this.a_c_t_c = this.limitFix(parseFloat(document.getElementById("a_c_t_c").value));
		this.c_c_t_c = this.limitFix(parseFloat(document.getElementById("c_c_t_c").value));
		
		this.adult_asymptomatic = this.limitFix(parseFloat(document.getElementById("adult_asymptomatic").value));
		this.children_asymptomatic = this.limitFix(parseFloat(document.getElementById("children_asymptomatic").value));
		
		this.infected_to_recover_time_adult = HOUR * this.limitFix(parseFloat(document.getElementById("infected_to_recover_time_adult").value), 1,  24*365);
		this.infected_to_recover_time_children = HOUR * this.limitFix(parseFloat(document.getElementById("infected_to_recover_time_children").value), 1, 24*365);
		this.infected_to_recover_chance_adult = this.limitFix(parseFloat(document.getElementById("infected_to_recover_chance_adult").value));
		this.infected_to_recover_chance_children = this.limitFix(parseFloat(document.getElementById("infected_to_recover_chance_children").value));
		
		this.exposed_to_infected_time_adult = HOUR * this.limitFix(parseFloat(document.getElementById("exposed_to_infected_time_adult").value), 1,  24*365);
		this.exposed_to_infected_time_children = HOUR * this.limitFix(parseFloat(document.getElementById("exposed_to_infected_time_children").value), 1, 24*365);
		
		try
		{
			this.population.buildPopulationFromFile(uploadJsonContent["population"]);
			this.indoor.buildGraphFromFile(uploadJsonContent["indoor"]);	
		}
		catch (error)
		{
			throw "Cannot build simulator from the data provided in the file - please make sure format is right and all the data provided with the inner error: " + error;
		}
		
		// find meta propertise
		var maxOutValue = 0;
		for (var memberIndex = 0; memberIndex < this.population.members.length; memberIndex++)
		{
			var memberDayPlan = this.population.members[memberIndex].dayPlan;
			for (var i = 0; i < memberDayPlan.length; i++)
			{
				if (memberDayPlan[i][0] == 0 && maxOutValue < memberDayPlan[i][1])
				{
					maxOutValue = memberDayPlan[i][1];
				}
			}
			
			// not right place but optimize the number of times we run on the population //
			// allocate population to the graph
			try
			{
				if (this.population.members[memberIndex].location != 0)
				{
					this.indoor.nodes[this.population.members[memberIndex].location - 1].populationCount++;		
				}
			}
			catch (error)
			{
				console.log("Error allocating individual: " + this.population.members[memberIndex].toString());
			}
		}
		this.hyperJumpTime = maxOutValue;
		
		// update the graph data
		this.updateStatesGraphData();
		
		// set all the needed data into the table
		var popDist = this.population.countStatusDestrebution();
		document.getElementById("param_s_a").innerHTML = popDist["a_s"];
		document.getElementById("param_e_a").innerHTML = popDist["a_e"];
		document.getElementById("param_is_a").innerHTML = popDist["a_si"];
		document.getElementById("param_is_a").innerHTML = popDist["a_ai"];
		document.getElementById("param_r_a").innerHTML = popDist["a_r"];
		document.getElementById("param_s_c").innerHTML = popDist["c_s"];
		document.getElementById("param_e_c").innerHTML = popDist["c_e"];
		document.getElementById("param_is_c").innerHTML = popDist["c_si"];
		document.getElementById("param_ia_c").innerHTML = popDist["c_ai"];
		document.getElementById("param_r_c").innerHTML = popDist["c_r"];
		
		document.getElementById("param_a_a_t_c").innerHTML = this.a_a_t_c;
		document.getElementById("param_c_a_t_c").innerHTML = this.c_a_t_c;
		document.getElementById("param_a_c_t_c").innerHTML = this.a_c_t_c;
		document.getElementById("param_c_c_t_c").innerHTML = this.c_c_t_c;
		
		document.getElementById("param_a_asyptomatic_rate").innerHTML = this.adult_asymptomatic;
		document.getElementById("param_c_asyptomatic_rate").innerHTML = this.children_asymptomatic;
		
		document.getElementById("param_recovery_duration_a").innerHTML = this.infected_to_recover_time_adult;
		document.getElementById("param_recovery_chance_a").innerHTML = this.infected_to_recover_chance_adult;
		document.getElementById("param_recovery_duration_c").innerHTML = this.infected_to_recover_time_children;
		document.getElementById("param_recovery_chance_c").innerHTML = this.infected_to_recover_chance_children;
		
		document.getElementById("param_exposed_to_infected_time_adult").innerHTML = this.exposed_to_infected_time_adult;
		document.getElementById("param_exposed_to_infected_time_children").innerHTML = this.exposed_to_infected_time_children;
	}
	
	// make sure the simulator is empty for next run
	clear()
	{
		// re allocate anything empty again 
		this.population = new Population();
		this.indoor = new Graph();
		this.time = 0;
		
		// graph related members //
		this.statesGraphData = [];
	}
	
	// main loop of the simulation logic
	step()
	{
		// if weekend - just jump the day
		if (Math.floor(this.time / DAY) % 7 == 0 && this.time != 0)
		{
			this.hyperJumpStep();
		}
		// check if the day in this building is over and we can calculate what happens outside the building using hyper jump in time
		else if (this.time - Math.floor(this.time / DAY) * DAY >= this.hyperJumpTime)
		{
			this.hyperJumpStep();
		}
		else
		{
			this.normalStep();
		}
	}
	
	// perform a step when everybody at home and we assume nothing change their except the time they are in the same state
	hyperJumpStep()
	{
		// find the jump size 
		var day = Math.floor(this.time / DAY);
		var deltaTime = (day + 1) * DAY - this.time;
		
		// stohasticly change states
		for (var memberIndex = 0; memberIndex < this.population.members.length; memberIndex++)
		{
			var member = this.population.members[memberIndex];
			// update member's time
			member.addTime(deltaTime);
			
			// check if move from I^s or I^a to R or D
			member.tryRecover(this.infected_to_recover_time_adult,
							this.infected_to_recover_time_children,
							this.infected_to_recover_chance_adult,
							this.infected_to_recover_chance_children,
							this.exposed_to_infected_time_adult,
							this.exposed_to_infected_time_children);
			
			// move person around
			var memberFromToLocation = this.population.members[memberIndex].moveAround(this.time % DAY);
			this.indoor.updateMemberLocation(memberFromToLocation); // let the graph know that
		}
		
		// update the time to the next day
		this.time += deltaTime;
	}
	
	// perform the full step of population interactions and moving inside the building
	normalStep()
	{
		var timeOfTheDay = this.time % DAY;
		// run on each individual and perform some logic
		for (var memberIndex = 0; memberIndex < this.population.members.length; memberIndex++)
		{
			// find member and count event
			var member = this.population.members[memberIndex];
			member.addTime(STEP_TIME_INTERVAL);
		
			// check if move from I^s or I^a to R or D
			member.tryRecover(this.infected_to_recover_time_adult,
								this.infected_to_recover_time_children,
								this.infected_to_recover_chance_adult,
								this.infected_to_recover_chance_children,
								this.exposed_to_infected_time_adult,
								this.exposed_to_infected_time_children);
			
			// move person around
			var memberFromToLocation = member.moveAround(timeOfTheDay);
			this.indoor.updateMemberLocation(memberFromToLocation); // let the graph know that
			
			// try to infected if needed... recover and dead does not change, infected handled already in the last step, just manage STATE_S
			if (member.state == STATE_S)
			{
				// TODO: do better, find inside a population
				// pick in random a person to meet within the population
				var meetMemeber = this.population.members[Math.floor(Math.random() * this.population.size())];
				
				// we tried hard, but did not find anyone we want 
				if (meetMemeber.location != member.location || !([STATE_AI, STATE_SI].includes(meetMemeber.state)))
				{
					continue;
				}
				
				// get the infection chance for this meeting
				let infectChance = Math.random();
				
				// check the location the members are at, if it change something
				var roomDensity = this.indoor.getNodeDensity(member.location - 1);
				
				// TODO: add later the masks logic
				/*
				// reduce by masks 
				if (member.age != CHILD && meetMemeber.age != CHILD) // this will work if both sides are adults
				{
					// recall: member is STATE_S and meetMemeber is STATE_AI or STATE_SI
					if (member.age == ADULT && meetMemeber.age == ADULT)
					{
						infectChance /= 1;
					}
					else if (member.age == ADULT_GOOD_MASK && meetMemeber.age == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_mask_two_side);
					}
					else if (member.age == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_mask_not_infected_side);
					}
					else if (meetMemeber.age == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_mask_infected_side);
					}
					else if (member.age == ADULT_BAD_MASK && meetMemeber.age == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_mask_two_side);
					}
					else if (member.age == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_mask_not_infected_side);
					}
					else if (meetMemeber.age == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_mask_infected_side);
					}
					else if (member.age == ADULT_GOOD_MASK && meetMemeber.age == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_infected_good_susceptible);
					}
					else if (member.age == ADULT_BAD_MASK && meetMemeber.age == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_infected_bad_susceptible);
					}
				}
				*/
				
				if ((infectChance < this.a_a_t_c && member.age != CHILD && meetMemeber.age != CHILD) || 
					(infectChance < this.a_c_t_c && member.age != CHILD && meetMemeber.age == CHILD) || 
					(infectChance < this.c_a_t_c && member.age == CHILD && meetMemeber.age != CHILD) || 
					(infectChance < this.c_c_t_c && member.age == CHILD && meetMemeber.age == CHILD))
				{
					this.population.members[memberIndex].infect(this.adult_asymptomatic, this.children_asymptomatic);	
				}
			}
		}
		
		// update the state time (in minutes resolution)
		this.time += STEP_TIME_INTERVAL;
	}
	
	// print to a canvas the indoor stracture
	printIndoor()
	{
		// draw the in door
		this.indoor.print();
	}
	
	// print the population data
	print(locationInfoToShow = 1)
	{	
		// update the simulation time view
		var day = Math.floor(this.time / DAY);
		var hours = Math.floor((this.time - day * DAY) / HOUR);
		var minutes = Math.floor(this.time - day * DAY - hours * HOUR);
		document.getElementById("clock").innerHTML = "Day: " + day + ", Hour: " + hours + ", Minutes: " + minutes;
		
		// update the table with the states in each step
		var popDist = this.population.countStatusDestrebution();
		document.getElementById("now_a_s").innerHTML = popDist["a_s"];
		document.getElementById("now_a_e").innerHTML = popDist["a_e"];
		document.getElementById("now_a_is").innerHTML = popDist["a_si"];
		document.getElementById("now_a_ia").innerHTML = popDist["a_ai"];
		document.getElementById("now_a_r").innerHTML = popDist["a_r"];
		document.getElementById("now_a_d").innerHTML = popDist["a_d"];
		document.getElementById("now_c_s").innerHTML = popDist["c_s"];
		document.getElementById("now_c_e").innerHTML = popDist["c_e"];
		document.getElementById("now_c_is").innerHTML = popDist["c_si"];
		document.getElementById("now_c_ia").innerHTML = popDist["c_ai"];
		document.getElementById("now_c_r").innerHTML = popDist["c_r"];
		document.getElementById("now_c_d").innerHTML = popDist["c_d"];
		
		// update the card for a spesific node
		var popDist = this.population.countStatusDestrebutionInLocation(locationInfoToShow);
		document.getElementById("this_node_name").innerHTML = "Distrebution in " + this.indoor.getNodeName(locationInfoToShow);
		document.getElementById("this_a_s").innerHTML = popDist["a_s"];
		document.getElementById("this_a_e").innerHTML = popDist["a_e"];
		document.getElementById("this_a_is").innerHTML = popDist["a_si"];
		document.getElementById("this_a_ia").innerHTML = popDist["a_ai"];
		document.getElementById("this_a_r").innerHTML = popDist["a_r"];
		document.getElementById("this_a_d").innerHTML = popDist["a_d"];
		document.getElementById("this_c_s").innerHTML = popDist["c_s"];
		document.getElementById("this_c_e").innerHTML = popDist["c_e"];
		document.getElementById("this_c_is").innerHTML = popDist["c_si"];
		document.getElementById("this_c_ia").innerHTML = popDist["c_ai"];
		document.getElementById("this_c_r").innerHTML = popDist["c_r"];
		document.getElementById("this_c_d").innerHTML = popDist["c_d"];
		
		
		// print distrebution of the population in rooms graph
		drawDistrebutionPerLocationGraph(this.indoor.getPopulationDistrebution(this.population.size()));
	}
	
	// get the data about the pop distrebution in some location
	getLocationInfo(locationId)
	{
		return this.population.countStatusDestrebutionInLocation(locationId);
	}
	
	
	// check if the pandemic is over
	is_over()
	{
		var stats = this.population.countStatusDestrebution();
		return (stats["a_si"] + stats["a_ai"] + stats["c_si"] + stats["c_ai"] + stats["c_e"] + stats["a_e"]) == 0;
	}
	
	toJson()
	{
		var answer = {
			"distrebution": this.statesGraphData,
			"a_a_t_c": this.a_a_t_c,
			"c_a_t_c": this.c_a_t_c,
			"a_c_t_c": this.a_c_t_c,
			"c_c_t_c": this.c_c_t_c,
			"adult_asymptomatic": this.adult_asymptomatic,
			"children_asymptomatic": this.children_asymptomatic,
			"infected_to_recover_time_adult": this.infected_to_recover_time_adult,
			"infected_to_recover_time_children": this.infected_to_recover_time_children,
			"infected_to_recover_chance_adult": this.infected_to_recover_chance_adult,
			"infected_to_recover_chance_children": this.infected_to_recover_chance_children,
			"exposed_to_infected_time_adult": this.exposed_to_infected_time_adult,
			"exposed_to_infected_time_children": this.exposed_to_infected_time_children
			}
		return JSON.stringify(answer);
	}
	
	// help functions //
	
	/* update the graph's data from the model */
	updateStatesGraphData()
	{
		var popDist = this.population.countStatusDestrebution();
		
		// get the data for the non-normalized distrebution over time
		var counts = [popDist["a_s"], popDist["a_e"], popDist["a_si"], popDist["a_ai"], popDist["a_r"], popDist["a_d"], popDist["c_s"], popDist["c_e"], popDist["c_si"], popDist["c_ai"], popDist["c_r"], popDist["c_d"]];
		var graphValues = [this.time / DAY];
		graphValues.push(...counts);
		this.statesGraphData.push(graphValues);
		
		// get the data about the pop normalized distrebution in some location as vector 
		var sum = 0;
		for (var i = 0; i < counts.length; i++)
		{
			sum += counts[i];
		}
		if (sum > 0)
		{
			for (var i = 0; i < counts.length; i++)
			{
				counts[i] = counts[i] * 100 / sum;
			}	
		}
		this.statesNormalizedBarGraphData = counts;
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