	HealtyStatus = 0;
let InfectStatus = 1;
let DeadStatus = 2;
let RecoverStatus = 3;

class People
{
	constructor(Initialstatus, grid, id, recover_chance, delay_moves)
	{
		// running members
		this.status = Initialstatus;
		this.statusDays = [0, 0, 0, 0];
		
		// properties 
		this.recover_chance = recover_chance;
		this.delay_moves = delay_moves;
		
		// for debuging and contorling
		this.id = id;
		
		// pick this randomly and allocate to the grid as well
		var rowIndex = Math.floor(Math.random() * (grid.length));
		var colIndex = Math.floor(Math.random() * (grid.length));
		while (grid[rowIndex][colIndex] != EMPTY_GRID)
		{
			rowIndex = Math.floor(Math.random() * (grid.length));
			colIndex = Math.floor(Math.random() * (grid.length));
		}
		
		// location data
		this.rowIndex = rowIndex;
		this.colIndex = colIndex;
		grid[this.rowIndex][this.colIndex] = id;
	}
	
	infect()
	{
		this.status = InfectStatus;
	}
	
	kill(grid)
	{
		this.status = DeadStatus;
		grid[this.rowIndex][this.colIndex] = EMPTY_GRID;
	}
	
	cure()
	{
		this.status = RecoverStatus;
	}
	
	// move rnadomly the people
	move(grid) 
	{
		// if dead, do not move
		if (this.status == DeadStatus)
		{
			return;
		}
		
		var tryCount = 0;
		var maxTries = 27;
		var newLocation = this.generate_move_location();
		// try move randomly, make sure the location is free 
		while (grid[newLocation[0]][newLocation[1]] != EMPTY_GRID && tryCount < maxTries)
		{
			tryCount++;
			newLocation = this.generate_move_location();
		}
		// edge case, keep in the same place 
		if (tryCount >= maxTries)
		{
			newLocation = [this.rowIndex, this.colIndex];
		}
		// update grid
		grid[this.rowIndex][this.colIndex] = EMPTY_GRID;
		grid[newLocation[0]][newLocation[1]] = this.id;
		
		// update the people about it's new location
		this.rowIndex = newLocation[0];
		this.colIndex = newLocation[1];
		
		// check about status changes
		if (this.status == InfectStatus && this.statusDays[this.status] > this.delay_moves)
		{
			if (this.recover_chance < Math.random())
			{
				this.status = RecoverStatus;
			}			
			else
			{
				this.status = DeadStatus;
				grid[this.rowIndex][this.colIndex] = EMPTY_GRID;
			}
		}
		
		// mark how this day pass for this people
		this.statusDays[this.status]++;
	}
	
