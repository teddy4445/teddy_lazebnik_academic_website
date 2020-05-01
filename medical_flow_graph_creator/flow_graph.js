let last_fg = new Stack();

function add_last_fq(new_fq)
{
	last_fg.push(new_fq);	
	if (last_fg.size() > 10)
	{
		last_fg.pop_end();
	}
}

class FlowGraph
{
	constructor()
	{
		this.nodes = [];
		this.edges = [];
		this.show_edges = [];
		this._marked_nodes = 0;
		this._running_id = 1;
	}
	
	copy()
	{
		var answer = new FlowGraph();
		answer._running_id = this._running_id;
		for (var i = 0; i < this.nodes.length; i++)
		{
			answer.nodes.push(this.nodes[i].copy());
		}
		for (var i = 0; i < this.edges.length; i++)
		{
			answer.edges.push(this.edges[i].copy());
		}
		for (var i = 0; i < this.show_edges.length; i++)
		{
			answer.show_edges.push(this.show_edges[i].copy());
		}
		return answer;
	}
	
	static from_json(json)
	{
		var answer = new FlowGraph();
		answer._running_id = json._running_id;
		for (var i = 0; i < json.nodes.length; i++)
		{
			answer.nodes.push(Node.from_json(json.nodes[i]));
		}
		for (var i = 0; i < json.edges.length; i++)
		{
			answer.edges.push(Edge.from_json(json.edges[i]));
		}
		for (var i = 0; i < json.show_edges.length; i++)
		{
			answer.show_edges.push(ShowEdge.from_json(json.show_edges[i]));
		}
		return answer;
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
	
	add_node(x, y, type, organ_name, lip, ts)
	{
		add_last_fq(this.copy());
		this.nodes.push(new Node(this._running_id, x, y, type, organ_name, lip, ts));
		console.log("Add node with id = " + this._running_id);
		this._running_id += 1;
	}
	
	delete_node(node_index)
	{
		add_last_fq(this.copy());
		var node_id = this.nodes[node_index].id;
		var i = 0;
		while(i < this.edges.length)
		{
			if (this.edges[i].start_node_id == node_id || this.edges[i].end_node_id == node_id)
			{
				this.edges.splice(i, 1);
				i -= 1;
			}
			i += 1;
		}
		this.nodes.splice(node_index, 1);
		console.log("Delete node with id = " + node_id);
	}
	
	try_delete_edge(x, y)
	{
		var id_to_index = {};
		for (var i = 0; i < this.nodes.length; i++)
		{
			id_to_index[this.nodes[i].id] = i;
		}
		
		for (var i = 0; i < this.edges.length; i++)
		{
			if (this.edges[i].need_show && distToSegment(new Point(x, y), this.nodes[id_to_index[this.edges[i].start_node_id]], this.nodes[id_to_index[this.edges[i].end_node_id]]) < MAX_R)
			{
				add_last_fq(this.copy());
				console.log("Delete edge with points: (" + this.edges[i].start_node_id + ", " + this.edges[i].end_node_id + ")");
				this.edges.splice(i, 1);
				break;
			}
		}
	}
	
	try_delete_show_edge(x, y)
	{	
		for (var i = 0; i < this.show_edges.length; i++)
		{
			if (distToSegment(new Point(x, y), new Point(this.show_edges[i].x1, this.show_edges[i].y1), new Point(this.show_edges[i].x2, this.show_edges[i].y2)) < MAX_R)
			{
				add_last_fq(this.copy());
				var name = this.show_edges[i].name;
				console.log("Delete show edge named: " + name);
				
				for (var node_index = 0; node_index < this.nodes.length; node_index++)
				{
					if(this.nodes[node_index].organ_name.includes(name))
					{
						this.delete_node(node_index);
						node_index -= 1;
					}
				}
				
				this.show_edges.splice(i, 1);
				break;
			}
		}
	}
	
	add_edge(node_i_index, node_j_index, w, type)
	{
		add_last_fq(this.copy());
		var node_i_id = this.nodes[node_i_index].id;
		var node_j_id = this.nodes[node_j_index].id;
		
		if (this.has_this_edge(node_i_index, node_j_index))
		{
			return false;
		}
		
		this.edges.push(new Edge(node_i_id, node_j_id, w, type));
		console.log("Add edge with points: (" + node_i_id + ", " + node_j_id + ")");
		return true;
	}
	
	add_show_edge(start_node_index, end_node_index, name)
	{
		add_last_fq(this.copy());
		if (this.has_this_edge(start_node_index, end_node_index))
		{
			this.try_delete_edge(this.nodes[start_node_index].x, this.nodes[end_node_index].y);
		}
		
		this.show_edges.push(new ShowEdge(this.nodes[start_node_index].x, this.nodes[start_node_index].y,
										  this.nodes[end_node_index].x, this.nodes[end_node_index].y,
										  name));
	}
	
	has_this_edge(node_i_index, node_j_index)
	{
		var node_i_id = this.nodes[node_i_index].id;
		var node_j_id = this.nodes[node_j_index].id;
		
		for (var i = 0; i < this.edges.length; i++)
		{
			if ((this.edges[i].start_node_id == node_i_id && this.edges[i].end_node_id == node_j_id) || 
				(this.edges[i].start_node_id == node_j_id && this.edges[i].end_node_id == node_i_id))
			{
				return true;
			}
		}
		return false;
	}
	
	nextToNode(x, y)
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			if(int(dist(this.nodes[i].x, this.nodes[i].y, x, y)) < MAX_R && this.nodes[i].need_show)
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
	
	pick_only(node_id)
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].marked = false;
			if(this.nodes[i].id == node_id)
			{
				this.nodes[i].marked = true;
			}
		}
		this._marked_nodes = 1;
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
		for (var i = 0; i < this.show_edges.length; i++)
		{
			this.show_edges[i].show(this.nodes);
		}
	}
	
	node_status(x, y)
	{
		var node_index = this.nextToNode(x, y);
		if (node_index == ERROR_VALUE)
		{
			return "";
		}	
		else
		{
			return this.nodes[node_index].to_string_status();
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
			degreesPerNode[this.edges[i].start_node_id] += 2;
			degreesPerNode[this.edges[i].end_node_id] += 2;
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
	
	to_string()
	{
		var edges = "edges = [";
		for (var i = 0; i < this.edges.length; i++)
		{
			edges += this.edges[i].to_string();
			if (i != this.edges.length - 1)
			{
				edges += ", ";
			}
		}
		edges += "]";
		var organs = "organs = [";
		var vassals = "vassals = [";
		for (var i = 0; i < this.nodes.length; i++)
		{
			if (this.nodes[i].type == ORGAN)
			{
				organs += this.nodes[i].to_string() + ", ";
			}
			else
			{
				vassals += this.nodes[i].to_string() + ", ";
			}
		} 
		organs += "]";
		vassals += "]";
		return edges + "\n" + vassals + "\n" + organs + "\nMnrFlowGraph(organs=organs, vassals=vassals, edges=edges)";
	}
}