const mapCanvas = d3.select('#map_container')
		.append('svg')
		.style('position', 'absolute')
		.attr('width', 800)
		.attr('height', 800)

defs = mapCanvas.append("defs")

defs.append("marker")
	.attr("id", "arrow")
	.attr("refX", 3)
	.attr("refY", 3)
	.attr("markerWidth", 15)
	.attr("markerHeight", 15)
	.attr("markerUnits","userSpaceOnUse")
	.attr("orient", "auto")
	.append("path")
	.attr("d", "M 0 0 6 3 0 6 1.5 3")
	.style("fill", "#FFE684");
	
let isMapSelecting = false
	
mapCanvas
.on('mousedown', function(d){
	
	isMapSelecting = true
	
	mapCanvas.select('#circleSelection')
	.remove()
	
	let x = d3.event.clientX - 25
	let y = d3.event.clientY - 5
	
	mapCanvas.append('circle')
	.attr('id', 'circleSelection')
	.attr('r',0)
	.attr('cx', x)
	.attr('cy', y)
	.attr('stroke','steelblue')
	.attr('fill','white')
	.attr('fill-opacity','0.1')
	.attr('stroke-width','3px')
	
})
.on('mousemove', function(d){
	
	if(isMapSelecting){
		
		let x = d3.event.clientX - 25
		let y = d3.event.clientY - 5
		
		let originX = parseFloat(mapCanvas.select('#circleSelection').attr('cx'))
		let originY = parseFloat(mapCanvas.select('#circleSelection').attr('cy'))
		
		let R = Math.sqrt((x - originX) * (x - originX) + (y - originY) * (y - originY))
		
		mapCanvas.select('#circleSelection')
		.transition()
		.duration('10')
		.attr('r', R)
	}
	

})
.on('mouseup', function(d){
	
	let collector = {}
	
	let centerX = parseFloat(mapCanvas.select('#circleSelection').attr('cx'))
	let centerY = parseFloat(mapCanvas.select('#circleSelection').attr('cy'))
	let R = parseFloat(mapCanvas.select('#circleSelection').attr('r'))
	
	//mapCanvas.select('#circleSelection')
	//.remove()
	
	mapCanvas.selectAll('.trajPoints')
	.attr('opacity', function(d){
		
		let x = parseFloat(d3.select(this).attr('cx'))
		let y = parseFloat(d3.select(this).attr('cy'))
		
		let distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY))
		
		if(distance < R)
			collector[d.character] = 1
		
		return distance < R ? 1 : 0
		
	})
	
	isMapSelecting = false
	
	d3.select('#attackRelation').selectAll('.interactionLine')
	.attr('opacity', function(d){
		
		let source = d3.select(this).attr('source')
		
		let target = d3.select(this).attr('target')
		
		//console.log(source, target)
		
		return (collector[source] || collector[target]) ? 1 : 0
	})
	
})

function addTrajectory(characterLog, timeExtent){
	
	let characterName = characterLog[0].character.name
	
	let LogSwitch = false
	
	if(timeExtent != undefined){
		
		LogSwitch = true
		
		characterLog = characterLog.filter(function(d){
			
			d._D = new Date(d._D)
			
			return d._D >= timeExtent[0] && d._D <= timeExtent[1]
		})
	}
	
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
	
	actionList = []
	
	characterLog.forEach(function(d){
		
		if(d._T == 'LogParachuteLanding'){
			
			LogSwitch = true
		}
		
		if(LogSwitch){
			
			if(d.character.location.x != 0 || d.character.location.y != 0)
				actionList.push(
				{
					'time': new Date(d._D), 
					'action':d._T.split('Log')[1], 
					'health': d.character.health, 
					'location':d.character.location,
					'name':d.character.name
				})
		}
		
	})
	
	let pathList = []
	
	actionList.forEach(function(d){
		
		d.location.type = d.action
		d.location.character = d.name
		pathList.push(d.location)
	})
	
		
	mapCanvas.append('path')
	.datum(pathList)
	.attr('class','traj')
	.attr('d', pathGeneration)
	.attr('stroke', CharacterShader(characterName))
	.attr('stroke-width', '2')
	.attr('stroke-opacity', '0.5')
	.attr('fill', 'none')
	.attr("marker-start", "url(#arrow)")
	.attr("marker-end", "url(#arrow)")
	.attr("marker-middle", "url(#arrow)")
	
	mapCanvas.selectAll('trajPoints')
	.data(pathList.filter(d => d.type != 'PlayerPosition'))
	.enter()
	.append('circle')
	.attr('class','trajPoints')
	.attr('r', 2)
	.attr('cx', d => xScale(d.x))
	.attr('cy', d => yScale(d.y))
	.attr('fill', 'white')
	.attr('stroke', 'black')
	.attr('stroke-width', '1')
	
}

function removeAllTrajectories(){
	
	mapCanvas.selectAll('.trajPoints').remove()
	
	mapCanvas.selectAll('.traj').remove()
	
}

function drawPoisionCircle(poisionDict){
	
	poisionList = []
	
	for(let meta in poisionDict){
		
		poisionList.push(poisionDict[meta])
	}

	let cc = mapCanvas.selectAll('poisionCircles')
	.data(poisionList)
	.enter()
	.append('circle')
	.attr('r', d => d.radius/1000)
	.attr('cx', d => d.position.x / 1000)
	.attr('cy', d => d.position.y / 1000)
	.attr('name', d => d.name)
	.attr('fill', 'red')
	.attr('fill-opacity', '0.05')
	.attr('stroke', '#933')
	.attr('stroke-width', '2')

}
