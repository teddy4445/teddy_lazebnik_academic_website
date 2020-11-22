class Population
{
	constructor(working_adult_population,
				working_adult_s_percent,
				working_adult_i_percent,
				working_adult_r_percent,
				nonworking_adult_population,
				nonworking_adult_s_percent,
				nonworking_adult_i_percent,
				nonworking_adult_r_percent,
				children_population, 
				children_s_percent, 
				children_i_percent, 
				children_r_percent,
				init_econimic)
	{
		// main members
		this.members = [];
		this.econimic = init_econimic;
		this.econimic_delta = 0;
		this.taxes = 0;
		this.w_to_n_adults = 0;
		
		// technical members
		this.timeOfDay = 0;
		this.days = 0;
		this.last_stats = null;
		
		// find if percent or size
		var wa_s;
		var wa_i;
		var wa_r;
		var wa_d = 0;
		var na_s;
		var na_i;
		var na_r;
		var na_d = 0;
		var c_s;
		var c_i;
		var c_r;
		var c_d = 0;
		
		if (working_adult_s_percent + working_adult_i_percent + working_adult_r_percent == 100
		&& nonworking_adult_s_percent + children_i_percent + children_r_percent == 100
		&& children_s_percent + nonworking_adult_i_percent + nonworking_adult_r_percent == 100)
		{
			wa_s = adult_population * working_adult_s_percent / 100;
			wa_i = adult_population * working_adult_i_percent / 100;
			wa_r = adult_population * working_adult_r_percent / 100;
			na_s = adult_population * nonworking_adult_s_percent / 100;
			na_i = adult_population * nonworking_adult_i_percent / 100;
			na_r = adult_population * working_adult_r_percent / 100;
			c_s = adult_population * children_s_percent / 100;
			c_i = adult_population * children_i_percent / 100;
			c_r = adult_population * nonworking_adult_r_percent / 100;
		}
		else
		{
			wa_s = working_adult_s_percent;
			wa_i = working_adult_i_percent;
			wa_r = working_adult_r_percent;
			na_s = nonworking_adult_s_percent;
			na_i = nonworking_adult_i_percent;
			na_r = nonworking_adult_r_percent;
			c_s = children_s_percent;
			c_i = children_i_percent;
			c_r = children_r_percent;
		}
		
		// add working adult population
		for (var i = 0; i < Math.round(wa_s); i++)
		{
			this.members.push(new Member(WORKING_ADULT, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(wa_i); i++)
		{
			this.members.push(new Member(WORKING_ADULT, STATE_I, LOC_HOME));
		}
		for (var i = 0; i < Math.round(wa_r); i++)
		{
			this.members.push(new Member(WORKING_ADULT, STATE_R, LOC_HOME));
		}
		
		// add nonworking adult population
		for (var i = 0; i < Math.round(na_s); i++)
		{
			this.members.push(new Member(NONWORKING_ADULT, STATE_S, LOC_HOME));
		}
		for (var i = 0; i < Math.round(na_i); i++)
		{
			this.members.push(new Member(NONWORKING_ADULT, STATE_I, LOC_HOME));
		}
		for (var i = 0; i < Math.round(na_r); i++)
		{
			this.members.push(new Member(NONWORKING_ADULT, STATE_R, LOC_HOME));
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
		return this.size_working_adults() + this.size_nonworking_adults();
	}
	
	size_working_adults()
	{
		return this.wa_s + this.wa_i + this.wa_r + this.wa_d;
	}
	
	size_nonworking_adults()
	{
		return this.na_s + this.na_i + this.na_r + this.na_d;
	}
	
	size_children()
	{
		return this.c_s + this.c_i + this.c_r + this.c_d;
	}
	
	count_working_hours()
	{
		let answer = 0;
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			if (this.members[memberIndex].location == LOC_WORK)
			{
				answer++;
			}
		}
		return answer;
	}
	
	clear()
	{
		this.members = [];
	}
	
	run(wa_wa_t_c, 
		wa_na_t_c, 
		na_wa_t_c, 
		na_na_t_c,
		wa_c_t_c,
		na_c_t_c,
		c_c_t_c,
		c_wa_t_c,
		c_na_t_c,
		infected_to_recover_time_adult, 
		infected_to_recover_time_children, 
		time_at_home_c,
		time_at_home_a,
		go_to_school_k_days,
		go_to_work_k_days,
		loss_jobs_rate,
		avg_contribution_to_economic,
		taxes_percent)
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
		
		// 2. make tranforms regarding to -> location, age, state
		var r_zero = this._make_trasforms(wa_wa_t_c, 
											wa_na_t_c, 
											na_wa_t_c, 
											na_na_t_c,
											wa_c_t_c,
											na_c_t_c,
											c_c_t_c,
											c_wa_t_c,
											c_na_t_c, 
											infected_to_recover_time_adult, 
											infected_to_recover_time_children);
		
		// 3. update the working status (the new econimic part of the system) and update the economic 
		this.econimic_delta = this._update_working_status(loss_jobs_rate,
															avg_contribution_to_economic, 
															r_zero, 
															time_at_home_a,
															taxes_percent);
		this.econimic += this.econimic_delta;
		
		// 4. update time of day 
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
					if (Math.random() < adult_pass_percent && this.members[memberIndex].state != STATE_D)
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
					if (Math.random() < children_pass_percent && this.members[memberIndex].state != STATE_D)
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
				if (this.members[memberIndex].location == LOC_WORK && this.members[memberIndex].eco_age_group == WORKING_ADULT && this.members[memberIndex].state != STATE_D)
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
	
	_make_trasforms(wa_wa_t_c, 
					wa_na_t_c, 
					na_wa_t_c, 
					na_na_t_c,
					wa_c_t_c,
					na_c_t_c,
					c_c_t_c,
					c_wa_t_c,
					c_na_t_c, 
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
	
	
	// updates the working status according
	_update_working_status(loss_jobs_rate, 
							avg_contribution_to_economic,
							r_zero,
							time_at_home_a,
							taxes_percent)
	{
		var now_stats = this.countStatusDestrebution();
		
		// Note: can be negative, this mean individuals get there jobs back
		var lose_jobs_s_count = loss_jobs_rate * r_zero * now_stats["wa_s"];
		var lose_jobs_r_count = loss_jobs_rate * r_zero * now_stats["wa_r"];
			
		this.taxes = 0;
		
		var working_counter = 0;
		var non_working_adults_counter = 0;
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			var thisMember = this.members[memberIndex];
			
			// handle S case
			if (thisMember.state == STATE_S)
			{
				// if we need to loose jobs or get them
				if (lose_jobs_s_count > 0 && thisMember.eco_age_group == WORKING_ADULT)
				{
					thisMember.eco_age_group = NONWORKING_ADULT;
					thisMember.location = LOC_HOME;
					lose_jobs_s_count--;
				}
				else if (lose_jobs_s_count < 0 && thisMember.eco_age_group == NONWORKING_ADULT)
				{
					thisMember.eco_age_group = WORKING_ADULT;
					lose_jobs_s_count++;
				}
			}
			
			// handle R case
			if (thisMember.state == STATE_R)
			{
				// if we need to loose jobs or get them
				if (lose_jobs_r_count > 0 && thisMember.eco_age_group == WORKING_ADULT)
				{
					thisMember.eco_age_group = NONWORKING_ADULT;
					thisMember.location = LOC_HOME;
					lose_jobs_r_count--;
				}
				else if (lose_jobs_r_count < 0 && thisMember.eco_age_group == NONWORKING_ADULT)
				{
					thisMember.eco_age_group = WORKING_ADULT;
					lose_jobs_r_count++;
				}
			}
			
			// count for the change in the economic post changes
			if (thisMember.eco_age_group == WORKING_ADULT && (thisMember.state == STATE_S || thisMember.state == STATE_R))
			{
				working_counter++;
				this.taxes += taxes_percent * avg_contribution_to_economic;
			}
			
			if (thisMember.eco_age_group == NONWORKING_ADULT)
			{
				non_working_adults_counter++;
			}
		}
		this.taxes = parseFloat(Math.round(this.taxes * 100 / non_working_adults_counter)) / 100;
		return avg_contribution_to_economic * working_counter * ((TIME_IN_DAY - time_at_home_a) / STANDARD_WORK_DAY);
	}
	
	countStatusDestrebution() 
	{
		var answer = {"wa_i": 0, "wa_s": 0, "wa_r": 0, "wa_d": 0,
						"na_i": 0, "na_s": 0, "na_r": 0, "na_d": 0,
						"c_i": 0, "c_s": 0, "c_r": 0, "c_d": 0};
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
	
	calcWorkingRzero(new_stat)
	{
		var answer = 0;
		if (this.last_stats != null)
		{
			var delta_recover = new_stat["wa_r"] + new_stat["na_r"] + new_stat["c_r"] - this.last_stats["wa_r"] - this.last_stats["na_r"] - this.last_stats["c_r"];
			var delta_infected = new_stat["wa_i"] + new_stat["na_i"] + new_stat["c_i"] - this.last_stats["wa_i"] - this.last_stats["na_i"] - this.last_stats["c_i"];
			if (delta_recover == 0)
			{
				answer = delta_infected;
			}
			else
			{
				answer = delta_infected / delta_recover;
			}
		}
		else
		{
			answer = 0;
		}
		
		// edge cases
		if (answer > 0 && answer < 1)
		{
			answer = -1 / answer;
		}
		else if (answer == 1)
		{
			answer = 0;
		}
		
		this.last_stats = new_stat;
		return answer;
	}
	
	countStatusLocationDestrebution() 
	{
		var answer = {"wa_i_h": 0, "wa_s_h": 0, "wa_r_h": 0,
		"na_i_h": 0, "na_s_h": 0, "na_r_h": 0,		
		"c_i_h": 0, "c_s_h": 0, "c_r_h": 0,
		"wa_i_w": 0, "wa_s_w": 0, "wa_r_w": 0,
		"c_i_s": 0, "c_s_s": 0, "c_r_s": 0,
		"wa_d_h": 0, "na_d_h": 0, "wa_d_w": 0, "c_d_h": 0, "c_d_s": 0};
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