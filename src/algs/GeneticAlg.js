
function GenerateRandomDude(n, ITEMS, BACKPACK_SIZE){
    //console.log("GenerateRandomSol")
    let solution = Array(ITEMS.length).fill(0)
    let size = 0
    //console.log(solution)
    //console.log(solution.length)
    
    for(let i=0; i<n; i++){
        const j = Math.floor(Math.random() * n)
        if(size + ITEMS[j].size < BACKPACK_SIZE && solution[j] === 0){
            solution[j] = 1
            size += ITEMS[j].size
        }
    }
    //console.log(solution)
    //console.log(solution.length)
    return solution
}


function InitPopulatin(n, ITEMS, BACKPACK_SIZE){
    const population = []
    for(let i = 0; i < n; i++){
        population.push(GenerateRandomDude(ITEMS.length, ITEMS, BACKPACK_SIZE))
    }
    return population
}

//Fitness
function EvalPopulatin(pop, ITEMS){ 
    const evalPop = []
    pop.forEach(dude => {
        evalPop.push(EvalDude(dude, ITEMS))
    })
    return evalPop
}

function EvalDude(dude, ITEMS){
    //console.log("dude: " + dude)
    let value = 0
    dude.forEach((item, index) => {
        if(item === 1) value += ITEMS[index].value
    })
    return value
}

function SelectionSchema(pop, ITEMS){
    //console.log(pop)
    const fitness = EvalPopulatin(pop, ITEMS)
    const evalSum = fitness.reduce((prev, x) => prev + x, 0)

    const selectChance = fitness.map(x => x/evalSum)

    const selectionSchema = []

    for(let i=0; i<fitness.length; i++){
        const r = Math.random()

        let q = 0
        let k = 0
        for(let j=0; j<fitness.length - 1; j++){
            q += selectChance[j]
            if(q < r && r < q+selectChance[j+1]){
                k = j
                break
            }
        }
        selectionSchema.push(k)
    }
    const selectedPop = []
    for(let i = 0; i<pop.length; i++){
        selectedPop.push(pop[selectionSchema[i]])
    }
    
    return selectedPop
}

function Mutation(dude) {
    //console.log(dude)
    const r = Math.floor(Math.random() * dude.length)
    const newDude = [...dude]
    newDude[r] = 1 - newDude[r]
    return newDude
}

function Reorder(dude1, dude2){
    const r = Math.floor(Math.random() * dude1.length)
    const newDude1 = Array(dude1.length).fill(0)
    const newDude2 = Array(dude2.length).fill(0)
    for(let i=0; i<dude1.length; i++){
        if(i<r)
            {newDude1[i] = dude1[i]
            newDude2[i] = dude2[i]}
        else
            {newDude1[i] = dude2[i]
            newDude2[i] = dude1[i]}
    }
    return [newDude1, newDude2]
}

function CalculateDudeSize(dude, ITEMS){
    //console.log("CalculateSolutionSize")
    //console.log(solution)
    //console.log(solution.length)

    let size = 0
    for(let i=0; i<dude.length; i++){
        if(dude[i] === 1)
            size += ITEMS[i].size
    }
    return size
}

function CalcBestDude(pop, ITEMS){
    let bestDude = [...pop[0]]
    //console.log(bestDude)
    for(let i = 0; i<pop.length; i++){
        let dude1 = EvalDude(pop[i], ITEMS)
        let dude2 = EvalDude(bestDude, ITEMS)
        if(dude1 > dude2)
            bestDude = [...pop[i]]
    }
    return bestDude
}

export function GeneticAlg(iterations, ITEMS, BACKPACK_SIZE, popSize){
    //console.log(popSize)
    const mutationC = 0.01
    const reorderC = 0.25
    let population = InitPopulatin(popSize, ITEMS, BACKPACK_SIZE)
    const initPop = [...population]
    const populationEval = EvalPopulatin(population, ITEMS)

    const popHistory = []
    popHistory.push(population)
    
    //console.log(population)
    for(let i = 0; i<iterations; i++){
        const newPopulation = SelectionSchema(population, ITEMS)
        //console.log(newPopulation)

        for(let j = 0; j<newPopulation.length; j++){
            let dude1
            let dude2
            let dude1Pos
            let dude2Pos
            //Mutatie
            if(Math.random() < mutationC){
                const newDude = Mutation(newPopulation[j])
                if(CalculateDudeSize(newDude, ITEMS) < BACKPACK_SIZE){
                    newPopulation[j] = newDude
                    //console.log('MUTATIE')
                }
                    
            }
            //Incrucisare
            if(Math.random() < reorderC){
                if(!dude1){
                    dude1 = newPopulation[j]
                    dude1Pos = j
                }
                if(!dude2){
                    dude2 = newPopulation[j]
                    dude2Pos = j
                }
                if(dude1 && dude2){
                    const newDudes = Reorder(dude1, dude2)
                    if(CalculateDudeSize(dude1, ITEMS) < BACKPACK_SIZE && CalculateDudeSize(dude2, ITEMS) < BACKPACK_SIZE){
                        newPopulation[dude1Pos] = newDudes[0]
                        newPopulation[dude2Pos] = newDudes[1]
                        //console.log('INCRUCISARE')
                    }
                    dude1 = undefined
                    dude2 = undefined
                }
            }

        }
        population = [...newPopulation]
        popHistory.push(population)

        //console.log(newPopulation)
    }
    //console.log(population)
    const bestDude = CalcBestDude(population, ITEMS)
    const bestDudeVal = EvalDude(bestDude, ITEMS)
    const bestDudeSize = CalculateDudeSize(bestDude, ITEMS)
    return [initPop, population, popHistory, bestDude, bestDudeVal, bestDudeSize]
}

//console.log(GeneticAlg(1))