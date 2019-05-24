d3.json("./data/match_1.json").then(function(dataset){
	
	let characterDict = {}
	
	let timeArray = []
	
	let heatTimeDict = {}
	
	let lifeTimeDict = {}
	
	let gamingTimeExtent = []
	
	let actionDict = {}
	
	let attackEvents = []
	
	dataset.forEach(function(d){
		//&& d.common.isGame == 1
		if(d.character && d.common && d.common.isGame > 0){
			
			if (characterDict[d.character.accountId] == undefined)
				characterDict[d.character.accountId] = []
			characterDict[d.character.accountId].push(d)	
		}
		
		if(d._D){
			
			timeArray.push(new Date(d._D))
		}
		
		if(d._T == 'LogPlayerAttack'){
			
			let time = new Date(d._D)
			
			let stamp = time.getHours() + '-' + time.getMinutes()
			
			if(heatTimeDict[stamp] == undefined)
				heatTimeDict[stamp] = 0
			heatTimeDict[stamp] += 1
		}
		
		actionDict[d._T] = 1
		
		if(d._T == 'LogPlayerTakeDamage')
			attackEvents.push(d)
		
	})
	
	let livedCharacters = d3.keys(characterDict).length
	
	for(let character in characterDict){
		
		let lifeTime = d3.max(characterDict[character], d => {
			
			return new Date(d._D)
		})
		
		characterDict[character]['lifeTime'] = lifeTime
		lifeTimeDict[character] = lifeTime
	}
	
	//console.log(actionDict)
	
	gamingTimeExtent = d3.extent(timeArray)
	
	createTimeline(heatTimeDict, lifeTimeDict)
	
	let persons = d3.keys(characterDict)
	
	createPersonGantt(gamingTimeExtent, characterDict[persons[15]])
	
	createAttackRelations(attackEvents, d3.keys(characterDict), gamingTimeExtent)
	
	//addTrajectory(characterDict[persons[0]])
	

	
})