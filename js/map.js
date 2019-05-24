function addTrajectory(actionList){
	
	let width = 800
	
	let height = 800
	
	let xScale = d3.scaleTime()
		.domain([0,800000])
		.range([0,800])
		
	let yScale = d3.scaleLinear()
		.domain([0,800000])
		.range([0,800])
		
	let zScale = d3.scaleLinear()
		.domain([0,80000])
		.range([0,1])
		
	let pathGeneration = d3.line()
	.x(d => xScale(d.x))
	.y(d => yScale(d.y))
	
	let pathList = []
	
	actionList.forEach(function(d){
		
		pathList.push(d.location)
	})
	
	const svg = d3.select('#map_container')
		.append('svg')
		.style('position', 'absolute')
		.attr('width', width)
		.attr('height', height)
		
	svg.append('path')
	.datum(pathList)
	.attr('d', pathGeneration)
	.attr('stroke', 'red')
	.attr('fill', 'none')
	
	svg.selectAll('trajPoints')
	.data(pathList)
	.enter()
	.append('circle')
	.attr('r', 2)
	.attr('cx', d => xScale(d.x))
	.attr('cy', d => yScale(d.y))
	.attr('fill', 'yellow')
	
}