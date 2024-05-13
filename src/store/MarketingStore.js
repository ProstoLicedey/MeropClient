import {makeAutoObservable} from "mobx";
export  default  class MarketingStore{
    constructor() {

        this._marketingController = []
        this._events = []
       // this._refundsTicket = null
        makeAutoObservable(this)
    }

    setMarketingController(marketingController){
        this._marketingController = marketingController

    }
    setEvents(events){
        this._events = events

    }
    setRefundsTicket(refundsTicket){
        this._refundsTicket = refundsTicket

    }

    get marketingController(){
        return this._marketingController
    }
    get events(){
        return this._events
    }
    get refundsTicket(){
        return this._refundsTicket
    }


}