function main() {
	var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("Avocado Price")

    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("../data/avocado-ten.csv").then( function(data) {
        xScale.domain(data.map(function(d) { return d.year; }));
        yScale.domain([0, d3.max(data, function(d) { return d.AveragePrice; })]);
		// yScale.domain([0, d3.max(data, function(d) { return d.region; })]);


        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 325)
         .attr("x", width + 20) 
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Year");

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){return "$" + d;}).ticks(10))
	 .append("text")
	 .attr("transform", "rotate(-90)")
	 .attr("y", 10)
	 .attr('dy', '-5em')
	 .attr('text-anchor', 'end')
	 .attr('stroke', 'black')
	 .text('Avocado Price in USD')

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
	 .on("mouseover", onMouseOver) // Add listener for event
	 .on("mouseout", onMouseOut)
         .attr("x", function(d) { return xScale(d.year); })
         .attr("y", function(d) { return yScale(d.AveragePrice); })
         .attr("width", xScale.bandwidth())
	 .transition()
	 .ease(d3.easeLinear)
	 .duration(500)
	 .delay(function(d,i){ return i * 50})
         .attr("height", function(d) { return height - yScale(d.AveragePrice); });
	})
       
	// Mouseover event handler

	function onMouseOver(d, i) {
		// Get bar's xy values, ,then augment for the avocado
		var xPos = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2;
		var yPos = parseFloat(d3.select(this).attr('y')) / 2 + height / 2

		// Update Avocado's position and value
		d3.select('#avocado')
			.style('left', xPos + 'px')
			.style('top', yPos + 'px')
			.select('#value').text(i.value)
		
		d3.select('#avocado').classed('hidden', false);


		d3.select(this).attr('class','highlight')
		d3.select(this)
			.transition() // I want to add animnation here
			.duration(500)
			.attr('width', xScale.bandwidth() + 5)
			.attr('y', function(d){return yScale(d.AveragePrice) - 10;})
			.attr('height', function(d){return height - yScale(d.AveragePrice) + 10;})

	}

	// Mouseout event handler
	function onMouseOut(d, i){
		d3.select(this).attr('class','bar')
		d3.select(this)
			.transition()
			.duration(500)
			.attr('width', xScale.bandwidth())
			.attr('y', function(d){return yScale(d.AveragePrice);})
			.attr('height', function(d) {return height - yScale(d.AveragePrice)})
		
		d3.select('#avocado').classed('hidden', true);
	}
}