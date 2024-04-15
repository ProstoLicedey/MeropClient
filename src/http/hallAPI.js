import {$authHost, $host} from "./index";
import {saveAs} from 'file-saver'
// export  const  createHall = async (order) =>{
//     const  response = await $authHost.post('api/order', order)
//
//     return response.data
// }

export  const  fetchOneHall = async (id) =>{
    const  {data} = await $host.get('api/hall/' + id )
    return data
}
export  const  fetchUserHall = async (id) =>{
    const  {data} = await $host.get('api/hall/user-' + id )
    return data
}

export  const  deleteHall = async (id, type) =>{
    const  {data} = await $host.delete('api/hall/' , {
        params: {
            id, type
        }
    });
    return data
}

export  const createHall = async (hall) =>{
    const  {data} = await $host.post('api/hall/', hall)
    return data
}