import {makeAutoObservable} from "mobx";
export default class HallStore {
    constructor() {
        this._entrance = []
        this._ticket = []
        this._hall = {}

        makeAutoObservable(this)
    }

    setEntrance(entrance) {
        this._entrance = entrance
    }
    setTicket(ticket) {
        this._ticket = ticket
    }
    setHall(hall) {
        this._hall = hall
    }


    get entrance() {
        return this._entrance
    }
    get ticket() {
        return this._ticket
    }
    get hall() {
        return this._hall
    }
}