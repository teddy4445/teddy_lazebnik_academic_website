class Graph
{
	constructor(nodes = [], edges = [])
	{
		// data
		this.nodes = nodes;
		this.edges = edges;
		
		// technical
		this.running_id = nodes.length;
	}
	
	buildGraphFromFile(dataJsonObj)
	{
		// print all nodes as polygons
		for (var i = 0; i < dataJsonObj["nodes"].length; i++)
		{
			this.add_node_from_json(dataJsonObj["nodes"][i]);
		}
		// print the edges  between the locations
		for (var i = 0; i < dataJsonObj["edges"].length; i++)
		{
			this.add_edge_from_json(dataJsonObj["edges"][i]);
		}
	}
	
	add_node(new_node)
	{
		new_node.id = ++this.running_id;
		this.nodes.push(new_node);
	}
	
	add_node_by_value(name, printPoly = [], population_size_dict = [])
	{
		this.nodes.push(new Node(++this.running_id, name, printPoly, population_size_dict));
	}
	
	add_node_from_json(jsonObj)
	{
		var printPoly = [];
		for (var i = 0; i < jsonObj["points"].length; i++)
		{
			printPoly.push(createVector(jsonObj["points"][i]["x"], jsonObj["points"][i]["y"]));
		}
		this.add_node_by_value(jsonObj["name"], printPoly);
	}
	
	add_edge(node_id_1, node_id_2)
	{
		this.edges.push(new Edge(node_id_1, node_id_2));
	}
	
	add_edge_from_json(jsonTwoIds)
	{
		this.add_edge(jsonTwoIds[0], jsonTwoIds[1]);
	}
	
	print()
	{
		// print all nodes as polygons
		for (var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].print();
		}
		// print the edges  between the locations
		for (var i = 0; i < this.edges.length; i++)
		{
			if (!this.edges[i].is_center_set())
			{
				this.edges[i].set_center(this.findNodeCenter(this.edges[i].node_id_1), this.findNodeCenter(this.edges[i].node_id_2));
				
			}
			this.edges[i].print();
		}
	}
	
	// help function //
	
	getNodeName(nodeIndex)
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			if (this.nodes[i].id == nodeIndex)
			{
				return this.nodes[i].name;
			}
		}
		throw "Cannot find the node";
	}
	
	findNodeCenter(nodeIndex)
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			if (this.nodes[i].id == nodeIndex)
			{
				return [this.nodes[i].center.x, this.nodes[i].center.y];
			}
		}
		throw "Cannot find the node";
	}
	
	// end - help function //
}

/* Graph's edge */
class Edge
{
	constructor(node_id_1, node_id_2, center_1 = [], center_2 = [])
	{
		this.node_id_1 = node_id_1;
		this.node_id_2 = node_id_2;
		
		this.center_1 = center_1;
		this.center_2 = center_2;
	}
	
	print()
	{
		stroke(0);
		strokeWeight(2);
		line(this.center_1[0], this.center_1[1], this.center_2[0], this.center_2[1]);
	}
	
	// help function //
	
	set_center(center_1, center_2)
	{
		this.center_1 = center_1;
		this.center_2 = center_2;
	}
	
	is_center_set()
	{
		return (this.center_1 == [] || this.center_2 == []);
	}
	
	// end - help function //
}

/* Graph's node */
class Node
{
	constructor(id, name, polyPoints = [], population = [])
	{
		// logical members
		this.id = id;
		this.name = name;
		this.population = population;
		
		// visualization members
		this.polyPoints = polyPoints;
		
		var centerX = 0;
		var centerY = 0;		
		for (var pointIndex = 0; pointIndex < this.polyPoints.length; pointIndex++)
		{
			centerX += this.polyPoints[pointIndex].x;
			centerY += this.polyPoints[pointIndex].y;
		}
		centerX /= this.polyPoints.length;
		centerY /= this.polyPoints.length;
		this.center = createVector(centerX, centerY); 
	}
	
	print()
	{    
		stroke(25);
		fill(250);
		strokeWeight(1);
		beginShape();
		this.polyPoints.forEach(pt => vertex(pt.x, pt.y));
		endShape(CLOSE);
		fill(25);
		textSize(16);
		text(this.name, this.center.x, this.center.y);
	}
	
	// help functions //
	
	// end function //
}