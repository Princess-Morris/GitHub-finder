import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";
import { process } from "../../components/envFile";

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({children}) => {
  const initialState = {
    users: [],
    loading: false
  }

  const [state, dispatch] = useReducer(githubReducer, initialState)

  // Get Search Results
  const searchUsers = async (text) => {
    setLoading()

    const params = new URLSearchParams({
      q: text
    })

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    })

    const {items} = await response.json()
 
    dispatch({
      type: 'GET_USERS',
      payload: items,
    })
   }

   // Set Loading
   const setLoading = () => dispatch({
    type: 'SET_LOADING'
   })

   const clearUser = () => dispatch({
    type: 'CLEAR_USER',
    payload: ""
   })

   return <GithubContext.Provider value={{
    users: state.users,
    loading: state.loading,
    searchUsers,
    clearUser
   }}>
    {children}

   </GithubContext.Provider>
}

export default GithubContext