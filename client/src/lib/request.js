import axios from "axios"
import { apiUrl } from "config/development"
const baseURL = apiUrl

const axiosInstance = (headers) => {
  let instance = axios.create({
    baseURL,
    mode: "no-cors",
    headers,
  })

  return instance
}

const Get = async (route, params = {}, headers = {}) => {
  try {
    const { data } = await axiosInstance(headers).get(route, {
      params,
    })
    return data
  } catch (error) {
    throw error
  }
}

const Post = async (route, json = {}, headers = {}) => {
  try {
    const { data } = await axiosInstance(headers).post(route, json)
    return data
  } catch (error) {
    throw error
  }
}

export { Get, Post }
