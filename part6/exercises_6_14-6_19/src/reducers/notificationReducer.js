import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'this is the initial message',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return ''
        },
    },
})

const { setNotification, clearNotification } = notificationSlice.actions

export const updateNotification = (message, timeout) => {
    return (dispatch) => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeout * 1000)
    }
}

export default notificationSlice.reducer
