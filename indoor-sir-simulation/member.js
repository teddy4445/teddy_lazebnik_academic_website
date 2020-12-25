// consts //
let ADULT = 1;
let CHILD = 2;

let STATE_S = 1;
let STATE_SI = 2;
let STATE_AI = 3;
let STATE_R = 4;
let STATE_D = 5;

let LOBBY = 0;
// end - consts //

/* An agent (individual) in the population */
class Member
{
	constructor(age_group, state, location, day_plan, state_time = 0)
	{
		// time at each state
		this.state_time = state_time;
		
		// child or adult and epidemic state
		this.state = state;
		this.age_group = age_group;
		
		// the current location
		this.location = location;
		
		this.day_plan = day_plan;
		// where the individual located during the day
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
	
	// STATE CHANGE FUNCTIONS //
	
	// infect individual
	infect()
	{
		if (this.age_group == ADULT) 
		{
			if (Math.random() < adult_asymptomatic)
			{
				this.state = STATE_SI;
			}
			else
			{
				this.state = STATE_AI;
			}	
		}
		else
		{
			if (Math.random() < children_asymptomatic)
			{
				this.state = STATE_SI;
			}
			else
			{
				this.state = STATE_AI;
			}	
		}
		this.state_time = 0;
	}
	
	recover()
	{
		this.state = STATE_R;
		this.state_time = 0;
	}
	
	kill()
	{
		this.state = STATE_D;
		this.state_time = 0;
	}
	
	tic()
	{
		this.state_time++;
	}
	
	tryRecover(infected_to_recover_time_adult, infected_to_recover_time_children)
	{
		if ((this.state_time > infected_to_recover_time_adult && this.state == STATE_SI && this.age_group != CHILD) || (this.state_time > infected_to_recover_time_children && this.state == STATE_SI && this.age_group == CHILD))
		{
			var chance = Math.random();
			if ((this.age_group != CHILD && chance <= pra) || (this.age_group == CHILD && chance <= prc))
			{
				this.recover();	
			}
			else
			{
				this.kill();
			}
		}
		else if ((this.state_time > infected_to_recover_time_adult && this.state == STATE_AI && this.age_group != CHILD) || (this.state_time > infected_to_recover_time_children && this.state == STATE_AI && this.age_group == CHILD))
		{
			this.recover();
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
		if (this.age_group == ADULT)
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
		if (this.age_group == CHILD)
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
		return "<Member | age_group: " + age + ", state: " + state + " (" + this.state_time + " hours)>";
	}
	
	// END - FOR VISUALAZATION //
}