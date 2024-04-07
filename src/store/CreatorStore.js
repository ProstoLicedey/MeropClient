import {makeAutoObservable} from "mobx";
export  default  class CreatorStore{
    constructor() {

        this._events = []
        this._entranceAll = []
        this._entrance = {}
        this._plan = "events"
        this._halls  = []
        makeAutoObservable(this)
    }

    setEvents(events) {
        this._events = events
    }
    setPlan(plan) {
        this._plan = plan
    }
    setEntranceAll(entranceAll) {
        this._entranceAll = entranceAll
    }
    setEntrance(entrance) {
        this._entrance = entrance
    }
    setHalls(halls) {
        this._halls = halls
    }

    get events() {
        return this._events
    }
    get plan() {
        return this._plan
    }
    get entranceAll() {
        return this._entranceAll
    }
    get entrance() {
        return this._entrance
    }
    get halls() {
        return this._halls
    }


}