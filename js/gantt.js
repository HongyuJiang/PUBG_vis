function createPersonGantt(gamingTimeExtent, characterLog){
	
	let actionColorizer = d3.scaleOrdinal(d3.schemeSet2);
	
	let actionList = []
	
	let actions = {}
	
	characterLog.forEach(function(d){
		
		if(d._T != 'LogPlayerPosition' && d._T != 'LogVehicleRide'){
			
			actions[d._T] = 1
		
			actionList.push({'time': new Date(d._D), 'action':d._T, 'health': d.character.health, 'location':d.character.location})
		}
	
	})
	
	addTrajectory(actionList)
	
	let width = 850
	
	let height = 200
	
	let margin = 30
	
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
		.attr('width', width + 100)
		.attr('height', height)
		
	let xG = svg.append("g").call(xAxis)
	
	xG.selectAll('text').attr('fill','white')
	xG.selectAll('path').attr('stroke','white')
	xG.selectAll('line').attr('stroke','white')
	
	let yG = svg.append("g").call(yAxis)
	
	yG.selectAll('text').attr('fill','white')	
	yG.selectAll('path').attr('stroke','white')
	yG.selectAll('line').attr('stroke','white')
		
	svg.selectAll('.ganttDot')
		.data(actionList)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(d.time))
		.attr('cy', d => yScale(d.health))
		.attr('r', 3)
		.attr('stroke', d => actionColorizer(d.action))
		.attr('stroke-opacity', 1)
		.attr('stroke-width', 1.5)
		.attr('fill', 'none')
		
	svg.append('text')
		.attr('x', 500)
		.attr('y',100)
		.attr('font-size', 40)
		.attr('font-family', 'Arial')
		.attr('font-weight', 3000)
		.attr('fill', 'white')
		.attr('opacity', 0.3)
		.text(characterLog[0].character.name)
	
	svg.selectAll('.ganttDot')
		.data(d3.keys(actions))
		.enter()
		.append('circle')
		.attr('cx', 850)
		.attr('cy', function(d,i){
			return i * 10 + 30
		})
		.attr('r',3)
		.attr('fill', d => actionColorizer(d))
		
	svg.selectAll('.ganttDot')
		.data(d3.keys(actions))
		.enter()
		.append('text')
		.attr('x', 860)
		.attr('y', function(d,i){
			return i * 10 + 33
		})
		.text(d => d.split('Log')[1])
		.attr('fill', 'white')
		.attr('font-size', '9')
		
	
}