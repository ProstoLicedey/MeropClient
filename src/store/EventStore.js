import {makeAutoObservable} from "mobx";
export default class EventStore {
    constructor() {
        this._types = []
        this._ratings= []
        this._events = []
        this._event = {}


        this._selectedType = {}
        this._serchTitle = {}
        this._selectedDate = {}
        this._selectedPrice = {}

        this._page = 1
        this._totalCount = 0
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    setRatings(ratings) {
        this._ratings = ratings
    }
    setEvents(events) {
        this._events = events
    }
    setEvent(event) {
        this._event = event
    }

        setSelectedType(type) {

        if (type === this._selectedType){
            this._selectedType = {}
        }
        else {
        this._selectedType = type
        }
    }
    setSelectedDate(date) {
        this._selectedDate = date
    }
    setSerchTitle(serchTitle) {
        this._serchTitle = serchTitle
    }
    setSelectedPrice(price) {
        this._selectedPrice = price
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    get types() {
        return this._types
    }
    get ratings() {
        return this._ratings
    }
    get events() {
        return this._events
    }
    get event() {
        return this._event
    }
    get selectedType() {
        return this._selectedType
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get selectedDate() {
        return this._selectedDate
    }
    get selectedPrice() {
        return this._selectedPrice
    }
    get serchTitle() {
        return this._serchTitle
    }
}