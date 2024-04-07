import {$authHost, $host} from "./index";
import jwtDecode from "jwt-decode";

export  const  registration = async (email, password, name, surname, birthday, role, creatorId) =>{
    const {data} = await $host.post('api/user/registration', {email, password, name, surname, birthday, role, creatorId})
    console.log(data)
    if (data === 'Пользователь добавлен'){
        return true
    }

    return  jwtDecode(data.accessToken)

}

export  const  login = async (email, password) =>{
    const {data} = await $host.post('api/user/login', {email, password})
    return jwtDecode(data.accessToken)
}
export  const  receiveCode = async (email) =>{
    return await $host.post('api/user/receiveCode', {email})

}
export  const  updatePass = async (email, password) =>{
    return await $host.post('api/user/updatePass', {email, password})

}

export  const  inputCode = async  (email, code) =>{
    return await $host.post('api/user/inputCode', {email, code})
}

export  const  logout = async () =>{
    let token = localStorage.getItem('token');
    return  await $host.post('api/user/logout', {token})

}
export  const  check = async () =>{
    return await $authHost.get('/api/user/auth',)
}

export  const getInfo = async (id) =>{

    const {data} = await $authHost.get('/api/user/' + id)
    return data
}
export  const getOrders = async (id) =>{

    const {data} = await $authHost.get('/api/order/user/' + id)
    return data
}
export  const putUser = async (id, user) =>{

    const {data} = await $host.put('/api/user/update/' + id, user )
    return data
}
