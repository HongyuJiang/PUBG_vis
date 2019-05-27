function createPersonGantt(characterLog){
	
	d3.select('#gantt').selectAll('*').remove()
	
	let actionColorizer = d3.scaleOrdinal(d3.schemeSet2);
	
	let actionList = []
	
	let actions = {}
	
	let landingAction = {}
	
	characterLog.forEach(function(d){
		
		if(d._T == 'LogParachuteLanding'){
			
			landingAction = d
		}
		
		if(d._T != 'LogPlayerPosition' && d._T != 'LogVehicleLeave' && d._T != 'LogParachuteLanding'){
		//if(1){	
			actions[d._T.split('Log')[1]] = 1
		
			actionList.push({'time': new Date(d._D), 'action':d._T.split('Log')[1], 'health': d.character.health, 'location':d.character.location})
		}
	
	})
	
	let width = 950
	
	let height = 230
	
	let margin = 30
	
	console.log(globalGamingTimeExtent)
	
	let xScale = d3.scaleTime()
		.domain(globalGamingTimeExtent)
		.range([margin * 4, width - margin])
		
	let yScale = d3.scalePoint()
		.domain(d3.keys(actions))
		.range([margin, height - margin])
		
	xAxis = g => g.attr("transform", `translate(0,${height - margin + 10 })`)
	.call(d3.axisBottom(xScale).ticks(20).tickFormat(d3.timeFormat("%M")))
	
	yAxis = g => g.attr("transform", `translate(${width - 30},0)`)
	.call(d3.axisRight(yScale))
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
	
	yG.selectAll('text').attr('fill','white').attr('font-size','9')
	yG.selectAll('path').attr('stroke','white')
	yG.selectAll('line').attr('stroke','white')
		
	svg.selectAll('.ganttDot')
		.data(actionList)
		.enter()
		.append('rect')
		.attr('x', d => xScale(d.time))
		.attr('y', d => yScale(d.action))
		.attr('width', 4)
		.attr('height', 3)
		.attr('fill', d => actionColorizer(d.action))
		.attr('stroke-opacity', 1)
		.attr('stroke-width', 1.5)
		
	svg.append('text')
		.attr('x', 650)
		.attr('y', 200) 
		.attr('font-size', 40)
		.attr('font-family', 'Arial')
		.attr('font-weight', 3000)
		.attr('fill', 'white')
		.attr('opacity', 0.3)
		.text(characterLog[0].character.name)
	
	svg.append('rect')
		.attr('x', xScale(new Date(landingAction._D)) - 3)
		.attr('y', margin) 
		.attr('width', 3)
		.attr('height', height - 2*margin)
		.attr('fill', 'red')
	
}