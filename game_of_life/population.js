class Population
{
	constructor(createPoplationSize, grid, sickCount)
	{
		// Array of rockets
		this.people = [];
		// Amount of rockets
		this.popsize = createPoplationSize;
		this.statusDistrebution = [createPoplationSize - sickCount, sickCount, 0, 0];
		
		// assume delay distrebution
		var delay_moves = [];
		for (var i = 0; i < createPoplationSize; i++)
		{
			delay_moves.push(deadRecoverDelayMean + Math.floor(Math.random() * deadRecoverDelaySpread)); 
		}
		
		// assume delay distrebution
		var recover_chance = [];
		for (var i = 0; i < createPoplationSize; i++)
		{
			recover_chance.push(deadRecoverChance); // TODO: change later for something more cool
		}
		
		// create all the peoples as our population
		for (var i = 0; i < this.popsize; i++)
		{
			// pick if healthy or sick in the begining
			var thisStatus = HealtyStatus;
			if (i < sickCount)
			{
				thisStatus = InfectStatus;
			}
			// build a people as member of the population
			this.people[i] = new People(thisStatus, grid, i, recover_chance[i], delay_moves[i]);
		}
	}
	
	clear()
	{
		this.people = [];
		this.popsize = 0;
		this.healthyCount = 0;
	}
	
	countHealty()
	{
		return this.statusDistrebution[0];
	}
	
	countInfected()
	{
		return this.statusDistrebution[1];
	}
	
	countDead()
	{
		return this.statusDistrebution[2];
	}
	
	countRecovered()
	{
		return this.statusDistrebution[3];
	}
	
	countNotHealthy()
	{
		return this.popsize - this.statusDistrebution[0];
	}
	
	
	// Calls for update and show functions
	run() 
	{
		this.statusDistrebution = [0, 0, 0, 0]; // count this step again
		for (var i = 0; i < this.popsize; i++) 
		{
			this.people[i].move(grid);
		}
		for (var i = 0; i < this.popsize; i++) 
		{
			this.people[i].infect(k_value, p_value, grid, this.people);
			
			// Displays rockets to screen
			if (showGraphic)
			{
				this.people[i].show();
			}
			this.statusDistrebution[this.people[i].status]++;
		}
	}
}