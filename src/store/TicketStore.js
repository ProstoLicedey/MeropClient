import {makeAutoObservable} from "mobx";
export  default  class TicketStore{
    constructor() {

        this._controllerTicket = null
        this._refundsTicket = null
        makeAutoObservable(this)
    }

    setTicket(ticket){
        this._ticket = ticket

    }
    setControllerTicket(controllerTicket){
        this._controllerTicket = controllerTicket

    }
    setRefundsTicket(refundsTicket){
        this._refundsTicket = refundsTicket

    }

    get ticket(){
        return this._ticket
    }
    get controllerTicket(){
        return this._controllerTicket
    }
    get refundsTicket(){
        return this._refundsTicket
    }


}