import { axios, localhost } from '../other/utils/axios/axios'

const client = `${localhost}/client`
export const allProduct = (text) => axios.get(`${client}/allProduct?text=${text}`)