	// infect people next to it
	infect(k_value, p_value, grid, population) 
	{	
		// only if infected you can infect others
		if (this.status == InfectStatus && this.statusDays[InfectStatus] > 0 && p_value >= Math.random())
		{
			// clac indexes once to reduce time later 
			var rowUpIndex = this.rowIndex + 1;
			if (rowUpIndex >= grid.length)
			{
				rowUpIndex -= grid.length;
			}
			var rowDownIndex = this.rowIndex - 1;
			if (rowDownIndex < 0)
			{
				rowDownIndex += grid.length;
			}
			var colUpIndex = this.colIndex + 1;
			if (colUpIndex >= grid.length)
			{
				colUpIndex -= grid.length;
			}
			var colDownIndex = this.colIndex - 1;
			if (colDownIndex < 0)
			{
				colDownIndex += grid.length;
			}
			
			// check if we pass the L value days
			var this_k_value = k_value;
			if (count < Lvalue)
			{
				this_k_value = 0;
			}
			
			// check if location and make sure the k_value allow this
			if (this_k_value == 0 && grid[rowUpIndex][this.colIndex] != EMPTY_GRID && population[grid[rowUpIndex][this.colIndex]].status != RecoverStatus)
			{
				population[grid[rowUpIndex][this.colIndex]].status = InfectStatus;
			}
			if (this_k_value <= 1 && grid[rowUpIndex][colUpIndex] != EMPTY_GRID && population[grid[rowUpIndex][colUpIndex]].status != RecoverStatus)
			{
				population[grid[rowUpIndex][colUpIndex]].status = InfectStatus;
			}
			if (this_k_value <= 2 && grid[this.rowIndex][colUpIndex] != EMPTY_GRID && population[grid[this.rowIndex][colUpIndex]].status != RecoverStatus)
			{
				population[grid[this.rowIndex][colUpIndex]].status = InfectStatus;
			}
			if (this_k_value <= 3 && grid[rowUpIndex][colUpIndex] != EMPTY_GRID && population[grid[rowUpIndex][colUpIndex]].status != RecoverStatus)
			{
				population[grid[rowUpIndex][colUpIndex]].status = InfectStatus;
			}
			if (this_k_value <= 4 && grid[rowDownIndex][colUpIndex] != EMPTY_GRID && population[grid[rowDownIndex][colUpIndex]].status != RecoverStatus)
			{
				population[grid[rowDownIndex][colUpIndex]].status = InfectStatus;
			}
			if (this_k_value <= 5 && grid[rowDownIndex][this.colIndex] != EMPTY_GRID && population[grid[rowDownIndex][this.colIndex]].status != RecoverStatus)
			{
				population[grid[rowDownIndex][this.colIndex]].status = InfectStatus;
			}
			if (this_k_value <= 6 && grid[rowDownIndex][colDownIndex] != EMPTY_GRID && population[grid[rowDownIndex][colDownIndex]].status != RecoverStatus)
			{
				population[grid[rowDownIndex][colDownIndex]].status = InfectStatus;
			}
			if (this_k_value <= 7 && grid[this.rowIndex][colDownIndex] != EMPTY_GRID && population[grid[this.rowIndex][colDownIndex]].status != RecoverStatus)
			{
				population[grid[this.rowIndex][colDownIndex]].status = InfectStatus;
			}
			if (this_k_value <= 8 && grid[rowUpIndex][colDownIndex] != EMPTY_GRID && population[grid[rowUpIndex][colDownIndex]].status != RecoverStatus)
			{
				population[grid[rowUpIndex][colDownIndex]].status = InfectStatus;
			}
		}
	}
	
	// print the population on the screen
	show() 
	{
		// if dead, not on board
		if (this.status == DeadStatus)
		{
			return;
		}
		
		var boxSize =  widthElement / gridSize;
		if (this.status == InfectStatus)
		{
			fill("#DB4437");
			stroke("#DB4437");
		}
		else if (this.status == HealtyStatus)
		{
			fill("#0F9D58");	
			stroke("#0F9D58");
		}
		else if (this.status == RecoverStatus)
		{
			fill("#4285F4");	
			stroke("#4285F4");
		}
		ellipse((this.rowIndex + 0.5) * boxSize, (this.colIndex + 0.5) * boxSize, Math.floor(boxSize * 5 / 6), Math.floor(boxSize * 5 / 6));
	}
	
	/* help functions */
	
	// pick a random location next to the people's location 
	generate_move_location()
	{
		var rowMove = Math.floor(Math.random() * 3)  - 1
		var colMove = Math.floor(Math.random() * 3)  - 1
		var newRow = (this.rowIndex + rowMove);
		if (newRow < 0)
		{
			newRow += grid.length;
		}
		else if (newRow >= grid.length)
		{
			newRow -= grid.length;
		}
		var newCol = (this.colIndex + colMove);
		if (newCol < 0)
		{
			newCol += grid.length;
		}
		else if (newCol >= grid.length)
		{
			newCol -= grid.length;
		}
		return [newRow, newCol];
	}
	
	/* end - help functions */
}