import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import EventStore from "./store/EventStore";
import HallStore from "./store/HallStore";
import TicketStore from "./store/TicketStore";
import CreatorStore from "./store/CreatorStore";
import MarketingStore from "./store/MarketingStore";


export const Context = createContext(null)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <React.StrictMode>
        
        <Context.Provider value={{
            hall : new HallStore(),
            user: new UserStore(),
            event: new EventStore(),
            ticket: new TicketStore(),
            creator: new CreatorStore(),
            marketing: new MarketingStore(),
        }}>
            <App />
        </Context.Provider>
    </React.StrictMode>
);

