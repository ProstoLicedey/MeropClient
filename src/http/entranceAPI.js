import {$authHost, $host} from "./index";


export  const  getEntrance = async (id, eventId) =>{
    const  {data} = await $host.get('api/entrance/option/' + id, {params: {eventId}} )
    return data
}
export  const  getEntranceUser = async (id) =>{
    const  {data} = await $host.get('api/entrance/user/' + id, )
    return data
}
export  const  getOneEntrance = async (id) =>{
    const  {data} = await $host.get('api/entrance/' + id, )
    return data
}
export  const  createEntrance = async (entrance) =>{
    const  {data} = await $host.post('api/entrance/', entrance)
    return data
}