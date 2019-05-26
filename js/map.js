const mapCanvas = d3.select('#map_container')
		.append('svg')
		.style('position', 'absolute')
		.attr('width', 800)
		.attr('height', 800)


function addTrajectory(characterLog){
	
	let characterName = characterLog[0].character.name
	
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
	
	let LogSwitch = false
	
	characterLog.forEach(function(d){
		
		if(d._T == 'LogVaultStart'){
			
			LogSwitch = true
		}
		
		if(LogSwitch){
			
			actionList.push({'time': new Date(d._D), 'action':d._T.split('Log')[1], 'health': d.character.health, 'location':d.character.location})
		}
		
	})
	
	let pathList = []
	
	actionList.forEach(function(d){
		
		pathList.push(d.location)
	})
	
		
	mapCanvas.append('path')
	.datum(pathList)
	.attr('d', pathGeneration)
	.attr('stroke', CharacterShader(characterName))
	.attr('stroke-width', '2')
	.attr('fill', 'none')
	
	mapCanvas.selectAll('trajPoints')
	.data(pathList)
	.enter()
	.append('circle')
	.attr('r', 2)
	.attr('cx', d => xScale(d.x))
	.attr('cy', d => yScale(d.y))
	.attr('fill', 'white')
	.attr('stroke', 'black')
	.attr('stroke-width', '1')
	
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
	.attr('fill', 'red')
	.attr('fill-opacity', '0.05')
	.attr('stroke', '#933')
	.attr('stroke-width', '2')
	
	console.log(cc)
}

function drawBattleField(){
	
	
}

function drawParachutePosition(){
	
}