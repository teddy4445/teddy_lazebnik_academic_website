// consts //
let ADULT = 1;
let CHILD = 2;

let STATE_S = 1;
let STATE_SE = 2;
let STATE_AE = 3;
let STATE_SI = 4;
let STATE_AI = 5;
let STATE_R = 6;
let STATE_D = 7;
// end - consts //

/* An agent (individual) in the population */
class Member
{
	constructor(age, 
				state, 
				location, 
				dayPlan, 
				stateTime = 0)
	{
		// time at each state
		this.stateTime = stateTime;
		
		// child or adult and epidemic state
		this.state = state;
		this.age = age;
		
		// the current location
		this.location = location;
		
		// where the individual located during the day - modify to something more easy to use 
		this.dayPlan = [];
		var timeSpent = 0;
		for (var i = 0; i < dayPlan.length; i++)
		{
			this.dayPlan.push([dayPlan[i][0], timeSpent, timeSpent + dayPlan[i][1]]);
			timeSpent += dayPlan[i][1];
		}
	}
	
	static buildFromJson(jsonObj)
	{
		var age;
		switch (jsonObj["age"])
		{
			case "a":
				age = ADULT;
				break;
			case "c":
				age = CHILD;
				break;
			default:
				throw "No proper age value in member json object";
		}
		
		var state;
		switch (jsonObj["state"])
		{
			case "s":
				state = STATE_S;
				break;
			case "se":
				state = STATE_SE;
				break;
			case "ae":
				state = STATE_AE;
				break;
			case "is":
				state = STATE_SI;
				break;
			case "ia":
				state = STATE_AI;
				break;
			case "r":
				state = STATE_R;
				break;
			case "d":
				state = STATE_D;
				break;
			default:
				throw "No proper state value in member json object";
		}
		
		return new Member(age, state, jsonObj["location"], jsonObj["day_plan"]);
	}
	
	// move the member to right location
	moveAround(timeOfDay)
	{
		var fromToMove = [this.location];
		// if the people are dead so they move out of the geometry
		if (this.state != STATE_D)
		{
			for (var i = 0; i < this.dayPlan.length; i++)
			{
				if (this.dayPlan[i][1] <= timeOfDay && timeOfDay < this.dayPlan[i][2])
				{
					this.location = this.dayPlan[i][0];
					break;
				}
			}
		}
		else
		{
			this.location = OUT_OF_GRAPH_LOCATION;
		}
		fromToMove.push(this.location);
		return fromToMove;
	}
	
	// STATE CHANGE FUNCTIONS //
	
	addTime(time)
	{
		this.stateTime += time;
	}
	
	// infect individual
	infect(adult_asymptomatic, children_asymptomatic)
	{
		if (this.age == ADULT) 
		{
			if (Math.random() < adult_asymptomatic)
			{
				this.state = STATE_AE;
			}
			else
			{
				this.state = STATE_SE;
			}	
		}
		else
		{
			if (Math.random() < children_asymptomatic)
			{
				this.state = STATE_AE;
			}
			else
			{
				this.state = STATE_SE;
			}	
		}
		this.stateTime = 0;
	}
	
	// infect individual
	releaseInfection()
	{
		if (this.state == STATE_SE) 
		{
			this.state = STATE_SI;
			this.stateTime = 0;
		}
		else if (this.state == STATE_AE)
		{
			this.state = STATE_AI;
			this.stateTime = 0;	
		}
	}
	
	recover()
	{
		this.state = STATE_R;
		this.stateTime = 0;
	}
	
	kill()
	{
		this.state = STATE_D;
		this.stateTime = 0;
	}
	
	tic()
	{
		this.stateTime++;
	}
	
	tryRecover(infected_to_recover_time_adult,
				infected_to_recover_time_children, 
				pra, 
				prc, 
				exposed_to_infected_time_adult,
				exposed_to_infected_time_children)
	{
		if ((this.stateTime > infected_to_recover_time_adult && this.state == STATE_SI && this.age != CHILD) || (this.stateTime > infected_to_recover_time_children && this.state == STATE_SI && this.age == CHILD))
		{
			var chance = Math.random();
			if ((this.age != CHILD && chance <= pra) || (this.age == CHILD && chance <= prc))
			{
				this.recover();	
			}
			else
			{
				this.kill();
			}
		}
		else if ((this.stateTime > infected_to_recover_time_adult && this.state == STATE_AI && this.age != CHILD) || (this.stateTime > infected_to_recover_time_children && this.state == STATE_AI && this.age == CHILD))
		{
			this.recover();
		}
		
		// for the exposed to infected step 
		if ((this.stateTime > exposed_to_infected_time_adult && this.state == STATE_SE && this.age != CHILD) || (this.stateTime > exposed_to_infected_time_children && this.state == STATE_SE && this.age == CHILD))
		{
			this.releaseInfection();
		}
		else if ((this.stateTime > exposed_to_infected_time_adult && this.state == STATE_AE && this.age != CHILD) || (this.stateTime > exposed_to_infected_time_children && this.state == STATE_AE && this.age == CHILD))
		{
			this.releaseInfection();
		}
	}
	
	// TECHNICAL FUNCTION FOR POPULATION COUNTS //
	
	getLocation()
	{
		return this.location;
	}
	
	getKey()
	{
		var answer = "";
		if (this.age == ADULT)
		{
			answer += "a";
		}
		else // CHILD
		{
			answer += "c";
		}
		if (this.state == STATE_S)
		{
			answer += "_s";
		}
		else if (this.state == STATE_AE || this.state == STATE_SE)
		{
			answer += "_e";
		}
		else if (this.state == STATE_SI)
		{
			answer += "_si";
		}
		else if (this.state == STATE_AI)
		{
			answer += "_ai";
		}
		else if (this.state == STATE_R)
		{
			answer += "_r";
		}
		else // STATE_D
		{
			answer += "_d";
		}
		return answer;
	}
	
	getFullKey()
	{
		return this.getKey() + " " + this.location;
	}
	
	// END - TECHNICAL FUNCTION FOR POPULATION COUNTS //
	
	// FOR VISUALAZATION //
	
	toString()
	{
		var age = "Adult";
		if (this.age == CHILD)
		{
			age = "Child";
		}
		var state = "Susceptible";
		if (this.state == STATE_SI)
		{
			state = "Symptomatic Infected";
		}
		else if (this.state == STATE_AI)
		{
			state = "Asymptomatic Infected";
		}
		else if (this.state == STATE_R)
		{
			state = "Recovered";
		}
		else if (this.state == STATE_D)
		{
			state = "Dead";
		}
		return "<Member | age: " + age + ", state: " + state + " (" + this.stateTime / HOUR + " hours), location: " + this.location + ">";
	}
	
	// END - FOR VISUALAZATION //
}