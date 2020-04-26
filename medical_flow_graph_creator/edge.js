class Edge
{
	constructor(start_node_index, end_node_index, w, type)
	{
		this.start_node_index = start_node_index;
		this.end_node_index = end_node_index;
		this.w = w;
		this.type = type;
	}
	
	show(nodes) 
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
		strokeWeight(this.w);
		line(nodes[this.start_node_index].x, nodes[this.start_node_index].y, nodes[this.end_node_index].x, nodes[this.end_node_index].y);
	}
	
	to_string()
	{
		return "Edge()";
	}
}