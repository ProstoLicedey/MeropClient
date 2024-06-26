import {$authHost, $host} from "./index";

export  const  createType = async (name) =>{
    const  response = await $authHost.post('api/type', {name})

    return response.data
}
export  const  deleteType = async (id) =>{
    const  response = await $authHost.delete('api/type', {params: {id}})

    return response.data
}

export  const  getTicketAdmin = async (id) =>{
    const  response = await $authHost.get('api/ticket/refunds/' + id)

    return response.data
}
export  const  deleteTicketAdmin = async (number) =>{
    const  response = await $authHost.delete('api/ticket/', {params: {number}})

    return response.data
}
export  const  getUserAdmin = async (email) =>{
    const  response = await $authHost.get('api/user/admin/',  {params: {email}})

    return response.data
}
export  const  getUserAllAdmin = async () =>{
    const  response = await $authHost.get('api/user/getAdmin/')

    return response.data
}
export  const  blockUser = async (email) =>{
    const  response = await $authHost.put('api/user/block/',  { email })

    return response.data
}
export const searchEventAdmin = async (input) => {
    if (!input) {
        return []; // возвращаем пустой массив, так как запрос не нужно отправлять
    }

    const response = await $authHost.get('api/event/searchAdmin/', { params: { input } });

    return response.data;
}
export  const  getEventAdmin = async (id) =>{
    const  response = await $authHost.get('api/event/getForAdmin/' + id)

    return response.data
}
export  const  blockEvent = async (id) =>{
    const  response = await $authHost.put('api/event/block/' + id)

    return response.data
}