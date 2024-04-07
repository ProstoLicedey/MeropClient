import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOneEvent } from '../../http/eventAPI';
import { getTicket } from '../../http/ticketAPI';
import { Context } from '../../index';
import CheckCardController from '../../components/controller/CheckCardController';
import { Alert } from 'antd';

const TicketCheck = () => {
    const { id } = useParams();
    const { ticket, user } = useContext(Context);
    const [error, setError] = useState(null);

    useEffect(() => {
        getTicket(id, user.user.id)
            .then((data) => ticket.setControllerTicket(data))
            .catch((error) => {
                if (error.response && (error.response.status === 403 || error.response.status === 400)) {
                    setError('Билет не найден, либо это билет не на ваше мероприятие');
                } else {
                    setError('Произошла ошибка при получении билета');
                }
            });
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Set to full height of the viewport
            }}
        >
            {error ? (
                <Alert message="Ошибка" showIcon description={error} type="error" />
            ) : (
                <CheckCardController style={{ width: '60vw', height: '50vh' }} />
            )}
        </div>
    );
};

export default TicketCheck;