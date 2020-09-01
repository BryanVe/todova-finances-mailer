const ACCESS_TOKEN = "accessToken"

export const setToken = (token) => localStorage.setItem(ACCESS_TOKEN, token)

export const getToken = () => localStorage.getItem(ACCESS_TOKEN)

export const deleteToken = () => localStorage.removeItem(ACCESS_TOKEN)
