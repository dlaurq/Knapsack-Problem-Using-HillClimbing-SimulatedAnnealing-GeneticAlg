import { useEffect, useState } from "react"
import {v4 as uuid} from 'uuid'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGem, faCaretUp, faCaretDown, faSackDollar } from "@fortawesome/free-solid-svg-icons"
import { HillClimbing } from "./algs/HillClimbing"
import { SimulatedAnnealing } from "./algs/SimulatedAnnealing"
import { GeneticAlg } from "./algs/GeneticAlg"

function App() {

  const [backpackSize, setBackpackSize] = useState(25)
  const [noItems, setNoItems] = useState(9)
  const [items, setItems] = useState([
    {value: 20, size:10},
    {value: 10, size:1},
    {value: 8, size:7},
    {value: 29, size:12},
    {value: 2, size:8},
    {value: 1, size:25},
    {value: 11, size:13},
    {value: 5, size:4},
    {value: 9, size:5}])
  const [colapsItems, setColapsItems] = useState(true)
  const [colapsHC, setColapsHC] = useState(true)
  const [HCIterations, setHCIterations] = useState(1000)
  const [HC, setHC] = useState({history: true})
  const [SA, setSA] = useState({history: true, temp: 10, showRes: true})
  const [GA, setGA] = useState({history: true, ages: 20, showRes: true, popSize: 10})

  const toggleColapsItems = () => setColapsItems(prev => !prev)

  useEffect(() => {
    if(noItems > items.length) {
      let n = noItems - items.length
      for(let i =0; i<n; i++)
        setItems(prev => [...prev, {size: 0, value: 0, id: uuid()}])
    }

    if(noItems < items.length) {
      let n = items.length - noItems
      let prevItems = [...items]
      for(let i =0; i<n; i++)
        prevItems.pop()

      setItems(prevItems)
    }

  }, [noItems, items])

  const handleHC = () => {
    //console.log({iterations: HCIterations, BACKACK_SIZE: backpackSize, ITEMS: items})
    const sol = HillClimbing(HCIterations,items ,backpackSize)
    //console.log(sol)
    setHC({...HC, array: sol[0], value: sol[1], size: sol[2], historySol: sol[3]})
    //console.log()
  }

  const handleSA = () => {
    //console.log(SA)
    const sol = SimulatedAnnealing(SA?.temp, items, backpackSize)
    setSA({...SA, array: sol[0], value: sol[1], size: sol[2], historySol: sol[3]})
    //console.log(sol)
  }

  const handleGA = () => {
    const sol = GeneticAlg(GA?.ages, items, backpackSize, GA?.popSize)
    //console.log(sol)
    setGA({...GA, startPop: sol[0], finalPop: sol[1], history: sol[2], best:{array: sol[3], value: sol[4], size: sol[5]}})
  }

  return (
    <section className="bg-teal-950 w-full min-h-screen text-amber-200 text-xl">
      <h1 className="text-3xl text-center p-10 font-bold uppercase mb-10">Knapsack problem</h1>

      <section className="px-20">

        <section className="pb-5">
          <label htmlFor="backpack">Backpack size</label>
          <input className="bg-amber-200 text-teal-950 font-bold w-24 outline-none text-center ml-5" type="number" id="backpack" value={backpackSize} onChange={ e => e.target.value >= 0 ? setBackpackSize(e.target.value) : setBackpackSize(e.target.value*-1)} min="0"/>
        </section>

        <section>
          <label htmlFor="itemsList">Number of items</label>
          <input className="bg-amber-200 text-teal-950 font-bold w-16 outline-none text-center ml-5" type="number" id="itemsList" value={noItems} onChange={ e => e.target.value >= 0 ? setNoItems(e.target.value) : setNoItems(e.target.value*-1)} min="0"/>
          <section className="inline p-3 m-2 cursor-pointer" onClick={toggleColapsItems}><FontAwesomeIcon icon={colapsItems ? faCaretUp : faCaretDown} /></section>
        </section>

        {!colapsItems &&
        <section className="flex flex-row flex-wrap justify-start items-center gap-10 mt-10">
          {items.map((item, index) => 
          <section key={index} className="py-5 border-b-2 border-amber-200">
            <p><FontAwesomeIcon icon={faGem} /> {index + 1}</p>

            <section className="py-5 flex flex-row justify-between items-center ">
              <label htmlFor="itemSize">Size</label>
              <input 
                className="bg-amber-200 text-teal-950 font-bold w-20 outline-none text-center ml-5"
                type="number" 
                id="itemSize" 
                value={item?.size} 
                onChange={ e => {
                  const newItems = [...items]
                  newItems[index].size = e.target.value
                  setItems(newItems)}
                } 
                min="0"/>
            </section>

            <section className=" flex flex-row justify-between items-center ">
              <label htmlFor="itemValue">Value</label>
              <input 
                className="bg-amber-200 text-teal-950 font-bold w-20 outline-none text-center ml-5"
                type="number" 
                id="itemValue" 
                value={item?.value} 
                onChange={ e => {
                  const newItems = [...items]
                  newItems[index].value = e.target.value
                  setItems(newItems)}
                }
                min="0"/>
            </section>
          </section>
          )}
        </section>}

        <section className="mt-10 flex flex-wrap flex-row justify-between items-start gap-10 pb-20 pt-5">
          <section>
            <h3>Hill Climbing</h3>
            <section className="py-2">
              <label htmlFor="HCIterations">No. iterations</label>
              <input className="bg-amber-200 text-teal-950 font-bold w-24 outline-none text-center ml-5" type="number" id="HCIterations" value={HCIterations} onChange={ e => e.target.value >= 0 ? setHCIterations(e.target.value) : setHCIterations(e.target.value*-1)} min="0"/>
            </section>
            <button className="border-2 border-amber-200 p-1 px-4 uppercase mt-3" onClick={handleHC}>Run</button>
            <section>
              <p className="cursor-pointer mt-3" onClick={() => setColapsHC(prev => !prev)}>Results: <FontAwesomeIcon className="pl-2" icon={colapsHC ? faCaretUp : faCaretDown} /></p>

              {!colapsHC && 
                <section>
                  <p>Array: {JSON.stringify(HC?.array)}</p>
                  <Backpack array={HC?.array} v={HC?.value} s={HC?.size}/>
                  
                  <p>Value: {HC?.value} &#x2022; Size: {HC?.size}</p>
                  <p className="cursor-pointer mt-3" onClick={() => setHC({...HC, history: !HC.history})}>History ({HC?.historySol?.length}): <FontAwesomeIcon className="pl-2" icon={HC?.history ? faCaretUp : faCaretDown} /></p>
                  
                  {!HC?.history &&
                    <section>
                      {HC?.historySol?.map((item, index) => <Backpack key={index} array={item?.sol} v={item?.v} s={item?.s} />)}
                      
                    </section>
                  }
                </section>}
            </section>
          </section>

          <section>
            <h3>Simulated Annealing</h3>
            <section className="py-2">
              <label htmlFor="SATemp">Temp.</label>
              <input 
                className="bg-amber-200 text-teal-950 font-bold w-24 outline-none text-center ml-5" 
                type="number" 
                id="SATemp" 
                value={SA?.temp} 
                onChange={ e => e.target.value >= 0 ? setSA({...SA, temp: e.target.value}) : setSA({...SA, temp: e.target.value*-1})} 
                min="0"/>
            </section>
            <button 
              className="border-2 border-amber-200 p-1 px-4 uppercase mt-3"
              onClick={handleSA}
            >Run</button>

            <section>
              <p className="cursor-pointer mt-3" onClick={() => setSA({...SA, showRes: !SA?.showRes})}>Results: <FontAwesomeIcon className="pl-2" icon={colapsHC ? faCaretUp : faCaretDown} /></p>

              {!SA?.showRes && 
                <section>
                  <p>Array: {JSON.stringify(SA?.array)}</p>
                  <Backpack array={SA?.array} v={SA?.value} s={SA?.size}/>
                  
                  <p>Value: {SA?.value} &#x2022; Size: {SA?.size}</p>
                  <p className="cursor-pointer mt-3" onClick={() => setSA({...SA, history: !SA.history})}>History ({SA?.historySol?.length}): <FontAwesomeIcon className="pl-2" icon={SA?.history ? faCaretUp : faCaretDown} /></p>
                  
                  {!SA?.history &&
                    <section>
                      {SA?.historySol?.map((item, index) => <Backpack key={index} array={item?.sol} v={item?.v} s={item?.s} />)}
                      
                    </section>
                  }
                </section>}
            </section>

          </section>

          <section>
            <h3>Algoritm Genetic</h3>

            <section className="py-2">
              <label htmlFor="GAAges">No. iterations (Ages)</label>
              <input 
                className="bg-amber-200 text-teal-950 font-bold w-24 outline-none text-center ml-5" 
                type="number" 
                id="GAAges" 
                value={GA?.ages} 
                onChange={ e => e.target.value >= 0 ? setGA({...GA, ages: e.target.value}) : setGA({...GA, ages: e.target.value*-1})} 
                min="0"/>
            </section>

            <section className="py-2">
              <label htmlFor="GAPopSize">Population size</label>
              <input 
                className="bg-amber-200 text-teal-950 font-bold w-24 outline-none text-center ml-5" 
                type="number" 
                id="GAPopSize" 
                value={GA?.popSize} 
                onChange={ e => e.target.value >= 0 ? setGA({...GA, popSize: e.target.value}) : setGA({...GA, popSize: e.target.value*-1})} 
                min="0"/>
            </section>

            <button onClick={handleGA} className="border-2 border-amber-200 p-1 px-4 uppercase mt-3">Run</button>

            <section>
              <p className="cursor-pointer mt-3" onClick={() => setGA({...GA, showRes: !GA?.showRes})}>Results: <FontAwesomeIcon className="pl-2" icon={colapsHC ? faCaretUp : faCaretDown} /></p>

              {!GA?.showRes && 
                <section>
                  <p>Best: {JSON.stringify(GA?.best?.array)}</p>
                  <Backpack array={GA?.best?.array} v={GA?.best?.value} s={GA?.best?.size}/>
                  
                  <p>Value: {GA?.best?.value} &#x2022; Size: {GA?.best?.size}</p>

                  <section>
                    <p>Initial Population: </p>
                    {GA?.startPop?.map((backpack, index) => <Backpack key={index} array={backpack} />)}
                  </section>
                  <section>
                    <p>Final Population: </p>
                    {GA?.finalPop?.map((backpack, index) => <Backpack key={index} array={backpack} />)}
                  </section>
                  
                  
                </section>}
            </section>

          </section>

        </section>
      </section>

    </section>
  )
}


export const Backpack = ({array, s, v}) => {

  useEffect(() => {
    //console.log(array)
  
    
  }, [])
  
  return (
    <section>
      <FontAwesomeIcon icon={faSackDollar} />  &#x2022; {array?.map((item, index) => item === 1 && <span key={index}> <FontAwesomeIcon className="mr-1" icon={faGem} />{index + 1}  </span>)}
      { s && v && <span> &#x2022; S: {s}  - V: {v}</span>}
    </section>
  )
}


export default App
