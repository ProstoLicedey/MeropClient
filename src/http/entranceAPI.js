import {$authHost, $host} from "./index";


export  const  getEntrance = async (id, eventId) =>{
    const  {data} = await $host.get('api/entrance/option/' + id, {params: {eventId}} )
    return data
}
export  const  getEntranceHallUser = async (id) =>{
    const  {data} = await $host.get('api/entrance/user/' + id, )
    return data
}
export  const  getOneEntranceHall = async (id,type) =>{
    const  {data} = await $host.get('api/entrance/' + id, {params: {type}})
    return data
}
export  const  createEntrance = async (entrance) =>{
    const  {data} = await $host.post('api/entrance/', entrance)
    return data
}