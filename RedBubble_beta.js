// I LOVE MY WIFE

//var payments = document.getElementsByClassName("payments")[0].childNodes[1].childNodes;
/*
for(var row = 1; row < payments.length; row += 1) {
	console.log(payments[row].childNodes[5]);
}*/

// to import the plotly library
function init(data) {
	var node = document.createElement("script");
	node.setAttribute("src", "https://cdn.plot.ly/plotly-latest.min.js");
	var script = document.createTextNode("");
	node.appendChild(script);
	document.getElementsByTagName("head")[0].appendChild(node);

	node = document.createElement("div");
	node.setAttribute("id", "tester");
	node.setAttribute("style", "width:auto;height:auto;");
	var list = document.getElementById("payable-info");
	list.insertBefore(node, list.childNodes[1]);
	var layout = "var layout = { title: 'Monthly Profit'," +
					"xaxis: { title: 'Days since last payout', showgrid: true, zeroline: true }, " +
	"yaxis: { title: '$Total Profit', showgrid: true, zeroline: true } };\n"
	node = document.createElement("script");
	var string ="function myFunction() {\n" + box_plot_data_string(data)+"}"
	
	script = document.createTextNode(string);
	node.appendChild(script);
	document.getElementsByTagName("body")[0].appendChild(node);
	node = document.createElement("button");
	node.setAttribute("onclick", "myFunction()");
	script = document.createTextNode("try me");
	node.appendChild(script);
	list.insertBefore(node, list.childNodes[2]);
}




// given a 2d array of values with each array denoting a new day
function box_plot_data_string(data) {
	string = "var ";
	for(var day = 0; day < data.length; ++day) {
		string += "d" + day + " = [";
		for(var sale = 0; sale < data[day].length; ++sale) {
			string += data[day][sale];
			if(sale + 1 < data[day].length) {
				string += ", ";
			}
		}
		string += "]";
		if(day + 1 < data.length) {
			string += ", ";
		}
	}
	string += "; ";
	for(var i = 0; i < data.length; ++i) {
		string += "\nvar trace" +i+" = { y: d" + i+", name: 'Day " + (i + 15) + "' ,type: 'box'};\n"
	}
	string += "var data = [";
	for(var i = 0; i < data.length; ++i) {
		string += "trace"+i;
		if(i + 1 < data.length) {
			string += ", ";
		} else {
			string += "];\n";
		}
	}
	
	string += "Plotly.newPlot('tester', data);"
	
	console.log(string);
	
	return string;
}

function box_plot_data_process(data) {
	var new_arr = new Array();
	//new_arr[0][0] = data[0][1];
	var n = 0, k = 0, j;
	console.log(data);
	while(k < data.length - 1) {
		new_arr[n] = new Array();
		j = 0;
		do {
			
			new_arr[n][j] = data[k][1];
			j++;
			//console.log(k)
			k++;
			//console.log("At k = " + k + ", data["+k+"][0] = " + data[k][0] + " and data[" + (k - 1) + "][0] = " + data[k-1][0]);
			//console.log("data at index k: " + k + " = " + data[k][1]);
		} while( (k + 1 < data.length) && data[k][0] == data[k - 1][0] );
		n++;
		
	}
	return new_arr;
	
}	


// this function is to obtain monthly compounded sales data,
// data set returned is in the format [ date | $$$ ]
function sales_data() {
	// index of date value is 0, actual profit is length - 1, retail price is length - 3, 
	// manufacturing price is length - 2
	var sales = document.getElementsByClassName("payments")[0].children[0].children;
	var data = new Array(), str;
	//console.log(data);
	// new array should be of length 50
	for(var i = 1; i < sales.length - 1; ++i) {
		//console.log(sales[sales.length - 1 - i]);
		data[i-1] = new Array();
		data[i-1][0] = new Date(sales[sales.length - 1 - i].children[0].innerHTML).getDay();
		
		str = sales[i].children[sales[sales.length - 1 - i].children.length - 1].innerHTML;
		data[i-1][1] = parseFloat(str.substr(3, str.length - 1));
		//console.log(data[i-1]);
	}	
	
	//console.log(data);
	return data;
}

// returns an array of total money each day
function compounded_sales(data) {
	var n = 0;
	var new_arr = new Array();
	new_arr[n] = new Array();
	new_arr[n][0] = data[n][0];
	new_arr[n][1] = data[n][1];
	// sums up all the sales that took place on the same day into one data value
	for(var i = 1; i < data.length; ++i) {
		//console.log(i);
		if(data[i][0] != data[i - 1][0]) {
			n++;
			new_arr[n] = new Array();
			new_arr[n][0] = data[i][0];
			new_arr[n][1] = 0;
		}
		console.log(data[i][1]);
		console.log(new_arr[n][1]);
		new_arr[n][1] = new_arr[n][1] + data[i][1];
	}

	for(var i = 1; i < new_arr.length; ++i) {
		new_arr[i][1] += new_arr[i-1][1];
	}
	
	console.log(new_arr);
	
	return new_arr;
}

// returns a 2d array of size nx2 of [date | price] , similar to an array of [ x , y ]
// NOTE: this function was written for month by month sales data

function yearly_sales_data() {
	var str, payments = document.getElementsByClassName("currency payment-amount"),
		dates = document.getElementsByClassName("payment-date");
	var data = new Array();
	for(var row = 0; row < payments.length; row++) {
		data[row] = new Array();
		str = payments[row].innerHTML; 
		data[row][0] = new Date(dates[row].innerHTML);
		//console.log(data[row][0].getMonth());
		data[row][1] = parseFloat(str.substr(3, str.length - 1));
	}
	
	/*
	for(var i = 0; i < data.length; ++i) {
		console.log("$" + data[i][1] + " on " + data[i][0].toDateString());
	}*/
	
	return data;
}

function main() {
	var data = sales_data();
	console.log(data);
	var real_data = box_plot_data_process(data);
	console.log(real_data);
	init(real_data);
	//init(real_data);
	
}



