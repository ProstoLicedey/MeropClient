import React, {useEffect, useState} from 'react';
import {PDFViewer} from "@react-pdf/renderer";
import {useParams} from "react-router-dom";
import Ticket from "../../services/ticketGenerate/ticket";
import {fetchOneEvent} from "../../http/eventAPI";
import {fetchOneOrder} from "../../http/orderAPI";
import {observer} from "mobx-react-lite";

const Order = () => {
    const {id} = useParams();
        const [tickets, setTickets] = useState();
    useEffect(() => {
        fetchOneOrder(id).then(data =>   setTickets(data));

    }, []);

    return (
        (tickets &&
            <PDFViewer style={{width: '100%', height: '100vh'}}>
                <Ticket order={tickets} style={{height: '100%', width:'100%'}}/>
            </PDFViewer>
        )
    );
};

export default observer(Order);