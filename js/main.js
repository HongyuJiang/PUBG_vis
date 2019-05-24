d3.json("./data/match_1.json").then(function(dataset){
	
	let characterDict = {}
	
	let timeArray = []
	
	let heatTimeDict = {}
	
	let lifeTimeDict = {}
	
	let gamingTimeExtent = []
	
	let actionDict = {}
	
	let attackEvents = []
	
	let charactersName = {}
	
	let PoisionDict = {}
	
	dataset.forEach(function(d){
		//&& d.common.isGame == 1
		if(d.character && d.common && d.common.isGame > 0){
			
			if (characterDict[d.character.name] == undefined)
				characterDict[d.character.name] = []
			characterDict[d.character.name].push(d)
				
			charactersName[d.character.name] = 1
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
		
		if(d._T == 'LogPlayerTakeDamage'){
			
			attackEvents.push(d)
			
		}
			
			
		if(d._T == 'LogGameStatePeriodic'){
					
			let safetyZonePosition = d.gameState.safetyZonePosition
			
			let safetyZoneRadius = d.gameState.safetyZoneRadius
			
			let poisonGasWarningRadius = d.gameState.poisonGasWarningRadius
			
			if(Math.abs(poisonGasWarningRadius - safetyZoneRadius) < 500){
				
				let key = safetyZonePosition.x + '|' + safetyZonePosition.y
				
				let time = d._D
				
				PoisionDict[key] = {'position': safetyZonePosition, 'radius': safetyZoneRadius}
			}
			
		}
	
	})
	
	
	
	let livedCharacters = d3.keys(characterDict).length
	
	for(let character in characterDict){
		
		let lifeTime = d3.max(characterDict[character], d => {
			
			return new Date(d._D)
		})
		
		characterDict[character]['lifeTime'] = lifeTime
		lifeTimeDict[character] = lifeTime
	}
	
	
	gamingTimeExtent = d3.extent(timeArray)
	
	createTimeline(heatTimeDict, lifeTimeDict)
	
	let persons = d3.keys(characterDict)
	
	createPersonGantt(gamingTimeExtent, characterDict[persons[13]])
	
	createAttackRelations(attackEvents, d3.keys(charactersName), gamingTimeExtent, lifeTimeDict)
	
	drawPoisionCircle(PoisionDict)
	
	addPersonDetal([characterDict[persons[3]], characterDict[persons[4]], characterDict[persons[5]]])
})