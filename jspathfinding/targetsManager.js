class TargetsManager
{
	constructor()
	{
		// members // 
		this.targets = [];
		this.targetsSize = 0;
		// end - members //
	}
	
	// print the obsticles of the simulation
	show() 
	{
		// print blocks
		for(var i = 0; i < this.targetsSize; i++)
		{
			this.targets[i].show();
		}
	}

	// check if rocket hit block
	hit(rocket) 
	{
		for(var i = 0; i < this.targetsSize; i++)
		{
			if(this.targets[i].hit(rocket))
			{
				return true;
			}
		}
		return false;
	}
	
	// calc the mean distance between some point and given rocket
	meanDis(rocket, startX, startY, startZ)
	{
		var answer = -1;
		for(var i = 0; i < this.targetsSize; i++)
		{
			var d = dist(rocket.pos.x, rocket.pos.y, rocket.pos.z, this.targets[i].x, this.targets[i].y, this.targets[i].z) / dist(startX, startY, startZ, this.targets[i].x, this.targets[i].y, this.targets[i].z);
			if(d < answer || answer == -1)
			{
				answer = d;
			}
		}
		return answer;
	}

	// mean distace but AVG to some dot (x,y,z)
	meanAvgDis(x, y, z)
	{
		var answer = -1;
		for(var i = 0; i < this.targetsSize; i++)
		{
			var d = dist(x, y, z, this.targets[i].x, this.targets[i].y, this.targets[i].z);
			if(d < answer || answer == -1)
			{
				answer = d;
			}
		}
		return answer;
	}
	
	// copy the given pos to closest target location position
	  copyBest(pos)
	  {
		  var holder = -1;
		  var answer = 0;
		  for(var i = 0; i < this.targetsSize; i++)
		  {
			  var d = dist(pos.x, pos.y, pos.z, this.targets[i].x, this.targets[i].y, this.targets[i].z);
			  if(d < holder || holder == -1)
			  {
				  holder = d;
				  answer = createVector(this.targets[i].x, this.targets[i].y, this.targets[i].z);
			  }
		  }
		  return answer;
	  }
	
	// add new target to the simulation 
	add(target)
	{
		this.targets.push(target);
		this.targetsSize++;
	}
	
	// clear some amount or all the obsitlces 
	clear(howMany)
	{
		if(this.targetsSize >= howMany)
		{
			this.targets.splice(0, howMany);
			this.targetsSize -= howMany;
		}
		else if(howMany == null) // clear all
		{
			this.targets.splice(0, this.targetsSize);
			this.targetsSize = 0;
		}
	}
}