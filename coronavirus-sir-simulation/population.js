class Population
{
	constructor(adult_population, adult_s_percent, adult_i_percent, adult_r_percent, children_population, children_s_percent, children_i_percent, children_r_percent)
	{
		this.members = [];
		
		// add adult population
		for (var i = 0; i < adult_population * adult_s_percent; i++)
		{
			this.push(Member(ADULT, STATE_S));
		}
		for (var i = 0; i < adult_population * adult_i_percent; i++)
		{
			this.push(Member(ADULT, STATE_I));
		}
		for (var i = 0; i < adult_population * adult_r_percent; i++)
		{
			this.push(Member(ADULT, STATE_R));
		}
		
		// add children population
		for (var i = 0; i < children_population * children_s_percent; i++)
		{
			this.push(Member(CHILD, STATE_S));
		}
		for (var i = 0; i < children_population * children_i_percent; i++)
		{
			this.push(Member(CHILD, STATE_I));
		}
		for (var i = 0; i < children_population * children_r_percent; i++)
		{
			this.push(Member(CHILD, STATE_R));
		}
	}
	
	clear()
	{
		this.members = [];
	}
	
	countStatusDestrebution() 
	{
		var answer = {"a_s": 0, "a_i": 0, "a_r": 0, "c_s": 0, "c_i": 0, "c_r": 0}
		for (var memberIndex = 0; memberIndex < this.members; memberIndex++)
		{
			answer[this.members.getKey()]++;
		}
	}
}