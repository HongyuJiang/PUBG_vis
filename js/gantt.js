function createPersonGantt(gamingTimeExtent, characterLog){
	
	let actionColorizer = d3.scaleOrdinal(d3.schemeSet2);
	
	let actionList = []
	
	characterLog.forEach(function(d){
		
		if(d._T != 'LogPlayerPosition')
		
			actionList.push({'time': new Date(d._D), 'action':d._T, 'health': d.character.health, 'location':d.character.location})
	})
	
	addTrajectory(actionList)
	
	
	let width = 750
	
	let height = 200
	
	let margin = 20
	
	let xScale = d3.scaleTime()
		.domain(gamingTimeExtent)
		.range([margin, width - margin])
		
	let yScale = d3.scaleLinear()
		.domain([100, 0])
		.range([margin, height - margin * 2])
		
	xAxis = g => g.attr("transform", `translate(0,${height - margin * 2})`)
	.call(d3.axisBottom(xScale).ticks(20).tickFormat(d3.timeFormat("%M")))
	
	yAxis = g => g.attr("transform", `translate(${margin},0)`)
	.call(d3.axisLeft(yScale))
	.call(g => g.select(".domain").remove())
	
	const svg = d3.select('#gantt')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		
	let xG = svg.append("g").call(xAxis)
	
	xG.selectAll('text').attr('fill','grey')
	xG.selectAll('path').attr('stroke','white')
	xG.selectAll('line').attr('stroke','white')
	
	let yG = svg.append("g").call(yAxis)
	
	yG.selectAll('text').attr('fill','grey')	
	yG.selectAll('path').attr('stroke','white')
	yG.selectAll('line').attr('stroke','white')
		
	svg.selectAll('.ganttDot')
		.data(actionList)
		.enter()
		.append('rect')
		.attr('x', d => xScale(d.time))
		.attr('width', 1)
		.attr('height', 2)
		.attr('y', d => yScale(d.health))
		.attr('stroke', d => actionColorizer(d.action))
		.attr('stroke-opacity', 0.5)
		.attr('stroke-width', 2)
		.attr('fill', 'none')
		
	svg.append('text')
		.attr('x',400)
		.attr('y',100)
		.attr('font-size', 40)
		.attr('font-family', 'Arial')
		.attr('font-weight', 3000)
		.attr('fill', 'white')
		.attr('opacity', 0.5)
		.text(characterLog[0].character.name)
	
		
}