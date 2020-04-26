class Node
{
	constructor(id, x, y, type)
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.type = type;
		this.marked = false;
	}
	
	mark()
	{
		this.marked = true;
	}
	
	unmark()
	{
		this.marked = false;
	}
	
	show() 
	{
		if (!this.marked)
		{
			fill("yellow");
			stroke("yellow");	
		}
		else
		{
			fill("red");
			stroke("red");	
		}
		var r = MAX_R / 3;
		if (this.status == ORGAN)
		{
			r = MAX_R / 2;
		}
		// print place
		ellipse(this.x, this.y, r, r);
		
		// print id
		fill(255, 255, 255);
		strokeWeight(0);
		textSize(12);
		text('' + this.id, this.x - 10, this.y - 10);
	}
	
	to_string()
	{
		return "Node()";
	}
}