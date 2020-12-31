OUT_OF_GRAPH_LOCATION = 0;

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
		this.add_node_by_value(jsonObj["name"], jsonObj["volume"], printPoly);
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
			this.nodes[i].print({"none": 0});
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
	
	// logical functions //
	
	updateMemberLocation(fromToMember)
	{
		if (fromToMember[0] != OUT_OF_GRAPH_LOCATION)
		{
			this.nodes[fromToMember[0]-1].populationCount--;	
		}
		if (fromToMember[1] != OUT_OF_GRAPH_LOCATION)
		{
			this.nodes[fromToMember[1]-1].populationCount++;	
		}
	}
	
	getNodeDensity(nodeIndex)
	{
		return this.nodes[nodeIndex].density();
	}
	
	getNodesCount()
	{
		return this.nodes.length;
	}
	
	// end - logical functions //
	
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
	
	getPopulationDistrebution(popCount = 0)
	{	
		if (popCount <= 0)
		{
			popCount = 1;
		}	
		var data = [['Location', 'Individuals']];
		for (var i = 0; i < this.nodes.length; i++)
		{
			data.push([this.nodes[i].name, this.nodes[i].populationCount / popCount]);
		}
		return google.visualization.arrayToDataTable(data);
	}
	
	// end - help function //
	
	// visualization help functions //
	
	getPlotWidth()
	{
		var answer = 0;
		for (var i = 0; i < this.nodes.length; i++)
		{
			var width = this.nodes[i].getPlotWidth();
			if (width > answer)
			{
				answer = width;
			}
		}
		return answer;
	}
	
	getPlotHeight()
	{
		var answer = 0;
		for (var i = 0; i < this.nodes.length; i++)
		{
			var height = this.nodes[i].getPlotHeight();
			if (height > answer)
			{
				answer = height;
			}
		}
		return answer;
	}
	
	// end - visualization help functions //
	
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
		stroke(25);
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
	constructor(id, name, volume, polyPoints = [], populationCount = 0)
	{
		// logical members
		this.id = id;
		this.name = name;
		this.populationCount = populationCount;
		this.volume = volume;
		
		// visualization members
		this.polyPoints = polyPoints;
		
		var first = polyPoints[0];
		var last = polyPoints[polyPoints.length-1];
		var minY = first.y;
		if (first.x != last.x || first.y != last.y) 
		{
			polyPoints.push(first);
		}
		var twicearea = 0;
		var x = 0;
		var y = 0;
		var p1;
		var p2;
		var f;
		for (var i = 0, j = polyPoints.length - 1 ; i < polyPoints.length; j = i++) 
		{
			p1 = polyPoints[i];
			p2 = polyPoints[j];
			f = p1.x * p2.y - p2.x * p1.y;
			twicearea += f;
			x += ( p1.x + p2.x ) * f;
			y += ( p1.y + p2.y ) * f;
			
			if (p1.y < minY)
			{
				minY = p1.y;
			}
			if (p2.y < minY)
			{
				minY = p2.y;
			}
		}
		f = twicearea * 3;
		this.center = createVector(x/f, y/f); 
		this.upperY = minY;
	}
	
	density()
	{
		if (this.volume > 0)
		{
			return this.populationCount / this.volume;
		}
		throw "node with name '" + this.name + "' has negative or zero volume";
	}
	
	print(popDist, is_detailed = false)
	{
		var color = mixedColor(COLORS, popDist);
		stroke(25);
		strokeWeight(2);
		fill(color[0], color[1], color[2]);
		beginShape();
		this.polyPoints.forEach(pt => vertex(pt.x, pt.y));
		endShape(CLOSE);
		var textColor = colorOnBackground(color);
		fill(textColor);
		stroke(textColor);
		textSize(12);
		strokeWeight(0);
		if (is_detailed)
		{
			text(this.name, this.center.x, this.upperY + 14);
		}
		else
		{
			text(this.name, this.center.x, this.center.y);
		}
	}
	
	printDetailed(popDist)
	{
		this.print(popDist, true);
		textSize(8);
		var yDelta = 10;
		var textCount = 1;
		Object.entries(popDist).forEach(([key, count]) => {
		   text(key + ": " + count, this.center.x, this.upperY + 14 + textCount * yDelta);
		   textCount++;
		});
	}
	
	// visualization help functions //
	
	getPlotWidth()
	{
		var answer = 0;
		for (var i = 0; i < this.polyPoints.length; i++) 
		{
			var width = this.polyPoints[i].x;
			if (width > answer)
			{
				answer = width;
			}
		}
		return answer;
	}
	
	getPlotHeight()
	{
		var answer = 0;
		for (var i = 0; i < this.polyPoints.length; i++) 
		{
			var height = this.polyPoints[i].y;
			if (height > answer)
			{
				answer = height;
			}
		}
		return answer;
	}
	
	
	
	// end - visualization help functions //
	
	// help functions //
	
	// end function //
}