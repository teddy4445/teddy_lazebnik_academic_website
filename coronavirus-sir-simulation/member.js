let ADULT = 1;
let CHILD = 2;

let STATE_S = 1;
let STATE_I = 2;
let STATE_R = 3;

let LOC_HOME = 1;
let LOC_WORK = 2;
let LOC_SCHOOL = 3;

class Member
{
	constructor(age_group, state = STATE_S, location = LOC_HOME, state_time = 0)
	{
		this.state = state;
		this.state_time = state_time;
		this.age_group = age_group;
		this.location = location;
	}
	
	infect()
	{
		this.status = STATE_I;
		this.state_time = 0;
	}
	
	recover()
	{
		this.status = STATE_R;
		this.state_time = 0;
	}
	
	tic()
	{
		this.state_time++;
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
		else if (this.state == STATE_I)
		{
			answer += "_i";
		}
		else // STATE_R
		{
			answer += "_r";
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
}