import {makeAutoObservable} from "mobx";
export  default  class TicketStore{
    constructor() {

        this._controllerTicket = null
        makeAutoObservable(this)
    }

    setTicket(ticket){
        this._ticket = ticket

    }
    setControllerTicket(controllerTicket){
        this._controllerTicket = controllerTicket

    }

    get ticket(){
        return this._ticket
    }
    get controllerTicket(){
        return this._controllerTicket
    }


}