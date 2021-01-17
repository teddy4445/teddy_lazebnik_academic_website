google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawStateDistrebution);
google.charts.setOnLoadCallback(drawEconomicsGraph);
google.charts.setOnLoadCallback(drawConsumersGraph);
google.charts.setOnLoadCallback(drawRzeroGraph);

function drawAll()
{
	drawStateDistrebution();
	drawRzeroGraph();
	drawEconomicsGraph();
	drawConsumersGraph();
}

function drawStateDistrebution()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'Infected Working Adult');
	data.addColumn('number', 'Susceptible Working Adult');
	data.addColumn('number', 'Recovered Working Adult');
	data.addColumn('number', 'Dead Working Adult');
	data.addColumn('number', 'Infected Nonworking Adult');
	data.addColumn('number', 'Susceptible Nonworking Adult');
	data.addColumn('number', 'Recovered Nonworking Adult');
	data.addColumn('number', 'Dead Nonworking Adult');
	data.addColumn('number', 'Infected Children');
	data.addColumn('number', 'Susceptible Children');
	data.addColumn('number', 'Recovered Children');
	data.addColumn('number', 'Dead Children');

	data.addRows(stateGraphData);

	var options = {
		height: 500,
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#DB4437', '#0F9D58', '#4285F4', '#140304', '#DB4667', '#0F9E76', '#4492F1', '#140304', '#eb1d0c', '#1aba7d', '#73a0eb', '#0f0102'],
        hAxis: {
			title: 'Day'
        },
        vAxis: {
			title: 'Count'
        },
		series: {
			0: { lineDashStyle: [4, 4] },
			1: { lineDashStyle: [4, 4] },
			2: { lineDashStyle: [4, 4] },
			3: { lineDashStyle: [4, 4] },
			4: { lineDashStyle: [8, 8] },
			5: { lineDashStyle: [8, 8] },
			6: { lineDashStyle: [8, 8] },
			7: { lineDashStyle: [8, 8] },
			8: { lineDashStyle: [1, 1] },
			9: { lineDashStyle: [1, 1] },
			10: { lineDashStyle: [1, 1] },
			11: { lineDashStyle: [1, 1] }
		}
      };

    var chart = new google.visualization.LineChart(document.getElementById('stateGraph'));
	chart.draw(data, options);
}

function drawEconomicsGraph()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'Economic Delta');
	
	data.addRows(economicGraphData);

	var options = {
		height: 300,
		pointSize: 3,
		pointShape: 'circle',
		colors: ['#000000'],
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Dollers'
        }
	};

	var chart = new google.visualization.LineChart(document.getElementById('economicsGraph'));
	chart.draw(data, options);
}

function drawConsumersGraph()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'Nonworking adults getting taxes');
	
	data.addRows(consumersGraph);

	var options = {
		height: 300,
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#DE5246'],
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Dollers'
        }
	};

	var chart = new google.visualization.LineChart(document.getElementById('consumersGraph'));
	chart.draw(data, options);
}

function drawRzeroGraph()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'R_0');
	data.addColumn('number', 'Outbreak threshold');

	data.addRows(rzeroGraphData);

	var options = {
		height: 300,
		pointSize: 3,
		pointShape: 'circle',
		colors: ['#DE5246', '#000000'],
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Value'
        }
	};
	  
	var chart = new google.visualization.LineChart(document.getElementById('rzeroGraph'));
	chart.draw(data, options);
}
