import {makeAutoObservable} from "mobx";
export  default  class UserStore{
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userProfile = {}
        this._orders = []
        this._userAdmin = null
        makeAutoObservable(this)
    }

    setIsAuth(bool){
        this._isAuth = bool

    }
    setUser(user){
         this._user = user

    }
    setUserProfile(userProfile){

        this._userProfile = userProfile

    }
    setOrders(orders){
        this._orders = orders


    }
    setUserAdmin(userAdmin){
        this._userAdmin = userAdmin

    }
    get isAuth(){
        return this._isAuth
    }
    get orders(){
        return this._orders
    }

    get user(){
        return this._user
    }
    get userProfile(){
        return this._userProfile
    }
    get userAdmin(){
        return this._userAdmin
    }

}