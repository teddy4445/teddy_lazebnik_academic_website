let WORKING_ADULT = 1;
let NONWORKING_ADULT = 2;
let CHILD = 3;

let STATE_S = 1;
let STATE_I = 2;
let STATE_R = 3;
let STATE_D = 4;

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
		this.state = STATE_I;
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
	
	lose_job()
	{
		this.eco_age_group = NONWORKING_ADULT;
	}
	
	get_job()
	{
		this.eco_age_group = WORKING_ADULT;
	}
	
	tic()
	{
		this.state_time++;
	}
	
	tryRecover(infected_to_recover_time_adult, infected_to_recover_time_children)
	{
		// TODO: replace != CHILD with something spesificly related to adults 
		if ((this.state_time > infected_to_recover_time_adult && this.state == STATE_I && this.eco_age_group != CHILD) ||
		(this.state_time > infected_to_recover_time_children && this.state == STATE_I && this.eco_age_group == CHILD))
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
	}
	
	getKey()
	{
		var answer = "";
		if (this.eco_age_group == WORKING_ADULT)
		{
			answer += "wa";
		}
		else if (this.eco_age_group == NONWORKING_ADULT)
		{
			answer += "na";
		}
		else // CHILD
		{
			answer += "c";
		}
		if (this.state == STATE_S)
		{
			answer += "_s";
		}
		else if (this.state == STATE_I)
		{
			answer += "_i";
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
		if (this.state == STATE_I)
		{
			state = "Infected";
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
		return "<Member | eco_age_group: " + age + ", state: " + state + " (" + this.state_time + " hours), location: " + location + ">";
	}
}