import React from 'react'
import { useState } from 'react'

const App = () => {
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(0)
  const [diamond, setDiamond] = useState({ x: 5, y: 12 })

  const [start, setStart] = useState(undefined)

  const handleClick = (e) => {
    const posx = parseInt(e.target.dataset['x'])
    const posy = parseInt(e.target.dataset['y'])
    if (!start) return
    if (posx === diamond.x && posy === diamond.y) {
      setScore((prev) => prev + 10)
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 20)

      setDiamond({ x, y })

      if (score >= (level + 1) * 100) {
        setLevel((level) => level + 1)
      }
    }
  }

  const renderBoard = () => {
    const rows = []
    for (let i = 0; i < 10; i++) {
      const cells = []
      for (let j = 0; j < 20; j++) {
        let cn = 'grid-cell'

        let isDiamond = diamond.x === i && diamond.y === j
        if (isDiamond) cn = `${cn} diamond`
        let cell = (
          <div
            className={cn}
            key={`${i}-${j}`}
            data-x={i}
            data-y={j}
            onClick={(e) => handleClick(e)}
          ></div>
        )
        cells.push(cell)
      }
      rows.push(cells)
    }
    return rows
  }

  const handleStart = () => {
    if (start) return
    setStart(true)
  }

  const handleStop = () => {
    if (!start) return
    setStart(false)
  }

  const Ribbon = ({ start }) => {
    let text
    let color

    if (start === undefined) {
      text = 'Game Yet Not Started'
      color = 'blue'
    } else if (start) {
      text = 'In Progress'
      color = 'green'
    } else {
      text = 'Paused'
      color = 'gray'
    }

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '200px',
          padding: '10px',
          backgroundColor: color,
          zIndex: 9999,
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        <span>{text}</span>
      </div>
    )
  }

  return (
    <div className='w-full h-screen bg-gray-100'>
      <Ribbon start={start}/>
      <h1 className='text-[40px] text-center font-serif p-5'>
        Careful !!! 🐍 Everywhere{' '}
      </h1>

      <div className='flex justify-center items-center'>
        <div className='bg-purple-300 border border-gray-300 rounded-lg p-4'>
          <p className='text-2xl font-bold'>Score: {score}</p>
        </div>
        <div className='bg-pink-300 border border-gray-300 rounded-lg p-4'>
          <p className='text-2xl font-bold'>Level: {level}</p>
        </div>
      </div>

      <div className='grid-container w-90 justify-center py-5'>
        {renderBoard()}
      </div>

      <div className='flex justify-center items-center'>
        <button
          className='bg-green-500 border border-gray-300 rounded-lg px-8 py-4'
          onClick={handleStart}
        >
          <p className='text-2xl font-bold'>Start</p>
        </button>
        <button
          className='bg-red-600 border border-gray-300 rounded-lg px-8 py-4'
          onClick={handleStop}
        >
          <p className='text-2xl font-bold'>Stop</p>
        </button>
      </div>
    </div>
  )
}

export default App
