class Population
{
	constructor(adult_population,
				adult_s_percent,
				adult_i_percent,
				adult_r_percent,
				children_population, 
				children_s_percent, 
				children_i_percent, 
				children_r_percent)
	{
		// main members
		this.members = [];
		
		// technical members
		this.timeOfDay = 0;
		this.days = 0;
		this.last_stats = null;
		
		// find if percent or size
		this.a_s = 0;
		this.a_si = 0;
		this.a_ai = 0;
		this.a_r = 0;
		this.a_d = 0;
		this.c_s = 0;
		this.c_si = 0;
		this.c_ai = 0;
		this.c_r = 0;
		this.c_d = 0;
		
		if (adult_s_percent + adult_i_percent + adult_r_percent == 100
		&& children_s_percent + adult_i_percent + adult_r_percent == 100)
		{
			this.a_s = adult_population * adult_s_percent / 100;
			this.a_si = symptomatic_adults_chance * adult_population * adult_i_percent / 100;
			this.a_ai = (1 - symptomatic_adults_chance) * adult_population * adult_i_percent / 100;
			this.a_r = adult_population * adult_r_percent / 100;
			this.c_s = adult_population * children_s_percent / 100;
			this.c_si = symptomatic_children_chance * adult_population * children_i_percent / 100;
			this.c_ai = (1 - symptomatic_children_chance) * adult_population * children_i_percent / 100;
			this.c_r = adult_population * children_r_percent / 100;
		}
		else
		{
			this.a_s = adult_s_percent;
			this.a_si = Math.round(symptomatic_adults_chance * adult_i_percent);
			this.a_ai = Math.round((1 - symptomatic_adults_chance) * adult_i_percent);
			this.a_r = adult_r_percent;
			this.c_s = children_s_percent;
			this.c_si = Math.round((1 - symptomatic_children_chance) *children_i_percent);
			this.c_ai = Math.round(symptomatic_children_chance * children_i_percent);
			this.c_r = children_r_percent;
		}
		
		// add adult population
		for (var i = 0; i < Math.round(this.a_s); i++)
		{
			this.members.push(new Member(ADULT, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(this.a_si); i++)
		{
			this.members.push(new Member(ADULT, STATE_SI, LOC_HOME));
		}
		for (var i = 0; i < Math.round(this.a_ai); i++)
		{
			this.members.push(new Member(ADULT, STATE_AI, LOC_HOME));
		}
		for (var i = 0; i < Math.round(this.a_r); i++)
		{
			this.members.push(new Member(ADULT, STATE_R, LOC_HOME));
		}
		
		// add children population
		for (var i = 0; i < Math.round(this.c_s); i++)
		{
			this.members.push(new Member(CHILD, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(this.c_si); i++)
		{
			this.members.push(new Member(CHILD, STATE_SI, LOC_HOME));
		}
		for (var i = 0; i < Math.round(this.c_ai); i++)
		{
			this.members.push(new Member(CHILD, STATE_AI, LOC_HOME));
		}
		for (var i = 0; i < Math.round(this.c_r); i++)
		{
			this.members.push(new Member(CHILD, STATE_R, LOC_HOME));
		}
		
		// add masks 
		let good_mask_people = init_percent_good_masks * adult_population;
		let bad_mask_people = init_percent_bad_masks * adult_population;
		
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			if (this.members[memberIndex].eco_age_group == ADULT)
			{
				if (Math.random() < init_percent_good_masks)
				{
					this.members[memberIndex].eco_age_group = ADULT_GOOD_MASK;
				}
				else if (Math.random() < init_percent_bad_masks)
				{
					this.members[memberIndex].eco_age_group = ADULT_BAD_MASK;
				}
			}
		}
	}
	
	size()
	{
		return this.members.length;
	}
	
	size_adults()
	{
		return this.a_s + this.a_si + this.a_ai + this.a_r + this.a_d;
	}
	
	size_children()
	{
		return this.c_s + this.c_si + this.c_ai + this.c_r + this.c_d;
	}
	
	with_good_mask()
	{
		let counter = 0;
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			if (this.member[memberIndex].eco_age_group == ADULT_GOOD_MASK)
			{
				counter++;
			}
		}
		return counter;
	}
	
	with_bad_mask()
	{
		let counter = 0;
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			if (this.member[memberIndex].eco_age_group == ADULT_BAD_MASK)
			{
				counter++;
			}
		}
		return counter;
	}
	
	clear()
	{
		this.members = [];
	}
	
	run()
	{
		
		// 1. stohasticly move them around (with day - night circle)
		if (!((this.days % 6 == 0 || this.days % 7 == 0) && rest_in_shabat))
		{
			this._move_population_around();	
		}
		
		// 2. make tranforms regarding to -> location, age
		var r_zero = this._make_trasforms();
		
		// 3. check if event needed 
		if ((this.days % event_rate_days) == 0 && this.timeOfDay == 12)
		{
			this._make_event();
		}
		
		// 4. update time of day 
		this.timeOfDay++;
		if (this.timeOfDay == TIME_IN_DAY)
		{
			this.timeOfDay = 0;
			this.days += 1;
		}
	}
	
	_move_population_around()
	{
		
		// if end of time home, go to work and school
		if (this.timeOfDay == time_at_home_a && (this.days % go_to_work_k_days) == 0)
		{
			// stohasticly move them to work \ school (with day - night circle)
			for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
			{
				if (this.members[memberIndex].location == LOC_HOME && this.members[memberIndex].eco_age_group != CHILD)
				{
					if (this.members[memberIndex].state == STATE_SI)
					{
						if (Math.random() < percent_symptomatic_goto_work)
						{
							this.members[memberIndex].location = LOC_WORK;
						}	
					}
					else if (this.members[memberIndex].state != STATE_D)
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
				if (this.members[memberIndex].location == LOC_HOME && this.members[memberIndex].eco_age_group == CHILD)
				{
					if (this.members[memberIndex].state == STATE_SI)
					{
						if (Math.random() < percent_symptomatic_goto_school)
						{
							this.members[memberIndex].location = LOC_SCHOOL;
						}	
					}
					else if (this.members[memberIndex].state != STATE_D)
					{
						this.members[memberIndex].location = LOC_SCHOOL;	
					}
				}
			}
		}
		
		if (this.timeOfDay == 0)
		{
			// stohasticly move them to home (with day - night circle)
			for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
			{		
				if (this.members[memberIndex].location == LOC_WORK && this.members[memberIndex].eco_age_group != CHILD && this.members[memberIndex].state != STATE_D)
				{
					this.members[memberIndex].location = LOC_HOME;
				}
				else if (this.members[memberIndex].location == LOC_SCHOOL && this.members[memberIndex].eco_age_group == CHILD && this.members[memberIndex].state != STATE_D)
				{
					this.members[memberIndex].location = LOC_HOME;
				}	
			}
		}
	}
	
	_make_trasforms()
	{	
		let pop_size = this.members.length;
	
		// stohasticly change states
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			// zero - find member and count event
			var member = this.members[memberIndex];
			member.tic();
			
			// first - check if move from I^s or I^a to R or D
			member.tryRecover(infected_to_recover_time_adult, infected_to_recover_time_children)
			
			// second - recover and dead does not change, infected handled already in the last step, just manage STATE_S
			if (member.state == STATE_S)
			{
				// pick in random a person to meet with 
				let tryCount = 0;
				var meetMemeber = this.members[Math.floor(Math.random() * pop_size)];
				while (meetMemeber.location != member.location && meetMemeber.state != STATE_D && tryCount < MAX_TRYS)
				{
					meetMemeber = this.members[Math.floor(Math.random() * pop_size)];
					if (meetMemeber.state != STATE_D)
					{
						tryCount++;	
					}
				}
				
				// we tried hard, but did not find anyone we want 
				if (meetMemeber.location != member.location || !([STATE_AI, STATE_SI].includes(meetMemeber.state)))
				{
					continue;
				}
				
				// get the infection chance for this meeting
				let infectChance = Math.random();
				
				// reduce by masks 
				if (member.eco_age_group != CHILD && meetMemeber.eco_age_group != CHILD) // this will work if both sides are adults
				{
					// recall: member is STATE_S and meetMemeber is STATE_AI or STATE_SI
					if (member.eco_age_group == ADULT && meetMemeber.eco_age_group == ADULT)
					{
						infectChance /= 1;
					}
					else if (member.eco_age_group == ADULT_GOOD_MASK && meetMemeber.eco_age_group == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_mask_two_side);
					}
					else if (member.eco_age_group == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_mask_not_infected_side);
					}
					else if (meetMemeber.eco_age_group == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_mask_infected_side);
					}
					else if (member.eco_age_group == ADULT_BAD_MASK && meetMemeber.eco_age_group == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_mask_two_side);
					}
					else if (member.eco_age_group == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_mask_not_infected_side);
					}
					else if (meetMemeber.eco_age_group == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_mask_infected_side);
					}
					else if (member.eco_age_group == ADULT_GOOD_MASK && meetMemeber.eco_age_group == ADULT_BAD_MASK)
					{
						infectChance /= (1 - bad_infected_good_susceptible);
					}
					else if (member.eco_age_group == ADULT_BAD_MASK && meetMemeber.eco_age_group == ADULT_GOOD_MASK)
					{
						infectChance /= (1 - good_infected_bad_susceptible);
					}
				}
				
				if ((infectChance < a_a_t_c && member.eco_age_group != CHILD && meetMemeber.eco_age_group != CHILD) || 
					(infectChance < a_c_t_c && member.eco_age_group != CHILD && meetMemeber.eco_age_group == CHILD) || 
					(infectChance < c_a_t_c && member.eco_age_group == CHILD && meetMemeber.eco_age_group != CHILD) || 
					(infectChance < c_c_t_c && member.eco_age_group == CHILD && meetMemeber.eco_age_group == CHILD))
				{
					this.members[memberIndex].infect();	
				}
			}
		}
	}
	
	_make_event()
	{
		let pop_size = this.members.length;
	
		// stohasticly change states
		for (var memberIndex = 0; memberIndex < event_size; memberIndex++)
		{
			let tryCount = 0;
			var meetMemeber = this.members[Math.floor(Math.random() * pop_size)];
			while (meetMemeber.state != STATE_D && tryCount < MAX_TRYS)
			{
				meetMemeber = this.members[Math.floor(Math.random() * pop_size)];
				if (meetMemeber.state != STATE_D)
				{
					tryCount++;	
				}
			}
			
			if (meetMemeber.state == STATE_S)
			{
				meetMemeber.infect();	
			}
		}
	}
	
	countStatusDestrebution() 
	{
		var answer = {"a_si": 0, "a_ai": 0, "a_s": 0, "a_r": 0, "a_d": 0,
						"c_si": 0, "c_ai": 0, "c_s": 0, "c_r": 0, "c_d": 0};
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
		var answer = {"a_si_h": 0, "a_ai_h": 0, "a_s_h": 0, "a_r_h": 0,
		"c_si_h": 0, "c_ai_h": 0, "c_s_h": 0, "c_r_h": 0,
		"a_si_w": 0, "a_ai_w": 0, "a_s_w": 0, "a_r_w": 0,
		"c_si_s": 0, "c_ai_s": 0, "c_s_s": 0, "c_r_s": 0,
		"a_d_w": 0, "a_d_h": 0, "c_d_h": 0, "c_d_s": 0};
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