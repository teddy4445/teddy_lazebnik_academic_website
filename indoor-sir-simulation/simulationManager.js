/* Manages the overall simulator performance in one place */
class Simulator
{
	constructor(map_height, map_width)
	{
		// working members //
		this.population = Population();
		this.indoor = Graph([], [], map_height, map_width);
		this.time = 0;
		
		// graph related members //
		this.statesGraphData = [];
		
		// simulator paramaters members //
		this.statesGraphData = [];
	}
		
	// start the simulation and show it, hide the form 
	startSimulation()
	{	
		// TODO: load the data from the form and the json file
	
		// prevent the form to send something and by that break the page
		return false;
	}
	
	// main loop of the simulation logic
	step()
	{
		
	}
	
	// check if the pandemic is over
	is_over()
	{
		
	}
}