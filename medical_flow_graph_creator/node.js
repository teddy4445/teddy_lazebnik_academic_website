class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
	
	show() 
	{
		var r = MAX_R / 4;
		ellipse(this.x, this.y, r, r);
	}
	
}

class Node
{
	constructor(id, x, y, type, organ_name, lip, ts)
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.type = type;
		this.marked = false;
		this.organ_name = organ_name;
		this.lip = lip;
		this.ts = ts;
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
			if (this.type == ORGAN)
			{				
				fill(150, 100, 200);
				stroke(150, 100, 200);
			}
			else
			{
				fill("yellow");
				stroke("yellow");	
			}
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
	
	to_string(drugs_string)
	{
		if (this.type == ORGAN)
		{
			return "OrganNode(population=[], time_span=" + this.ts + ", location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + ", 0], " +
			"local_interaction_protocol=" + this.lip + ", name=\"" + this.organ_name + "\", drugs=" + drugs_string + ", index=" + this.id + ")";	
		}
		else
		{
			// TODO: change vassal_type to be dynamic
			return "VassalNode(population=[], color=True, location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + ", 0], vassal_type=VassalNode.type_artery, index=" + this.id + ")";
		}
	}
	
	to_string_status()
	{
		if (this.type == ORGAN)
		{
			return "Organ(ts=" + this.ts + ", location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + "], " +
			"lip=" + this.lip + ", name=\"" + this.organ_name + "\", id=" + this.id + ")";	
		}
		else
		{
			// TODO: change vassal_type to be dynamic
			return "Vassal(location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + "], id=" + this.id + ")";
		}
	}
}