import { useState, useEffect } from 'react'
import planetsData from '../planets.json'

function PlanetSearch({ onSelectPlanet }) {
    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState([])
  
    useEffect(() => {
      if (search.length > 0) {
        const matches = planetsData
          .filter(planet => 
            planet.pl_name.toLowerCase().includes(search.toLowerCase()) && 
            planet.sy_dist !== null && 
            planet.ra !== null && 
            planet.dec !== null
          )
          .slice(0, 5)  // Limit to 5 suggestions
        setSuggestions(matches)
      } else {
        setSuggestions([])
      }
    }, [search])
    
  
    return (
      <div className='relative flex flex-col items-center justify-center'>
        <input
          className='bg-white rounded-full h-10 w-80 mr-16 pl-12 text-base font-medium'
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search planets..."
        />
        {suggestions.length > 0 && (
          <ul className='absolute top-10 right-16 w-80 z-50 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto'>
            {suggestions.map((planet, index) => (
              <li 
                key={index} 
                onClick={() => {
                  onSelectPlanet(planet)
                  setSearch('')
                  setSuggestions([])
                }}
                className='cursor-pointer px-4 py-2 hover:bg-gray-200'
              >
                {planet.pl_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  export default PlanetSearch;