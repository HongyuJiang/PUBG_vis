
let timelineWidth = 800

let timelineHeight = 200

let margin = 20

function createTimeline(heatDict, lifeTimeDict){
	
	let heatArray = []
	
	let rangeGapArray = []
	
	for(let key in heatDict){
		
		let time = new Date('2018-1-1 08:' + key.split('-')[0] + ':' + key.split('-')[1])
		
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
		.domain(d3.extent(heatArray, d => d.time))
		.range([margin, timelineWidth - margin])
		
	let timelineYScale = d3.scaleLinear()
		.domain([0, d3.max(heatArray, d => d.heat)])
		.range([margin, timelineHeight - margin * 2])
		
	xAxis = g => g.attr("transform", `translate(0,${timelineHeight - margin * 2})`)
	.call(d3.axisBottom(timelineXScale).ticks(15).tickFormat(d3.timeFormat("%M:%S")))
	
	yAxis = g => g.attr("transform", `translate(${margin},0)`)
	.call(d3.axisLeft(timelineYScale))
	.call(g => g.select(".domain").remove())

	const svg = d3.select('#timeline')
		.append('svg')
		.attr('width', timelineWidth)
		.attr('height', timelineHeight)
		
	svg.append("g").call(xAxis)
	.selectAll('text')
	.attr('fill','grey')
	
	svg.append("g").call(yAxis)
	.selectAll('text')
	.attr('fill','grey')
		
	svg.selectAll('.timePot')
		.data(rangeGapArray)
		.enter()
		.append('rect')
		.attr('x', d => timelineXScale(d.start))
		.attr('width', d => timelineXScale(d.end) - timelineXScale(d.start) - 3)
		.attr('y', margin)
		.attr('height', timelineHeight - margin * 3)
		.attr('fill', 'white')
		.attr('opacity', d =>  1 - timelineYScale(d.heat) / maxHeat)
	
	lifeTimeDict

}

