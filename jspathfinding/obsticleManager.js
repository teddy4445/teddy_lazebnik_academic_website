class ObsticleManager
{
	constructor()
	{
		// members // 
		this.blocks = [];
		this.blockSize = 0;
		
		this.walls = [];
		this.wallSize = 0;
		// end - members //
	}
	
	// print the obsticles of the simulation
	show() 
	{
		// print blocks
		for(var i = 0; i < this.blockSize; i++)
		{
			this.blocks[i].show();
		}
		// print walls
		for(var i = 0; i < this.wallSize; i++)
		{
			this.walls[i].show(true);
		}
	}

	// check if rocket hit block
	hit(rocket) 
	{
		for(var i = 0; i < this.blockSize; i++)
		{
			if(this.blocks[i].hit(rocket))
			{
				return true;
			}
		}
		return false;
	}
	
	addBlock(block)
	{
		this.blocks.push(block);
		this.blockSize++;
	}
	
	addWall(wall)
	{
		this.walls.push(wall);
		this.wallSize++;
	}
	
	// clear some amount or all the obsitlces 
	clear(howMany)
	{
		if(this.blockSize >= howMany)
		{
			this.blocks.splice(0, howMany);
			this.blockSize -= howMany;  
		}
		else if(howMany == null) // clear all
		{
			this.blocks.splice(0, this.blockSize);
			this.blockSize = 0;
		}
	}
}