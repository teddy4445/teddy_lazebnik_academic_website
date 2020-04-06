google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawConsensusGraph);
google.charts.setOnLoadCallback(drawStateDistrebution);
google.charts.setOnLoadCallback(drawPopulationSizeAvgConversionPerP);
google.charts.setOnLoadCallback(drawPValuePopulationVectorGraph);

// function to draw all charts together
function drawCharts()
{
	try
	{
		drawConsensusGraph();
		drawStateDistrebution();
		drawPopulationSizeAvgConversionPerP();
		drawPValuePopulationVectorGraph();
	}
	catch (error)
	{
		console.log(error);
	}
}

function drawConsensusGraph()
{

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Generations To Consensus | N = ' + populationSize);

      data.addRows(consensusGraph);

      var options = {
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#757575'],
        hAxis: {
          title: 'Run Time Index'
        },
        vAxis: {
          title: 'Generation'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('consensusGraph'));

      chart.draw(data, options);
}

function drawStateDistrebution()
{

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Healthy');
      data.addColumn('number', 'Infected');
      data.addColumn('number', 'Dead');
      data.addColumn('number', 'Recovered');

      data.addRows(stateGraphDate);

      var options = {
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#0F9D58', '#DB4437', '#000000', '#4285F4'],
        hAxis: {
          title: 'Generation'
        },
        vAxis: {
          title: 'Count'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('stateGraph'));

      chart.draw(data, options);
}

function drawPopulationSizeAvgConversionPerP()
{

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Avg number of generations');

      data.addRows(populationSizeAvgConversionPerP);

      var options = {
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#353535'],
        hAxis: {
          title: 'Popualtion Size'
        },
        vAxis: {
          title: 'Generations Count'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('populationSizeAvgConversionPerP'));

      chart.draw(data, options);
}

function drawPValuePopulationVectorGraph()
{

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
	  for (var i = 0; i < repeatTimesDone; i++)
	  {
		  data.addColumn('number', 'pop = ' + (populationSizeOriginal + i * populationSizeDelta));
	  }

      data.addRows(pValuePopulationVectorGraph);

      var options = {
		pointSize: 6,
		pointShape: 'circle',
        hAxis: {
          title: 'Infection Chance'
        },
        vAxis: {
          title: 'Avg number of generation that all population infected'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('pValuePopulationVectorGraph'));

      chart.draw(data, options);
}
