google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.load("current", {packages:['corechart']});

function drawAll()
{
	drawStateDistrebution();
	drawLocationStateDistrebution();
	drawDistrebutionPerLocationGraph();
}


function drawLocationStateDistrebution() 
{
	var data = google.visualization.arrayToDataTable([
         ['Population', 'Percent Of the Population', { role: 'style' }],
         ['Susceptible Adult', sim.statesNormalizedBarGraphData[0], '#0F9D58'],         
         ['Exposed Adult', sim.statesNormalizedBarGraphData[1], '#F4B400'],            
         ['Symptomatic Infected Adult', sim.statesNormalizedBarGraphData[2], '#DB4437'],  
         ['Aymptomatic Infected Adult', sim.statesNormalizedBarGraphData[3], '#FF3337'],
         ['Recovered Adult', sim.statesNormalizedBarGraphData[4], '#4285F4'],
         ['Dead Adult', sim.statesNormalizedBarGraphData[5], '#112211'],
         ['Susceptible Children', sim.statesNormalizedBarGraphData[6], '#0FFF44'],         
         ['Exposed Children', sim.statesNormalizedBarGraphData[7], '#0FBD68'],            
         ['Symptomatic Infected Children', sim.statesNormalizedBarGraphData[8], '#EE4437'],  
         ['Aymptomatic Infected Children', sim.statesNormalizedBarGraphData[9], '#DD3344'],
         ['Recovered Children', sim.statesNormalizedBarGraphData[10], '#4255FF'],
         ['Dead Children', sim.statesNormalizedBarGraphData[11], '#221122']
	]);

	var view = new google.visualization.DataView(data);
	view.setColumns([0, 1, {calc: "stringify", sourceColumn: 1, type: "string", role: "annotation" }, 2]);
	  
	var options = 
	{
		height: 500,
		hAxis: 
		{
			title: 'Epidemiological State'
		},
		vAxis: 
		{
			title: 'Percent Of The Population',
			ticks: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
		},
		legend: {position: 'none'},
        bar: {groupWidth: "80%"}
	};
	
	var chart = new google.visualization.ColumnChart(document.getElementById('locationStateBarGraph'));
	chart.draw(data, options);
}


function drawDistrebutionPerLocationGraph(data) 
{	  
	var options = 
	{
		height: 500,
		hAxis: 
		{
			title: 'Epidemiological State'
		},
		vAxis: 
		{
			title: 'Portion Of The Population',
			ticks: [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1]
		},
		legend: {position: 'none'},
        bar: {groupWidth: "80%"}
	};
	
	var chart = new google.visualization.ColumnChart(document.getElementById('distrebutionPerLocationGraph'));
	chart.draw(data, options);
}

function drawStateDistrebution()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'Susceptible Adult');
	data.addColumn('number', 'Exposed Adult');
	data.addColumn('number', 'Symptomatic Infected Adult');
	data.addColumn('number', 'Asymptomatic Infected Adult');
	data.addColumn('number', 'Recovered Adult');
	data.addColumn('number', 'Dead Adult');
	data.addColumn('number', 'Susceptible Children');
	data.addColumn('number', 'Exposed Children');
	data.addColumn('number', 'Symptomatic Infected Children');
	data.addColumn('number', 'Asymptomatic Infected Children');
	data.addColumn('number', 'Recovered Children');
	data.addColumn('number', 'Dead Children');

	data.addRows(sim.statesGraphData);

	var options = {
		height: 500,
		pointSize: 6,
		pointShape: 'circle',
        hAxis: {
			title: 'Day'
        },
        vAxis: {
			title: 'Count'
        },
		colors: ['#0F9D58', '#F4B400', '#DB4437', '#FF3337', '#4285F4', '#112211', '#0FFF44', '#0FBD68', '#EE4437', '#DD3344', '#4255FF', '#221122'],
		series: {
			0: { lineDashStyle: [4, 4] },
			1: { lineDashStyle: [4, 4] },
			2: { lineDashStyle: [4, 4] },
			3: { lineDashStyle: [4, 4] },
			4: { lineDashStyle: [4, 4] },
			5: { lineDashStyle: [4, 4] },
			6: { lineDashStyle: [1, 1] },
			7: { lineDashStyle: [1, 1] },
			8: { lineDashStyle: [1, 1] },
			9: { lineDashStyle: [1, 1] },
			10: { lineDashStyle: [1, 1] },
			11: { lineDashStyle: [1, 1] }
		}
      };

    var chart = new google.visualization.LineChart(document.getElementById('stateGraph'));
	chart.draw(data, options);
}
