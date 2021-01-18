const reducer = (state = null, action) => {

  switch (action.type) {

    case 'SET_NOTIFICATION':
      if (state?.timeout)
        clearTimeout(state.timeout)
      return action.notification

    case 'CLEAR_NOTIFICATION':
      return null

    default:
      return state
  }

}

export const show = (notification, duration) => {
  return async dispatch => {

    notification.timeout = setTimeout(() => {
      dispatch(hide())
    }, duration || 5000)

    dispatch({
      type: 'SET_NOTIFICATION',
      notification: notification
    })

  }
}

export const hide = () => {
  return { type: 'CLEAR_NOTIFICATION' }
}

export default { reducer, show, hide }