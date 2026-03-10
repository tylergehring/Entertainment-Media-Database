import { useState } from 'react'
import './App.css'

interface Actor {
  NodeID: number
  ActorID: string
  Name: string
  DateOfBirth: string
  Nationality: string
}

function App() {
  const [actors, setActors] = useState<Actor[]>([])

  const fetchActors = () => {
    fetch('/api/actors/')
      .then(res => res.json())
      .then(data => setActors(data))
  }

  return (
    <>
      <h1>EMDB</h1>
      <button onClick={fetchActors}>Load Actors</button>
      <ul>
        {actors.map(actor => (
          <li key={actor.NodeID}>
            {actor.Name} — {actor.Nationality}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
