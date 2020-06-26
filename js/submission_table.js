function printSubbmitionTable(table_object, students_data, weights = [])
{
	// simple avg
	if (weights.length != students_data[0].length - 1)
	{
		weights = [];
		for (var i = 0; i < students_data[0].length - 1; i++)
		{
			weights.push(1 / (students_data[0].length - 1));
		}
	}
	
	for (var i = 0; i < students_data.length; i++ )
	{
		let score = 0;
		var next_row_element = document.createElement('tr');
		var first_cell = document.createElement('th');
		first_cell.innerHTML = (i+1) + '';
		next_row_element.appendChild(first_cell);
		for (var j = 0; j < students_data[i].length; j++)
		{
			if (j > 0)
			{
				score += students_data[i][j] * weights[j-1];
			}
			var next_cell = document.createElement('td');
			next_cell.innerHTML = students_data[i][j];
			next_row_element.appendChild(next_cell);
		}
		var next_cell = document.createElement('td');
		next_cell.innerHTML = score.toFixed(1);
		next_row_element.appendChild(next_cell);
		table_object.appendChild(next_row_element);
	}
}

function fill_table(table_object, students_data)
{
	for (var i = 0; i < students_data.length; i++ )
	{
		let score = 0;
		var next_row_element = document.createElement('tr');
		var first_cell = document.createElement('th');
		first_cell.innerHTML = (i+1) + '';
		next_row_element.appendChild(first_cell);
		for (var j = 0; j < students_data[i].length; j++)
		{
			var next_cell = document.createElement('td');
			next_cell.innerHTML = students_data[i][j];
			next_row_element.appendChild(next_cell);
		}
		table_object.appendChild(next_row_element);
	}
}