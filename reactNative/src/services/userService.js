import { axios, localhost } from '../other/utils/axios/axios'

const user = `${localhost}/user`
export const getNewCode = (newCode) => axios.post(`${user}/getNewCode?newCode=${newCode}`)

