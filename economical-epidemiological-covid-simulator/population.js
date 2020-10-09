class Population
{
	constructor(adult_population, adult_s_percent, adult_i_percent, adult_r_percent, children_population, children_s_percent, children_i_percent, children_r_percent)
	{
		this.members = [];
		this.timeOfDay = 0;
		this.days = 0;
		
		// find if percent or size
		var a_s;
		var a_i;
		var a_r;
		var a_d = 0;
		var c_s;
		var c_i;
		var c_r;
		var c_d = 0;
		
		if (adult_s_percent + adult_i_percent + adult_r_percent == 100 && children_s_percent + children_i_percent + children_r_percent == 100)
		{
			a_s = adult_population * adult_s_percent / 100;
			a_i = adult_population * adult_i_percent / 100;
			a_r = adult_population * adult_r_percent / 100;
			c_s = adult_population * children_s_percent / 100;
			c_i = adult_population * children_i_percent / 100;
			c_r = adult_population * children_r_percent / 100;
		}
		else
		{
			a_s = adult_s_percent;
			a_i = adult_i_percent;
			a_r = adult_r_percent;
			c_s = children_s_percent;
			c_i = children_i_percent;
			c_r = children_r_percent;
		}
		
		// add adult population
		for (var i = 0; i < Math.round(a_s); i++)
		{
			this.members.push(new Member(ADULT, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(a_i); i++)
		{
			this.members.push(new Member(ADULT, STATE_I, LOC_HOME));
		}
		for (var i = 0; i < Math.round(a_r); i++)
		{
			this.members.push(new Member(ADULT, STATE_R, LOC_HOME));
		}
		
		// add children population
		for (var i = 0; i < Math.round(c_s); i++)
		{
			this.members.push(new Member(CHILD, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(c_i); i++)
		{
			this.members.push(new Member(CHILD, STATE_I, LOC_HOME));
		}
		for (var i = 0; i < Math.round(c_r); i++)
		{
			this.members.push(new Member(CHILD, STATE_R, LOC_HOME));
		}
	}
	
	size()
	{
		return this.members.length;
	}
	
	size_adults()
	{
		return this.a_s + this.a_i + this.a_r + this.a_d;
	}
	
	size_children()
	{
		return this.c_s + this.c_i + this.c_r + this.c_d;
	}
	
	clear()
	{
		this.members = [];
	}
	
	run(chance_aa, chance_ac, chance_ca, chance_cc, infected_to_recover_time_adult, infected_to_recover_time_children, time_at_home_c, time_at_home_a, go_to_school_k_days, go_to_work_k_days)
	{
		
		// 1. stohasticly move them around (with day - night circle)
		if (!((this.days % 6 == 0 || this.days % 7 == 0) && rest_in_shabat))
		{
			this._move_population_around(time_at_home_c, time_at_home_a, go_to_school_k_days, go_to_work_k_days);	
		}
		
		// 2. make tranforms regarding to -> location, age, state
		this._make_trasforms(chance_aa, chance_ac, chance_ca, chance_cc, infected_to_recover_time_adult, infected_to_recover_time_children)
		
		// 3. update time of day 
		this.timeOfDay++;
		if (this.timeOfDay == TIME_IN_DAY)
		{
			this.timeOfDay = 0;
			this.days += 1;
		}
	}
	
	_move_population_around(time_at_home_c, time_at_home_a, go_to_school_k_days, go_to_work_k_days)
	{
		var adult_pass_percent = go_to_work_percent / 100;
		var children_pass_percent = go_to_school_percent / 100;
		
		// if end of time home, go to work and school
		if (this.timeOfDay == time_at_home_a && (this.days % go_to_work_k_days) == 0)
		{
			// stohasticly move them to work \ school (with day - night circle)
			for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
			{
				if (this.members[memberIndex].location == LOC_HOME && this.members[memberIndex].age_group == ADULT)
				{
					if (Math.random() < adult_pass_percent)
					{
						this.members[memberIndex].location = LOC_WORK;
					}
				}
			}
		}
		// if end of time home, go to work and school
		if (this.timeOfDay == time_at_home_c && (this.days % go_to_school_k_days) == 0)
		{
			// stohasticly move them to work \ school (with day - night circle)
			for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
			{
				if (this.members[memberIndex].location == LOC_HOME && this.members[memberIndex].age_group == CHILD)
				{
					if (Math.random() < children_pass_percent)
					{
						this.members[memberIndex].location = LOC_SCHOOL;
					}
				}
			}
		}
		else if (this.timeOfDay == 0)
		{
			// stohasticly move them to home (with day - night circle)
			for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
			{		
				if (this.members[memberIndex].location == LOC_WORK && this.members[memberIndex].age_group == ADULT)
				{
					this.members[memberIndex].location = LOC_HOME;
				}
				else if (this.members[memberIndex].location == LOC_SCHOOL && this.members[memberIndex].age_group == CHILD)
				{
					this.members[memberIndex].location = LOC_HOME;
				}	
			}
		}
	}
	
	_make_trasforms(chance_aa, chance_ac, chance_ca, chance_cc, infected_to_recover_time_adult, infected_to_recover_time_children)
	{
		// get destrbution
		var dist = this.countStatusLocationDestrebution();
		
		var counter_a_a_transform_meethings_home = dist["a_i_h"] * a_a_meeting_count;
		var counter_a_a_transform_meethings_work = dist["a_i_w"] * a_a_meeting_count;
		var counter_c_c_transform_meethings_home = dist["c_i_h"] * c_c_meeting_count;
		var counter_c_c_transform_meethings_school = dist["c_i_s"] * c_c_meeting_count;
		var counter_c_a_transform_meethings_home = dist["c_i_h"] * a_c_meeting_count;
		var counter_a_c_transform_meethings_home = dist["a_i_h"] * a_c_meeting_count;
		
		// stohasticly change states
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			// zero - find member and count event
			var member = this.members[memberIndex];
			member.tic();
			
			// first - check if move from I to Radio
			member.tryRecover(infected_to_recover_time_adult, infected_to_recover_time_children)
			
			// recover does not go anywehre, infected handled already, just manage STATE_S
			if (member.state == STATE_S)
			{
				if (member.age_group == ADULT)
				{
					if (member.location == LOC_HOME)
					{
						if (counter_a_a_transform_meethings_home > 0)
						{
							if (Math.random() < chance_aa)
							{
								this.members[memberIndex].infect();
							}
							counter_a_a_transform_meethings_home--;
						}
						if (counter_c_a_transform_meethings_home > 0)
						{
							if (Math.random() < chance_ca)
							{
								this.members[memberIndex].infect();
							}
							counter_c_a_transform_meethings_home--;
						}
					}
					else // if (member.location == LOC_WORK)
					{
						if (counter_a_a_transform_meethings_work > 0)
						{
							if (Math.random() < chance_aa)
							{
								this.members[memberIndex].infect();
							}
							counter_a_a_transform_meethings_work--;
						}
					}
				}
				else // if (member.age_group == CHILD)
				{
					if (member.location == LOC_HOME)
					{
						if (counter_c_c_transform_meethings_home > 0)
						{
							if (Math.random() < chance_cc)
							{
								this.members[memberIndex].infect();
							}
							counter_c_c_transform_meethings_home--;
						}
						if (counter_a_c_transform_meethings_home > 0)
						{
							if (Math.random() < chance_ca)
							{
								this.members[memberIndex].infect();
							}
							counter_a_c_transform_meethings_home--;
						}
					}
					else // if (member.location == LOC_WORK)
					{
						if (counter_c_c_transform_meethings_school > 0)
						{
							if (Math.random() < chance_cc)
							{
								this.members[memberIndex].infect();
							}
							counter_c_c_transform_meethings_school--;
						}
						
					}
				}
			}
		}
	}
	
	countStatusDestrebution() 
	{
		var answer = {"a_i": 0, "a_s": 0, "a_r": 0, "a_d": 0, "c_i": 0, "c_s": 0, "c_r": 0, "c_d": 0};
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
		var answer = {"a_i_h": 0, "a_s_h": 0, "a_r_h": 0, "c_i_h": 0, "c_s_h": 0, "c_r_h": 0,
		"a_i_w": 0, "a_s_w": 0, "a_r_w": 0, "c_i_w": 0, "c_s_w": 0, "c_r_w": 0,
		"a_i_s": 0, "a_s_s": 0, "a_r_s": 0, "c_i_s": 0, "c_s_s": 0, "c_r_s": 0,
		"a_d_h": 0, "a_d_w": 0, "a_d_s": 0, "c_d_h": 0, "c_d_w": 0, "c_d_s": 0};
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