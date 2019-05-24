function createAttackRelations(attackEvents, characters, gamingTimeExtent){
	
	//console.log(attackEvents, characters)
	
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
	
	
	let width = 750
	
	let height = 200
	
	let margin = 20
	
	let xScale = d3.scaleTime()
		.domain(gamingTimeExtent)
		.range([margin, width - margin])
		
		
	let yScale = d3.scalePoint()
		.domain(characters)
		.range([margin, height - margin * 2])
		
	xAxis = g => g.attr("transform", `translate(0,${height - margin * 2})`)
	.call(d3.axisBottom(xScale).ticks(20).tickFormat(d3.timeFormat("%M")))
	
	yAxis = g => g.attr("transform", `translate(${margin},0)`)
	.call(d3.axisLeft(yScale))
	.call(g => g.select(".domain").remove())
	
	const svg = d3.select('#attackRelation')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
	
	let curveGenerator = d3.line()
	.curve(d3.curveBasis)
	.x(d => d.x)
	.y(d => d.y)
	
	let xG = svg.append("g").call(xAxis)
	
	xG.selectAll('text').attr('fill','grey')
	xG.selectAll('path').attr('stroke','white')
	xG.selectAll('line').attr('stroke','white')
	
	let yG = svg.append("g").call(yAxis)
	
	yG.selectAll('text').attr('fill','grey')	
	yG.selectAll('path').attr('stroke','white')
	yG.selectAll('line').attr('stroke','white')
	
	let curvePath = []
	
	interactions.forEach(function(link){
		
		let x1 = xScale(link.time)
		let y1 = yScale(link.sourceID)
		
		let x3 = xScale(link.time)
		let y3 = yScale(link.targetID)
		
		let x2 = xScale(link.time) + ((y3 - y1) / 10)
		//if (link.sourceID > link.targetID)
		//	x2 -= 20
		
		let y2 = (y3 + y1) / 2
		
		let points = [{'x':x1, 'y':y1},{'x':x2, 'y':y2},{'x':x3, 'y':y3}]
		
		console.log(points)
		
		curvePath.push({'points':points})
	})
		
	svg.selectAll('.interactionLine')
		.data(curvePath)
		.enter()
		.append('path')
		.datum(d => d.points)
		.attr('d', curveGenerator)
		.attr('stroke', 'white')
		.attr('stroke-opacity', 0.5)
		.attr('stroke-width', 1)
		.attr('fill', 'none')
		
}