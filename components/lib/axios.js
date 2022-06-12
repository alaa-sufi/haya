import Axios from 'axios'

const TOKEN =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
const axios = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/`,
    timeout :20000,//20s
    headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${TOKEN}`,
        language:  typeof window !== 'undefined' ? document.documentElement.lang : 'en',
    },
    // withCredentials: true,
})

export default axios
