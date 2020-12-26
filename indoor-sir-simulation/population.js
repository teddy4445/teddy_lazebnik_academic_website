class Population
{
	constructor()
	{
		this.members = [];
	}
	
	buildPopulationFromFile(dataJsonObj)
	{
		for (var i = 0; i < dataJsonObj.length; i++)
		{
			// repeat the creation as many times needed 
			var repeatMember = dataJsonObj[i]["count"];
			for (var count = 0; count < repeatMember; count++)
			{
				this.members.push(Member.buildFromJson(dataJsonObj[i]));
			}
		}
	}
	
	size()
	{
		return this.members.length;
	}
	
	clear()
	{
		this.members = [];
	}
	
	hyperJump(deltaTime, 
				infected_to_recover_time_adult, 
				infected_to_recover_time_children,
				infected_to_recover_chance_adult,
				infected_to_recover_chance_children)
	{
		// stohasticly change states
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			// update member's time
			this.members[memberIndex].addTime(deltaTime);
			
			// check if move from I^s or I^a to R or D
			this.members[memberIndex].tryRecover(infected_to_recover_time_adult,
												infected_to_recover_time_children,
												infected_to_recover_chance_adult,
												infected_to_recover_chance_children);
			
			// move person around
			this.members[memberIndex].moveAround(timeOfTheDay);
		}
	}
	
	countStatusDestrebution() 
	{
		var answer = {"a_si": 0, "a_ai": 0, "a_s": 0, "a_r": 0, "a_d": 0, "c_si": 0, "c_ai": 0, "c_s": 0, "c_r": 0, "c_d": 0};
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
	
	countStatusDestrebutionInLocation(locationId) 
	{
		var answer = {"a_si": 0, "a_ai": 0, "a_s": 0, "a_r": 0, "a_d": 0, "c_si": 0, "c_ai": 0, "c_s": 0, "c_r": 0, "c_d": 0};
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			if (this.members[memberIndex].location == locationId)
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
		}
		return answer;
	}
	
	locationDisctrebution() 
	{
		var answer = {};
		for (var memberIndex = 0; memberIndex < this.members.length; memberIndex++)
		{
			var key = this.members[memberIndex].getLocation();
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