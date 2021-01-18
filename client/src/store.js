import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import notificationReducer from './reducers/notification'
import blogsReducer from './reducers/blogs'
import userReducer from './reducers/user'
import usersReducer from './reducers/users'

const reducer = combineReducers({
  notification: notificationReducer.reducer,
  blogs: blogsReducer.reducer,
  user: userReducer.reducer,
  users: usersReducer.reducer
})

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store