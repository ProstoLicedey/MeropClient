import {$authHost, $host} from "./index";

export  const  getMerketingCreator = async (id) =>{
    const  {data} = await $host.get('api/marketing/creator/' + id )
    return data
}
export  const  getMerketingAdmin = async () =>{
    const  {data} = await $host.get('api/marketing/admin' )
    return data
}
export  const  marketingStatusUpdate = async (id, status) =>{
    const  {data} = await $host.put('api/marketing/' + id, {status} )
    return data
}

export  const  getEventForMarketing = async (id) =>{
    const  {data} = await $host.get('api/marketing/getEvent/' + id )
    return data
}
export  const  createMarketing = async (marketing) =>{
    const  {data} = await $host.post('api/marketing/', marketing )
    return data
}

export  const  deleteMarketing = async (id) =>{
    const  {data} = await $host.delete('api/marketing/' , {
        params: {
            id
        }
    });
    return data
}