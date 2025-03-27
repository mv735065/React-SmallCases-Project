import { useState } from 'react'
import MainContainter from './Components/MainContainter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 className='text-xl font-bold text-center border-b py-4'>SmallCase</h1>
    <MainContainter />
    </>
  )
}

export default App
