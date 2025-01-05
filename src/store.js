// src/redux/store.js
import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  isAuthenticated: false,
  user: null,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'LOGIN_SUCCESS':
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(rest.user));
      localStorage.setItem('user_data', JSON.stringify({ ...state, isAuthenticated: true, user: rest.user }));
      return { ...state, isAuthenticated: true, user: rest.user }
    case 'LOGOUT':
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('user_data');
      return { ...state, isAuthenticated: false, user: null }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
