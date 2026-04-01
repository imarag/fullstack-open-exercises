import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import currentUserReducer from './reducers/currentUserReducer'
import usersReducer from './reducers/usersReducer'
import blogReducer from './reducers/blogsReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
    blogs: blogReducer,
  },
})

export default store
