import {
    ADMIN_ROUTE, BOOKING_ROUTE, CONTROLLER_CREATOR_ROUTE, CONTROLLER_ROUTE, CREATEEVENT_ROUTE,
    CREATOR_ROUTE, CREATORINFO_ROUTE, CREATORREGIST_ROUTE,
    EVENT_ROUTE, HALL_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE, ORDER_ROUTE,
    REGISTRATION_ROUTE, TICKET_ROUTE, TICKETCHEK_ROUTE,
    USER_ROUTE
} from "./utils/consts";

import Login from "./pages/login";
import Home from "./pages/event/home";
import Event from "./pages/event/event";
import Creator from "./pages/creator/creator";
import User from "./pages/user/user";
import AdminPage from "./pages/admin/adminPage";
import Hall from "./pages/event/hall";
import Order from "./pages/event/order";
import CreatorRegist from "./pages/creator/creatorRegist";
import TicketCheck from "./pages/creator/ticketCheck";
import CreateEvent from "./pages/creator/createEvent";
import ControllerCreator from "./pages/creator/controllerCreator";
import ControllerPage from "./pages/controller/ControllerPage";
import Booking from "./pages/event/Booking";

export const  userRoutes = [

    {
        path: USER_ROUTE,
        Component: User
    },

]


export  const creatorRoutes = [
    {
        path: CREATOR_ROUTE,
        Component: Creator
    },
    {
        path: TICKETCHEK_ROUTE+ '/:id',
        Component: TicketCheck
    },
    {
        path: CREATEEVENT_ROUTE + '/:id',
        Component: CreateEvent
    },
    {
        path: CREATEEVENT_ROUTE,
        Component: CreateEvent
    },
    {
        path: CONTROLLER_CREATOR_ROUTE,
        Component: ControllerCreator
    },

]
export  const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: AdminPage
    },

]
export  const controllerRoutes = [
    {
        path: CONTROLLER_ROUTE,
        Component: ControllerPage
    },

]

export  const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component:Home
    },
    {
        path: CREATORREGIST_ROUTE,
        Component: CreatorRegist
    },
    {
        path: EVENT_ROUTE + '/:id',
        Component: Event
    },

]
export  const registrationRoutes = [

    {
        path: HALL_ROUTE + '/:id',
        Component: Hall
    },
    {
        path: ORDER_ROUTE + '/:id',
        Component: Order
    },
    {
        path: BOOKING_ROUTE+ '/:id',
        Component: Booking
    },

]