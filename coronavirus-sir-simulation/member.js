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
	constructor(age_group, state = STATE_S, location = LOC_HOME)
	{
		this.state = state;
		this.age_group = age_group;
		this.location = location;
	}
	
	infect()
	{
		this.status = STATE_I;
	}
	
	infect()
	{
		this.status = STATE_I;
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
}