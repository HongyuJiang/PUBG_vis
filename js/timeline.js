
let timelineWidth = 850

let timelineHeight = 200

let margin = 20

function createTimeline(heatDict, lifeTimeDict){
	
	let heatArray = []
	
	let rangeGapArray = []
	
	let personsNum = d3.keys(lifeTimeDict).length 	
	
	for(let key in heatDict){
		
		let time = new Date('2019-3-20 ' + key.split('-')[0] + ':' + key.split('-')[1] + ':00') 
		
		let heat = heatDict[key]
		
		heatArray.push({'time': time, 'heat': heat})
	}
	

	for(let i =0; i<heatArray.length - 1;i++){
		
		rangeGapArray.push({
			'start':heatArray[i].time,
			'end':heatArray[i+1].time,
			'heat': heatArray[i].heat
		})
	}
	
	let maxHeat = d3.max(heatArray, d => d.heat)
	
	let timelineXScale = d3.scaleTime()
		.domain(globalGamingTimeExtent)
		.range([margin, timelineWidth - margin])
		
	let timelineYScale = d3.scaleLinear()
		.domain([personsNum, 0])
		.range([margin, timelineHeight - 2 * margin])
		
	let timelineZScale = d3.scaleLinear()
		.domain([0, d3.max(heatArray, d => d.heat)])
		.range([0,1])
		
	xAxis = g => g.attr("transform", `translate(0,${timelineHeight - margin * 2})`)
		.call(d3.axisBottom(timelineXScale).ticks(15).tickFormat(d3.timeFormat("%M")))
	
	yAxis = g => g.attr("transform", `translate(${margin},0)`)
		.call(d3.axisLeft(timelineYScale))
		.call(g => g.select(".domain").remove())

	const svg = d3.select('#timeline')
		.append('svg')
		.attr('width', timelineWidth)
		.attr('height', timelineHeight)
		
	var brush = d3.brushX()
        .extent([
            [0, margin],
            [timelineWidth, timelineHeight - 2 * margin]
        ])
        .on("brush end", brushed);

	let xG = svg.append("g").call(xAxis)
	
	xG.selectAll('text').attr('fill','white')
	xG.selectAll('path').attr('stroke','white')
	xG.selectAll('line').attr('stroke','white')
	
	let yG = svg.append("g").call(yAxis)
	
	yG.selectAll('text').attr('fill','white')
	yG.selectAll('path').attr('stroke','white')
	yG.selectAll('line').attr('stroke','white')
		
	svg.selectAll('.timePot')
		.data(rangeGapArray)
		.enter()
		.append('rect')
		.attr('x', d => timelineXScale(d.start))
		.attr('width', d => timelineXScale(d.end) - timelineXScale(d.start) - 3)
		.attr('y', margin)
		.attr('height', timelineHeight - margin * 3)
		.attr('fill', '#FF665A')
		.attr('opacity', d =>  timelineZScale(d.heat))
		
	let livedPersonPoints = []
	
	let lifeTimeArray = []
	
	for(let character in lifeTimeDict){
		
		lifeTimeArray.push(lifeTimeDict[character])
	
	}
	
	lifeTimeArray = lifeTimeArray.sort()
	
	lifeTimeArray.forEach(function(d){
		
		personsNum -= 1
		livedPersonPoints.push({'time': d, 'livedNum': personsNum})
	})
	
	let lineGenerator = d3.line()
		.curve(d3.curveStep)
		.x(d => timelineXScale(d.time))
		.y(d => timelineYScale(d.livedNum))
	
	let l = svg.append('path')
	.datum(livedPersonPoints.sort(d => d.time))
	.attr('d', lineGenerator)
	.attr('stroke','white')
	.attr('stroke-width', 2)
	.attr('fill','none')
			
	svg.append("g")
		.attr("class", "brush")
		.call(brush);
	
	function brushed(){
		
		let extent = d3.event.selection.map(timelineXScale.invert)
		
		removeAllTrajectories()
		
		for(let character in globalCharacterDict){
			
			addTrajectory(globalCharacterDict[character], extent)
		}
	}
}

