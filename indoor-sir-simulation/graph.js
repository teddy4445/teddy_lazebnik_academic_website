class Graph
{
	constructor(nodes = [], edges = [], mapHeight, mapWidth)
	{
		// data
		this.nodes = nodes;
		this.edges = edges;
		
		// technical
		this.running_id = nodes.length;
		
		// vizualization
		this.mapHeight = mapHeight;
		this.mapWidth = mapWidth;
	}
	
	buildGraphFromFile(dataJsonObj)
	{
		//TODO: finish here
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
		// print all nodes as polygons
		for (var i = 0; i < this.nodes; i++)
		{
			this.nodes[i].print();
		}
		// print the edges  between the locations
		for (var i = 0; i < this.edges; i++)
		{
			this.nodes[i].print();
		}
	}
}

/* Graph's edge */
class Edge
{
	constructor(node_id_1, node_id_2)
	{
		this.node_id_1 = node_id_1;
		this.node_id_2 = node_id_2;
	}
	
	print(poly_center_1, poly_center_2)
	{
		strike(0);
		line(poly_center_1.x, poly_center_1.y, poly_center_2.x, poly_center_2.y);
	}
}

/* Graph's node */
class Node
{
	constructor(id, population, polyPoints = [])
	{
		// logical members
		this.id = id;
		this.population = population;
		
		// visualization members
		this.polyPoints = polyPoints;
	}
	
	print()
	{    
		strike(50);
		beginShape()
		this.polyPoints.forEach(pt => vertex(pt.x, pt.y))
		endShape(CLOSE)
	}
	
	// help functions //
	
	// end function //
}