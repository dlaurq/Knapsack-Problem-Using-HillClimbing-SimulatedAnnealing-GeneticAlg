
function GenerateRandomSol(n, ITEMS, BACKACK_SIZE){
    //console.log("GenerateRandomSol")
    let solution = Array(ITEMS.length).fill(0)
    let size = 0
    //console.log(solution)
    //console.log(solution.length)
    
    for(let i=0; i<n; i++){
        const j = Math.floor(Math.random() * n)
        if(size + ITEMS[j].size < BACKACK_SIZE && solution[j] === 0){
            solution[j] = 1
            size += ITEMS[j].size
        }
    }
    //console.log(solution)
    //console.log(solution.length)
    return solution
}

function CalculateValue(solution, ITEMS){
    let value = 0
    for(let i=0; i<solution.length; i++){
        if(solution[i] === 1)
            value += ITEMS[i].value
    }

    return value
}

function GenerateNeighbour(solution, ITEMS, BACKACK_SIZE){
    const newSolutin = [...solution]
    const solutionSize = CalculateSolutionSize(newSolutin, ITEMS)

    for(let i=0; i<newSolutin.length; i++){
        if(newSolutin[i] !== 1 && solutionSize + newSolutin.size < BACKACK_SIZE){
            newSolutin[i] = 1
            return newSolutin
        }
    }

    const InBackpackItems = []
    const OutBackpackItems = []

    newSolutin.forEach((item, index) => {
        if(item === 1) InBackpackItems.push(index)
    });

    newSolutin.forEach((item, index) => {
        if(item === 0) OutBackpackItems.push(index)
    });
    let j = 0
    while (true){
        j++
        const inItem = InBackpackItems[Math.floor(Math.random() * InBackpackItems.length)]
        const outItem = OutBackpackItems[Math.floor(Math.random() * OutBackpackItems.length)]
        newSolutin[inItem] = 0
        newSolutin[outItem] = 1

        const newSolutinSize = CalculateSolutionSize(newSolutin, ITEMS)
        if(newSolutinSize <= BACKACK_SIZE) return newSolutin
        if( j === 10000) return solution
    }
}

function CalculateSolutionSize(solution, ITEMS){
    //console.log("CalculateSolutionSize")
    //console.log(solution)
    //console.log(solution.length)

    let size = 0
    for(let i=0; i<solution.length; i++){
        if(solution[i] === 1)
            size += ITEMS[i].size
    }
    return size
}


export function SimulatedAnnealing(temp, ITEMS, BACKACK_SIZE){
    //console.log("SimulatedAnnealing")

    let solution = GenerateRandomSol(ITEMS.length, ITEMS, BACKACK_SIZE)
    //console.log("Initial solution:", solution)

    let solutionValue = CalculateValue(solution, ITEMS)
    //console.log("Initial solution value:", solutionValue)

    let solutionSize = CalculateSolutionSize(solution, ITEMS)

    const solutions = []
    solutions.push({sol: solution, v: solutionValue, s: solutionSize})

    do{
        //console.log(temp)
        for (let j = 0; j < 10; j++) {
            const candidate = GenerateNeighbour(solution, ITEMS, BACKACK_SIZE)
            //console.log("Neighbour: ", candidate)

            const candidateValue = CalculateValue(candidate, ITEMS)
            //console.log("Neighbour value: ", candidateValue)

            const candidateSize = CalculateSolutionSize(candidate, ITEMS)
            //console.log("Neighbour size: ", candidatSize)

            const Ev = CalculateValue(candidate, ITEMS)
            const Ec = CalculateValue(solution, ITEMS)

            if(candidateValue >= solutionValue){
                solution = [...candidate]
                solutionValue = candidateValue
                solutions.push({sol: solution, v: solutionValue, s: candidateSize})
            }else if(Math.random() < Math.pow(Math.E, -(Ec-Ev)/temp)){
                solution = [...candidate]
                solutionValue = candidateValue
                solutions.push({sol: solution, v: solutionValue, s: candidateSize})
            }
        }

        temp -= 0.1 //g(T)
    }while(temp > 0)

    solutionSize = CalculateSolutionSize(solution, ITEMS)
    return [solution, solutionValue, solutionSize, solutions]
}

//const solution = SimulatedAnnealing(1000)
//console.log(solution)