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
		var a_s;
		var a_si;
		var a_ai;
		var a_r;
		var a_d = 0;
		var c_s;
		var c_si;
		var c_ai;
		var c_r;
		var c_d = 0;
		
		if (adult_s_percent + adult_i_percent + adult_r_percent == 100
		&& children_s_percent + adult_i_percent + adult_r_percent == 100)
		{
			a_s = adult_population * adult_s_percent / 100;
			a_si = symptomatic_adults_chance * adult_population * adult_i_percent / 100;
			a_ai = (1 - symptomatic_adults_chance) * adult_population * adult_i_percent / 100;
			a_r = adult_population * adult_r_percent / 100;
			c_s = adult_population * children_s_percent / 100;
			c_si = symptomatic_children_chance * adult_population * children_i_percent / 100;
			c_ai = (1 - symptomatic_children_chance) * adult_population * children_i_percent / 100;
			c_r = adult_population * children_r_percent / 100;
		}
		else
		{
			a_s = adult_s_percent;
			a_si = Math.round(symptomatic_adults_chance * adult_i_percent);
			a_ai = Math.round((1 - symptomatic_adults_chance) * adult_i_percent);
			a_r = adult_r_percent;
			c_s = children_s_percent;
			c_si = Math.round((1 - symptomatic_children_chance) *children_i_percent);
			c_ai = Math.round(symptomatic_children_chance * children_i_percent);
			c_r = children_r_percent;
		}
		
		// add adult population
		for (var i = 0; i < Math.round(a_s); i++)
		{
			this.members.push(new Member(ADULT, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(a_si); i++)
		{
			this.members.push(new Member(ADULT, STATE_SI, LOC_HOME));
		}
		for (var i = 0; i < Math.round(a_ai); i++)
		{
			this.members.push(new Member(ADULT, STATE_AI, LOC_HOME));
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
		for (var i = 0; i < Math.round(c_si); i++)
		{
			this.members.push(new Member(CHILD, STATE_SI, LOC_HOME));
		}
		for (var i = 0; i < Math.round(c_ai); i++)
		{
			this.members.push(new Member(CHILD, STATE_AI, LOC_HOME));
		}
		for (var i = 0; i < Math.round(c_r); i++)
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
	
	run(a_a_t_c,
		a_c_t_c,
		c_a_t_c,
		c_c_t_c,
		infected_to_recover_time_adult, 
		infected_to_recover_time_children, 
		time_at_home_c,
		time_at_home_a,
		go_to_school_k_days,
		go_to_work_k_days)
	{
		
		// 0. mix population in order to have a real stocastic process of picking the members
		this._shuffle();
		
		// 1. stohasticly move them around (with day - night circle)
		if (!((this.days % 6 == 0 || this.days % 7 == 0) && rest_in_shabat))
		{
			this._move_population_around(time_at_home_c, 
										time_at_home_a, 
										go_to_school_k_days, 
										go_to_work_k_days);	
		}
		
		// 2. make tranforms regarding to -> location, age
		var r_zero = this._make_trasforms(a_a_t_c,
											a_c_t_c,
											c_a_t_c,
											c_c_t_c,
											infected_to_recover_time_adult, 
											infected_to_recover_time_children);
		
		// 3. update time of day 
		this.timeOfDay++;
		if (this.timeOfDay == TIME_IN_DAY)
		{
			this.timeOfDay = 0;
			this.days += 1;
		}
	}

	_shuffle(array) 
	{
		let counter = this.members.length;

		// While there are elements in the array
		while (counter > 0)
		{
			// Pick a random index
			let index = Math.floor(Math.random() * counter);

			// Decrease counter by 1
			counter--;

			// And swap the last element with it
			let temp = this.members[counter];
			this.members[counter] = this.members[index];
			this.members[index] = temp;
		}
	}
	
	_move_population_around(time_at_home_c,
							time_at_home_a, 
							go_to_school_k_days, 
							go_to_work_k_days)
	{
		var adult_pass_percent = go_to_work_percent / 100;
		var children_pass_percent = go_to_school_percent / 100;
		
		// if end of time home, go to work and school
		if (this.timeOfDay == time_at_home_a && (this.days % go_to_work_k_days) == 0)
		{
			// stohasticly move them to work \ school (with day - night circle)
			for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
			{
				if (this.members[memberIndex].location == LOC_HOME && this.members[memberIndex].eco_age_group == WORKING_ADULT)
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
				if (this.members[memberIndex].location == LOC_HOME && this.members[memberIndex].eco_age_group == CHILD)
				{
					if (Math.random() < children_pass_percent)
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
				if (this.members[memberIndex].location == LOC_WORK && this.members[memberIndex].eco_age_group == WORKING_ADULT)
				{
					this.members[memberIndex].location = LOC_HOME;
				}
				else if (this.members[memberIndex].location == LOC_SCHOOL && this.members[memberIndex].eco_age_group == CHILD)
				{
					this.members[memberIndex].location = LOC_HOME;
				}	
			}
		}
	}
	
	_make_trasforms(a_a_t_c,
					a_c_t_c,
					c_a_t_c,
					c_c_t_c,
					infected_to_recover_time_adult, 
					infected_to_recover_time_children)
	{
		// get destrbution
		var dist = this.countStatusLocationDestrebution();
		
		/* infection counts per location */
		// home
		var counter_c_h = dist["c_i_h"] * c_c_meeting_count * c_c_t_c + dist["wa_i_h"] * wa_c_meeting_count * wa_c_t_c  + dist["na_i_h"] * na_c_meeting_count * na_c_t_c;
		var counter_wa_h = dist["wa_i_h"] * wa_wa_meeting_count * wa_wa_t_c + dist["na_i_h"] * wa_na_meeting_count * na_wa_t_c + dist["c_i_h"] * wa_c_meeting_count * c_wa_t_c;
		var counter_na_h = dist["na_i_h"] * na_na_meeting_count * na_na_t_c + dist["wa_i_h"] * wa_na_meeting_count * wa_na_t_c + dist["c_i_h"] * na_c_meeting_count * c_na_t_c;
		// work
		var counter_wa_w = dist["wa_i_w"] * wa_wa_meeting_count;
		// school
		var counter_c_s = dist["c_i_s"] * c_c_meeting_count;
		
		// stohasticly change states
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			// zero - find member and count event
			var member = this.members[memberIndex];
			member.tic();
			
			// first - check if move from I to R
			member.tryRecover(infected_to_recover_time_adult, infected_to_recover_time_children)
			
			// recover does not go anywehre, infected handled already, just manage STATE_S
			if (member.state == STATE_S)
			{
				if (member.eco_age_group == WORKING_ADULT && member.location == LOC_HOME && counter_wa_h > 0)
				{
					this.members[memberIndex].infect();
					counter_wa_h--;
				}
				else if (member.eco_age_group == WORKING_ADULT && member.location == LOC_WORK && counter_wa_w > 0)
				{
					this.members[memberIndex].infect();
					counter_wa_w--;
				}
				else if (member.eco_age_group == NONWORKING_ADULT && member.location == LOC_HOME && counter_na_h > 0)
				{
					this.members[memberIndex].infect();
					counter_na_h--;
				}
				else if (member.eco_age_group == CHILD && member.location == LOC_HOME && counter_c_h > 0)
				{
					this.members[memberIndex].infect();
					counter_c_h--;
				}
				else if (member.eco_age_group == CHILD && member.location == LOC_SCHOOL && counter_c_s > 0)
				{
					this.members[memberIndex].infect();
					counter_c_s--;
				}
			}
		}
		
		// for the economic, calc states and then working R_0
		return this.calcWorkingRzero(this.countStatusDestrebution());
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