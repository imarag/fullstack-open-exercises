import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const { setUsers } = usersSlice.actions

const setInitialUsers = () => {
  return async (dispatch) => {
    const allUsers = await userService.getAllUsers()
    console.log(allUsers)
    dispatch(setUsers(allUsers))
  }
}

export { setInitialUsers }

export default usersSlice.reducer
