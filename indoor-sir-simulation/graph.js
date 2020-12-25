class Graph
{
	constructor(nodes = [], edges = [], map_height, map_width)
	{
		// data
		this.nodes = nodes;
		this.edges = edges;
		
		// technical
		this.running_id = nodes.length;
		
		// vizualization
		this.map_height = map_height;
		this.map_width = map_width;
	}
	
	add_node(new_node)
	{
		new_node.id = ++this.running_id;
		this.nodes.push(new_node);
	}
	
	add_node_by_value(population_size_dict)
	{
		this.nodes.push(Node(++this.running_id, population_size_dict));
	}
	
	add_edge(node_id_1, node_id_2)
	{
		this.edges.push(Edge(node_id_1, node_id_2));
	}
	
	print()
	{
		// TODO: finish here
	}
}

class Edge
{
	constructor(node_id_1, node_id_2)
	{
		this.node_id_1 = node_id_1;
		this.node_id_2 = node_id_2;
	}
}

class Node
{
	constructor(id, population_size_dict, map_x, map_y, map_height, map_width)
	{
		this.id = id;
		this.population = population_size_dict;
		
		// visualization properties 
		this.map_x = map_x;
		this.map_y = map_y; 
		this.map_height = map_height;
		this.map_width = map_width;
	}
}