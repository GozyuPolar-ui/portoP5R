import { createContext, useContext } from 'react'

export const JokerContext = createContext(null)

// Returns navigateWithJoker(page), or null when used outside JokerTransitionProvider.
export const useJokerNavigate = () => useContext(JokerContext)
