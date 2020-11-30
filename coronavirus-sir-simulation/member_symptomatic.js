let ADULT = 1;
let ADULT_GOOD_MASK = 2;
let ADULT_BAD_MASK = 3;
let CHILD = 4;

let STATE_S = 1;
let STATE_SI = 2;
let STATE_AI = 3;
let STATE_R = 4;
let STATE_D = 5;

let LOC_HOME = 1;
let LOC_WORK = 2;
let LOC_SCHOOL = 3;

class Member
{
	constructor(eco_age_group, state = STATE_S, location = LOC_HOME, state_time = 0)
	{
		this.state = state;
		this.state_time = state_time;
		this.eco_age_group = eco_age_group;
		this.location = location;
	}
	
	infect()
	{
		if (this.eco_age_group != CHILD) 
		{
			if (Math.random() < symptomatic_adults_chance)
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
			if (Math.random() < symptomatic_children_chance)
			{
				this.state = STATE_SI;
			}
			else
			{
				this.state = STATE_AI;
			}	
		}
		this.state_time = 0;
		
		switch (this.location)
		{
			case LOC_HOME:
				home_infections++;
				break;
			case LOC_WORK:
				work_infections++;
				break;
			case LOC_SCHOOL:
				school_infections++;
				break;
		}
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
		if ((this.state_time > infected_to_recover_time_adult && this.state == STATE_SI && this.eco_age_group != CHILD) || (this.state_time > infected_to_recover_time_children && this.state == STATE_SI && this.eco_age_group == CHILD))
		{
			var chance = Math.random();
			if ((this.eco_age_group != CHILD && chance <= pra) || (this.eco_age_group == CHILD && chance <= prc))
			{
				this.recover();	
			}
			else
			{
				this.kill();
			}
		}
		else if ((this.state_time > infected_to_recover_time_adult && this.state == STATE_AI && this.eco_age_group != CHILD) || (this.state_time > infected_to_recover_time_children && this.state == STATE_AI && this.eco_age_group == CHILD))
		{
			this.recover();
		}
	}
	
	getKey()
	{
		var answer = "";
		if (this.eco_age_group != CHILD)
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
		var answer = this.getKey();
		if (this.location == LOC_HOME)
		{
			return answer + "_h";
		}
		else if (this.location == LOC_WORK)
		{
			return answer + "_w";
		}
		else // if (this.location == LOC_SCHOOL)
		{
			return answer + "_s";
		}
	}
	
	toString()
	{
		var age = "Adult";
		if (this.eco_age_group == CHILD)
		{
			age = "Child";
		}
		var state = "Susceptible";
		if (this.state == STATE_SI)
		{
			state = "Symptomatic Infected";
		}
		if (this.state == STATE_AI)
		{
			state = "Asymptomatic Infected";
		}
		else if (this.state == STATE_R)
		{
			state = "Recovered";
		}
		var location = "Home";
		if (this.location == LOC_SCHOOL)
		{
			location = "School";
		}
		else if (this.location == LOC_WORK)
		{
			location = "Work";
		}
		return "<Member | age_group: " + age + ", state: " + state + " (" + this.state_time + " hours), location: " + location + ">";
	}
}