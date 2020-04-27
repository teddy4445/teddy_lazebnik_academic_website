class Edge
{
	constructor(start_node_id, end_node_id, w, type)
	{
		this.start_node_id = start_node_id;
		this.end_node_id = end_node_id;
		this.w = w;
		this.type = type;
	}
	
	show(nodes) 
	{
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
		return "WEdge(source_node_index=" + this.start_node_id + ", target_node_index=" + this.end_node_id + ", score=" + this.w + ")";
	}
}