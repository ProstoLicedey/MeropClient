import {$authHost, $host} from "./index";
import {saveAs} from 'file-saver'

export  const  getTicket = async (id, idUser) =>{
    const  response = await $authHost.get('api/ticket/' + id, {params: {idUser}})

    return response.data
}
export  const  CheckedHttp = async (id, idUser) =>{
    const  response = await $authHost.get('api/ticket/checked/' + id, {params: {idUser}})

    return response.data
}

