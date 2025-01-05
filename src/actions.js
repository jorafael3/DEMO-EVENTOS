export const loginSuccess = (user) => ({
    type: 'LOGIN_SUCCESS',
    user,
})

export const logout = () => ({
    type: 'LOGOUT',
})