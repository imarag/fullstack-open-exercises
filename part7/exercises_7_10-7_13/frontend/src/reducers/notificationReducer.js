import { createSlice } from '@reduxjs/toolkit'

const nontificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    },
  },
})

const { setNotification, clearNotification } = nontificationSlice.actions

export const updateNotification = (message, type) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
}

export default nontificationSlice.reducer
