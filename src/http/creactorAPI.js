import {$authHost, $host} from "./index";


export  const  getEventCreator = async (userId, archive) =>{
    const  {data} = await $host.get('api/event/creator' , {
        params: {
            userId,
            archive
        }
    });
    return data
}
export  const  getControllers = async (id) =>{
    const  {data} = await $host.get('api/controller/' , {
        params: {
            id
        }
    });
    return data
}
export  const  deleteController = async (id) =>{
    const  {data} = await $host.delete('api/controller/' , {
        params: {
            id
        }
    });
    return data
}