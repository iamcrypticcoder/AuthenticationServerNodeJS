import axios from "axios";


export const ipLookup = (ipAddress: string) : Promise<any> => {
    const ipLoopUpUrl = process.env.IP_LOOKUP_URL.replace('{ipAddress}', ipAddress)
    return axios.get(ipLoopUpUrl, {
        responseType: 'json'
    }).then(res => {
        return new Promise((resolve, reject) => {
            resolve(res)
        })
    }).catch(err => {
        return new Promise((resolve, reject) => {
            reject(err)
        })
    })
}