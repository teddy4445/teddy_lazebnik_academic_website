class Population
{
	constructor(adult_population, adult_s_percent, adult_i_percent, adult_r_percent, children_population, children_s_percent, children_i_percent, children_r_percent)
	{
		this.members = [];
		
		// add adult population
		for (var i = 0; i < Math.round(adult_population * adult_s_percent / 100); i++)
		{
			this.members.push(new Member(ADULT, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(adult_population * adult_i_percent / 100); i++)
		{
			this.members.push(new Member(ADULT, STATE_I, LOC_HOME));
		}
		for (var i = 0; i < Math.round(adult_population * adult_r_percent / 100); i++)
		{
			this.members.push(new Member(ADULT, STATE_R, LOC_HOME));
		}
		
		// add children population
		for (var i = 0; i < Math.round(children_population * children_s_percent / 100); i++)
		{
			this.members.push(new Member(CHILD, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(children_population * children_i_percent / 100); i++)
		{
			this.members.push(new Member(CHILD, STATE_I, LOC_HOME));
		}
		for (var i = 0; i < Math.round(children_population * children_r_percent / 100); i++)
		{
			this.members.push(new Member(CHILD, STATE_R, LOC_HOME));
		}
	}
	
	clear()
	{
		this.members = [];
	}
	
	run(chance_aa, chance_ac, chance_ca, chance_cc, infected_to_recover_time)
	{
		// TODO: make later the simulation logic
		// 0. stohasticly move them around (with day - night circle)
		// 1. find how many numbers in each group -> location, age, state
		// 2. find how many tranforms should be performed in each group
		// 3. pick members from each group and tranforms them 
	}
	
	countStatusDestrebution() 
	{
		var answer = {"a_i": 0, "a_s": 0, "a_r": 0, "c_i": 0, "c_s": 0, "c_r": 0};
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			var key = this.members[memberIndex].getKey();
			if (answer[key] === undefined)
			{
				answer[key] = 1;
			}
			else
			{
				answer[key]++;
			}
		}
		return answer;
	}
	
	countStatusLocationDestrebution() 
	{
		var answer = {};
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			var key = this.members[memberIndex].getFullKey();
			if (answer[key] === undefined)
			{
				answer[key] = 1;
			}
			else
			{
				answer[key]++;
			}
		}
		return answer;
	}
}