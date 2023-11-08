import { useEffect, useState } from "react"
import axios from "axios"

export const instance = axios.create({
    //baseURL: Config.apiUrl,
    timeout: 10000,
    headers:{
        Accept: 'application/json',
    }
})

const useAxios=()=>{
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)

    const fetchData = async (url, data = null, method = 'get', params = null) => {
        setLoading(true);
        try {
            const headers = {
                ...instance.headers,
                ...params
            }
            const response = await instance({method, url, headers, data})
            if(response.data){
                return response.data
            }
        } catch (err) {
            console.log(err)
            return err
        }finally {
            setLoading(false)
        }            
    }

    return {
        fetchData,
        loading,
        status,
        setStatus
    }
}

export default useAxios