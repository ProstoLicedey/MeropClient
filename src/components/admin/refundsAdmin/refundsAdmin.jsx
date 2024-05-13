import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../../index";
import {getTicket} from "../../../http/ticketAPI";
import {Alert, Button, Card, Divider, Input, List, Popconfirm, Space, Typography} from "antd";
import Title from "antd/es/typography/Title";
import Carouselcontroller from "../../controller/Carouselcontroller";
import CheckCardController from "../../controller/CheckCardController";
import TicketRefunds from "./ticketRefunds";
import {getTicketAdmin} from "../../../http/adminAPI";
import {observer} from "mobx-react-lite";
import {fetchOneOrder} from "../../../http/orderAPI";
import {SearchOutlined} from "@ant-design/icons";

const {Text, Link} = Typography;

const RefundsAdmin = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const {ticket} = useContext(Context);

    const postTicket = () => {
        if (ticketNumber.length !== 7) {
            setStatus('error');
            setMessage('Номер билета состоит из 7 цифр');
            return;
        }

        setStatus('');
        setMessage('');

        getTicketAdmin(ticketNumber)
            .then((response) => {

                ticket.setRefundsTicket(response);
            })
            .catch((error) => {
                console.error('Error fetching ticket:', error);

                // You can also set a specific error message based on the error type or status code
                if (error.response && (error.response.status === 403)) {
                    setMessage('Билет не найден');
                } else if (error.response && (error.response.status === 404)) {
                    setMessage( "Билет уже использован при входе, его нельзя вернуть");
                }
                else {
                    setMessage( "Внутреняя ошибка");
                }
            })
    };

    return (
        <Space direction="vertical" size="small" style={{width: '100%'}}>
            <Space>
                <Title level={2}>Возврат билетов</Title>
            </Space>

            {!!message.length && <Alert message={message} type="error"/>}

            <Space>
                <Input
                    status={status}
                    size="large"
                    placeholder="Номер билета"
                    maxLength={7}
                    type="number"
                    onChange={(e) => setTicketNumber(e.target.value)}
                />
                <Button style={{backgroundColor: '#722ed1'}}
                        type="primary"
                        size="large"
                        onClick={postTicket}
                        shape="circle"
                        icon={<SearchOutlined/>}
                />
            </Space>
           <TicketRefunds/>

        </Space>
    );
};

export default observer(RefundsAdmin);