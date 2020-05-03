class ShowEdge
{
	constructor(x1, y1, x2, y2, name)
	{
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.name = name;
		this.centerPoint = halfWayDot(this.x1, this.y1, this.x2, this.y2);
		var m = line_m(this.x1, this.y1, this.x2, this.y2);
		if (this.y1 == this.y2)
		{
			this.rotation = 0;
		}
		else if (this.x1 == this.x2)
		{
			this.rotation = 90;
		}
		else if (m != 0)
		{
			this.rotation = Math.atan(m) / Math.PI * 180;
		}
		else
		{
			this.rotation = 0;
		}
	}
	
	copy()
	{
		var answer = new ShowEdge(this.x1, this.y1, this.x2, this.y2, this.name);
		answer.need_show = this.need_show;
		return answer;
	}
	
	static from_json(json)
	{
		var answer = new ShowEdge(json.x1, json.y1, json.x2, json.y2, json.name);
		answer.need_show = json.need_show;
		return answer;
	}
	
	show(nodes) 
	{
		strokeWeight(1);
		stroke(6, 255, 136);
		line(this.x1, this.y1, this.x2, this.y2);	
		strokeWeight(0);
		textSize(10);
		rectMode(CENTER);
		angleMode(DEGREES);
		push();
		var text_width = textWidth(this.name);
		translate(this.centerPoint.x - text_width / 2, this.centerPoint.y);
		rotate(this.rotation);
		text(this.name, 0, 0);
		pop();
	}
}

class Edge
{
	constructor(start_node_id, end_node_id, w, type)
	{
		this.start_node_id = start_node_id;
		this.end_node_id = end_node_id;
		this.w = w;
		this.type = type;
		this.need_show = true;
	}
	
	copy()
	{
		var answer = new Edge(this.start_node_id, this.end_node_id, this.w, this.type);
		answer.need_show = this.need_show;
		return answer;
	}
	
	static from_json(json)
	{
		var answer = new Edge(json.start_node_id, json.end_node_id, json.w, json.type);
		answer.need_show = json.need_show;
		return answer;
	}
	
	hide()
	{
		this.need_show = false;
	}
	
	allow_show()
	{
		this.need_show = true;
	}
	
	show(nodes) 
	{
		// if don't need to show just jump it
		if (!this.need_show)
		{
			return;
		}
		
		try
		{
			if (this.type == RED_TYPE)
			{
				stroke("#DB4437");
			}
			else if (this.type == BLUE_TYPE)
			{
				stroke("#4285F4");
			}
			stroke("#fcce76");
			strokeWeight(this.w / 100);
			
			var start_node = null;
			var end_node = null;
			for(var i = 0; i < nodes.length; i++)
			{
				if (nodes[i].id == this.start_node_id)
				{
					start_node = nodes[i];
				}
				if (nodes[i].id == this.end_node_id)
				{
					end_node = nodes[i];
				}
			}
			// print line
			line(start_node.x, start_node.y, end_node.x, end_node.y);			
		}
		catch (error)
		{
			console.log("Cannot draw line with nodes ids: (" + this.start_node_id + ", " + this.end_node_id + ")");
		}
	}
	
	to_string()
	{
		return "WEdge(source_node_index=" + (this.start_node_id - 1) + ", target_node_index=" + (this.end_node_id - 1) + ", score=" + this.w + ")";
	}
}