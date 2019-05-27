function createAttackRelations(attackEvents, characters, lifeTime){
	
	let interactions = []
	
	attackEvents.forEach(function(d){
		
		if(d.attacker != null)
			interactions.push(
			{
				'time':new Date(d._D), 
				'sourceName': d.attacker.name, 'targetName':d.victim.name,
				'sourceID': d.attacker.accountId, 'targetID':d.victim.accountId,
			})
	})
	
	
	let width = 850
	
	let height = 300
	
	let margin = 20
	
	let xScale = d3.scaleTime()
		.domain(globalGamingTimeExtent)
		.range([margin, width - margin])
		
		
	let yScale = d3.scalePoint()
		.domain(characters)
		.range([margin, height - margin * 2])
		
	xAxis = g => g.attr("transform", `translate(0,${height - margin * 2})`)
	.call(d3.axisBottom(xScale).ticks(20).tickFormat(d3.timeFormat("%M")))
	
	yAxis = g => g.attr("transform", `translate(${width},0)`)
	.call(d3.axisRight(yScale))
	.call(g => g.select(".domain").remove())
	
	const svg = d3.select('#attackRelation')
		.append('svg')
		.attr('width', width + 100)
		.attr('height', height)
		
	defs = svg.append("defs")

	defs.append("marker")
		.attr("id", "triangle")
		.attr("refX", 3)
		.attr("refY", 3)
		.attr("markerWidth", 15)
		.attr("markerHeight", 15)
		.attr("markerUnits","userSpaceOnUse")
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M 0 0 6 3 0 6 1.5 3")
		.style("fill", "#FF665A");
	
	let curveGenerator = d3.line()
	.curve(d3.curveBasis)
	.x(d => d.x)
	.y(d => d.y)
	
	let xG = svg.append("g").call(xAxis)
	
	xG.selectAll('text').attr('fill','white')
	xG.selectAll('path').attr('stroke','white')
	xG.selectAll('line').attr('stroke','white')
	
	let yG = svg.append("g").call(yAxis)
	
	yG.selectAll('text').attr('fill','white').attr('font-size', 8)
	yG.selectAll('path').attr('stroke','white')
	yG.selectAll('line').attr('stroke','white')
	
	let curvePath = []
	
	interactions.forEach(function(link){
		
		let x1 = xScale(link.time)
		let y1 = yScale(link.sourceName)
		
		let x3 = xScale(link.time)
		let y3 = yScale(link.targetName)
		
		let x2 = xScale(link.time) + ((y3 - y1) / 10)
		let y2 = (y3 + y1) / 2
		
		let points = [{'x':x1, 'y':y1},{'x':x2, 'y':y2},{'x':x3, 'y':y3}]
		
		curvePath.push({'points':points, 'source':link.sourceName, 'target':link.targetName})
	})
		
	svg.selectAll('.interactionLine')
		.data(curvePath)
		.enter()
		.append('path')
		.attr('source', d => d.source)
		.attr('target', d => d.target)
		.datum(d => d.points)
		.attr('d', curveGenerator)
		.attr('class', 'interactionLine')
		.attr("marker-end", "url(#triangle)")
		.attr('stroke', 'white')
		.attr('stroke-opacity', 0.3)
		.attr('stroke-width', 1)
		.attr('fill', 'none')
		
	svg.selectAll('.lifeLine')
		.data(characters)
		.enter()
		.append('line')
		.attr('x1', margin)
		.attr('y1', d => yScale(d))
		.attr('x2', d => xScale(lifeTime[d]) - 10)
		.attr('y2', d => yScale(d))
		.attr('stroke', 'white')
		.attr('stroke-opacity', '0.3')
	
	svg.append('rect')
		.attr('width', 5)
		.attr('height', height - margin * 3)
		.attr('x', margin)
		.attr('y', margin)
		.attr('fill', 'grey')
		.attr('stroke-opacity', '0.3')
	
	svg.selectAll('.lifeEndPoint')
		.data(characters)
		.enter()
		.append('circle')
		.attr('r', 3)
		.attr('cx', d => xScale(lifeTime[d]) - 10)
		.attr('cy', d => yScale(d))
		.attr('fill', '#FFDE6B')
		
	svg.selectAll('.tick').select('text')
	.on('click', function(d){
		
		createPersonGantt(globalCharacterDict[d])
	})
		
}