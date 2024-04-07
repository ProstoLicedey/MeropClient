import {$authHost, $host} from "./index";
import {saveAs} from 'file-saver'
export  const  createOrder = async (order) =>{
    const  response = await $authHost.post('api/order', order)

    return response.data
}

export  const  fetchOneOrder = async (id) =>{
    const  {data} = await $host.get('api/order/getTicket/' + id )
    return data
}