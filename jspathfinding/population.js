class Population
{
	constructor(createPoplationSize)
	{
		// Array of rockets
		this.rockets = [];
		// Amount of rockets
		this.popsize = createPoplationSize;
		this.popsizeLive = createPoplationSize;
		// Amount parent rocket partners
		this.matingpool = [];
		this.howWell = 0;
		
		// Associates a rocket to an array index
		for (var i = 0; i < this.popsize; i++)
		{
			this.rockets[i] = new Rocket(false);
		}
	}
	
	clearRockets()
	{
		this.rockets = [];
		this.popsize = 0;
		this.popsizeLive = 0;
	}
	
	addRocket(rocket)
	{
		this.rockets.push(rocket);
		this.popsize++;
		this.popsizeLive++;
	}
	
	evaluate(targetsManager) 
	{
		var maxfit = 0;
		// Iterate through all rockets and calcultes their fitness
		for (var i = 0; i < this.popsize; i++) 
		{
		  // Calculates fitness
		  this.rockets[i].calcFitness(targetsManager);
		  // If current fitness is greater than max, then make max equal to current
		  if (this.rockets[i].fitness > maxfit)
		  {
			maxfit = this.rockets[i].fitness;
		  }
		}
		// Normalises fitnesses
		this.howWell = 0;
		for (var i = 0; i < this.popsize; i++) 
		{
		  this.rockets[i].fitness /= maxfit;
		  this.howWell += this.rockets[i].distance;
		}
		this.howWell /= this.popsize;

		this.matingpool = [];
		// Take rockets fitness make in to scale of 1 to 100
		// A rocket with high fitness will highly likely will be in the mating pool
		for (var i = 0; i < this.popsize; i++) 
		{
		  var n = this.rockets[i].fitness * 100;
		  for (var j = 0; j < n; j++) 
		  {
			this.matingpool.push(this.rockets[i]);
		  }
		}
	}
	
	// Selects appropriate genes for child
	selection()
	{
		var newRockets = [];
		for (var i = 0; i < this.rockets.length; i++)
		{
		  // Picks random dna
		  var parentA = random(this.matingpool).dna;
		  var parentB = random(this.matingpool).dna;
		  // Creates child by using crossover function
		  var child = parentA.crossover(parentB);
		  child.mutation();
		  // Creates new rocket with child dna
		  newRockets[i] = new Rocket(child);
		}
		// This instance of rockets are the new rockets
		this.rockets = newRockets;
	}
	
	// return the center mass of the population
	centerMass()
	{
	  var mean = [0, 0, 0];
	  var countLive = 0;
	  for (var i = 0; i < this.popsize; i++)
	  {
		  if(!this.rockets[i].crashed)
		  {
			  mean[0] += this.rockets[i].pos.x;
			  mean[1] += this.rockets[i].pos.y;
			  mean[2] += this.rockets[i].pos.z;
			  countLive++;
		  }
      }
	  for( var i = 0; i < 3; i++)
	  {
		  mean[i] /= countLive;
	  }
	  return mean;
	}
	
	// return the center mass of the population
	variance(mean)
	{
	  var answer = 0;
	  var countLive = 0;
	  for (var i = 0; i < this.popsize; i++)
	  {
		  if(!this.rockets[i].crashed)
		  {
			  answer += (this.rockets[i].pos.x - mean[0]) * (this.rockets[i].pos.x - mean[0]) + (this.rockets[i].pos.y - mean[1]) * (this.rockets[i].pos.y - mean[1]);
			  countLive++;
		  }
      }
	  answer /= countLive;
	  return answer;
	}
	
	// Calls for update and show functions
	run(frame, frameRate, obsticleManager, targetsManager) 
	{
		this.popsizeLive = this.popsize; // count this step again
		for (var i = 0; i < this.popsize; i++) 
		{
		  this.rockets[i].update(frame, frameRate, obsticleManager, targetsManager);
		  // Displays rockets to screen
		  this.rockets[i].show(targetsManager);
		  
		  // if in this step the rocket finished or dead
		  if(this.rockets[i].crashed || this.rockets[i].completed)
		  {
			  this.popsizeLive--;
		  }
		}
	}
	
	// only to save function 
	saveDNA()
	{
		var answer = [];
		// run over all the rockets and get there dna
		for(var i = 0; i < this.popsize; i++)
		{
			answer.push(this.rockets[i].dna);
		}
		return answer;
	}
}