import {$authHost, $host} from "./index";
import {saveAs} from 'file-saver'
export  const  createHall = async (order) =>{
    const  response = await $authHost.post('api/order', order)

    return response.data
}

export  const  fetchOneHall = async (id) =>{
    const  {data} = await $host.get('api/hall/' + id )
    return data
}
export  const  fetchUserHall = async (id) =>{
    const  {data} = await $host.get('api/hall/user-' + id )
    return data
}