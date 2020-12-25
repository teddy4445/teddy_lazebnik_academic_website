class Population
{
	constructor()
	{
		this.members = [];
		this.timeOfDay = 0;
		this.days = 0;
	}
	
	buildPopulationFromFile(dataJsonObj)
	{
		for (var i = 0; i < dataJsonObj.length; i++)
		{
			this.members.push(Member.buildFromJson(dataJsonObj[i]));
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
	
	run()
	{	
		// TODO: finish here
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