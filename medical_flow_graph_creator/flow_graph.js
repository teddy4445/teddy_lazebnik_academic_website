class FlowGraph
{
	constructor()
	{
		this.nodes = [];
		this.edges = [];
		this._marked_nodes = 0;
	}
	
	nodes_count()
	{
		return this.nodes.length;
	}
	
	edges_count()
	{
		return this.edges.length * 2;
	}
	
	picked_status()
	{
		return (this._marked_nodes > 0);
	}
	
	add_node(x, y, type)
	{
		this.nodes.push(new Node(this.nodes.length + 1, x, y, type));
	}
	
	add_edge(node_i_index, node_j_index, w, type)
	{	
		for (var i = 0; i < this.edges.length; i++)
		{
			if ((this.edges[i].start_node_index == node_i_index && this.edges[i].end_node_index == node_j_index) || 
				(this.edges[i].start_node_index == node_j_index && this.edges[i].end_node_index == node_i_index))
			{
				return false;
			}
		}
		this.edges.push(new Edge(node_i_index, node_j_index, w, type));
		return true;
	}
	
	nextToNode(x, y)
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			if(int(dist(this.nodes[i].x, this.nodes[i].y, x, y)) < MAX_R)
			{
				return i;
			}
		}
		return ERROR_VALUE;
	}
	
	get_picked_node()
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			if(this.nodes[i].marked)
			{
				return i;
			}
		}
		return ERROR_VALUE;
	}
	
	is_node_marked(node_index)
	{
		return this.nodes[node_index].marked;
	}
	
	mark_node(node_index)
	{
		this.nodes[node_index].mark();
		this._marked_nodes += 1;
	}
	
	unmark_node(node_index)
	{
		this.nodes[node_index].unmark();
		this._marked_nodes -= 1;
	}
	
	show()
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].show();
		}
		for (var i = 0; i < this.edges.length; i++)
		{
			this.edges[i].show(this.nodes);
		}
	}
	
	degree_histogram()
	{
		var degreesPerNode = [];
		for (var i = 0; i < this.nodes.length; i++)
		{
			degreesPerNode.push(0);
		}
		for (var i = 0; i < this.edges.length; i++)
		{
			degreesPerNode[this.edges[i].start_node_index] += 2;
			degreesPerNode[this.edges[i].end_node_index] += 2;
		}
		
		var degrees = {};
		for (var i = 0; i < degreesPerNode.length; i++)
		{
			if (!(degrees[degreesPerNode[i]] === undefined))
			{
				degrees[degreesPerNode[i]] += 1;
			}
			else
			{
				degrees[degreesPerNode[i]] = 1;
			}
		}
		var answer = [];
		for (var value in degrees)
		{
			answer.push([parseInt(value), degrees[value]]);
		}
		return answer;
	}
}