function addPersonDetal(characterRecords){


	let Equipments = {}
	
	characterRecords.forEach(function(character){
		
		let personEquipments = {}
		
		let name = character[0].character.name
		
		character = character.slice(0, character.length - 10)
		
		character.forEach(function(event){
			
			if(event.item){
				
				itemID = event.item.itemId
				
				if(event._T == 'LogItemEquip'){
				
					personEquipments[itemID] = 1
				}
				else if(event._T == 'LogItemUnequip'){
					
					personEquipments[itemID] = 0
				}
			}
			
		})
		
		Equipments[name] = personEquipments
		
	})
	
	let personEquipments = []
	
	for(let person in Equipments){
		
		let PE = {'name': person, 'equips': []}
		
		for (let item in Equipments[person]){
			
			if(Equipments[person][item] == 1){
				
				PE.equips.push(item)
			}
		}
		
		personEquipments.push(PE)
	}
	


	let containers = d3.select('#characterCard').selectAll('container')
		.data(personEquipments)
		.enter()
		.append('div')
		.attr('class', 'character')
		.style('border-top', d => '5px solid ' + CharacterShader(d.name))
	
	containers
		.append('svg')
		.attr('width', 300)
		.attr('height', 300)
		.style('position', 'absolute')
		
	containers
		.append('img')
		.attr('src', 'img/th-kim-puth01.jpg')
		.attr('width', 150)
		.style('opacity', '1')	
		
	containers.select('svg')
	.selectAll('.item')
	.data(d => d.equips)
	.enter()
	.append('circle')
	.attr('r', 3)
	.attr('cx', 170)
	.attr('cy', function(d,i){
		
		return i * 20 + 30
	})
	.attr('fill', 'black')
	
	containers.select('svg')
	.selectAll('.itemName')
	.data(d => d.equips)
	.enter()
	.append('text')
	.text(d => d.split('Item_')[1].split('_C')[0])
	.attr('x', 180)
	.attr('y', function(d,i){
		return i * 20 + 32
	})
	.attr('font-size', 10)
	
	
}