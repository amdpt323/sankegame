import React, { useEffect } from 'react'
import { useState } from 'react'

const App = () => {
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(0)
  const [diamond, setDiamond] = useState({ x: 5, y: 12 })

  const [start, setStart] = useState(undefined)

  const [snakes, setSnakes] = useState([])

  class Snake {
    constructor() {
      this.pos = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
      ]
      this.direction = 0
    }

    move() {
      this.direction = Math.floor(Math.random() * 4)

      let newHead
      const head = this.pos[0]
      switch (this.direction) {
        // 0->up 1->bottom 2->left 3->right
        case 0:
          newHead = { x: head.x, y: (head.y - 1 + 20) % 20 }
          break
        case 1:
          newHead = { x: head.x, y: (head.y + 1) % 20 }
          break
        case 2:
          newHead = { x: (head.x - 1 + 10) % 10, y: head.y }
          break
        case 3:
          newHead = { x: (head.x + 1) % 10, y: head.y }
          break
      }

      let isValid = true
      for (const pos of this.pos) {
        if (pos.x === newHead.x && pos.y === newHead.y) {
          isValid = false
          break
        }
      }

      if (!isValid) {
        this.direction = (this.direction + 1) % 4
        switch (this.direction) {
          // 0->up 1->bottom 2->left 3->right
          case 0:
            newHead = { x: head.x, y: (head.y - 1 + 20) % 20 }
            break
          case 1:
            newHead = { x: head.x, y: (head.y + 1) % 20 }
            break
          case 2:
            newHead = { x: (head.x - 1 + 10) % 10, y: head.y }
            break
          case 3:
            newHead = { x: (head.x + 1) % 10, y: head.y }
            break
        }
      }

      this.pos.unshift(newHead)
      this.pos.pop()
    }
  }

  const addSnake = () => {
    const snake = new Snake()
    setSnakes([...snakes, snake])
  }

  useEffect(() => {
    addSnake()
  }, [])

  const moveAllSnakes = () => {
    setSnakes((prevSnakes) => {
      const updatedSnakes = prevSnakes.map((snake) => {
        const newSnake = new Snake()
        newSnake.pos = snake.pos.slice()
        newSnake.direction = snake.direction
        newSnake.move()
        return newSnake
      })
      return updatedSnakes
    })
    // setSnakes((prevSnakes) => {
    //   const updatedSankes = prevSnakes.map((snake) => {
    //     return snake.move()
    //   })
    //   return updatedSankes
    // })
  }
  useEffect(() => {
    let intervalId
    if (start) {
      intervalId = setInterval(moveAllSnakes, 500)
    }
    return () => clearInterval(intervalId)
  }, [start])

  const handleClick = (e) => {
    const posx = parseInt(e.target.dataset['x'])
    const posy = parseInt(e.target.dataset['y'])
    if (!start) return

    let isSnake = false
    for (const snake of snakes) {
      for (const pos of snake.pos) {
        if (pos.x === posx && pos.y === posy) {
          isSnake = true
          break
        }
      }
      if (isSnake) break
    }

    if (isSnake) {
      setScore((prev) => prev - 10)
    } else if (posx === diamond.x && posy === diamond.y) {
      setScore((prev) => prev + 10)
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 20)

      setDiamond({ x, y })

      if (score >= (level + 1) * 100) {
        setLevel((level) => level + 1)
        addSnake()
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

        let isSnake = false
        for (const snake of snakes) {
          for (const pos of snake.pos) {
            if (pos.x === i && pos.y === j) {
              isSnake = true
              break
            }
          }
          if (isSnake) break
        }

        if (isSnake) cn = `${cn} snake`

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

  const handleReset = () => {
    setStart(undefined)
    setScore(0)
    setDiamond({ x: 5, y: 12 })
    const snake = new Snake()
    setSnakes([snake])
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
      <Ribbon start={start} />
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
      <div className='flex justify-center items-center'>
        <button
          className='bg-gray-400 border border-gray-300 rounded-lg px-8 py-4'
          onClick={handleReset}
        >
          <p className='text-2xl font-bold'>Reset</p>
        </button>
      </div>
    </div>
  )
}

export default App
