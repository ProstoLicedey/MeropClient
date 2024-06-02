import {$authHost, $host} from "./index";

export  const  fetchOneHall = async (id) =>{
    const  {data} = await $host.get('api/hall/' + id )
    return data
}
export  const  getUpdate = async (id,type) =>{
    const  {data} = await $host.get('api/hall/update/' + id, {params: {type}})
    return data
}
export  const  fetchUserHall = async (id) =>{
    const  {data} = await $host.get('api/hall/user-' + id)
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
export  const  updateHall = async (entrance, id) =>{
    const  {data} = await $host.put('api/hall/'+ id, entrance)
    return data
}