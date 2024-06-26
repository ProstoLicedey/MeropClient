import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import { getTicket } from '../../http/ticketAPI';
import { Alert, Button, Input, Space } from 'antd';
import Carouselcontroller from './Carouselcontroller';
import CheckCardController from './CheckCardController';
import Title from 'antd/es/typography/Title';
import { observer } from 'mobx-react-lite';
import { SearchOutlined } from '@ant-design/icons';

const ControllerComponent = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const { user, ticket } = useContext(Context);

    const postTicket = () => {
        if (ticketNumber.length !== 7) {
            setStatus('error');
            setMessage('Номер билета состоит из 7 цифр');
            return;
        }

        setStatus('');
        setMessage('');

        getTicket(ticketNumber, user.user.id)
            .then((response) => {
                // Обертываем изменение observable в экшен
                ticket.setControllerTicket(response);
            })
            .catch((error) => {
                console.error('Error fetching ticket:', error);

                // You can also set a specific error message based on the error type or status code
                if (error.response && error.response.status === 403) {
                    setMessage('Билет не найден, либо это билет не на ваше мероприятие');
                } else {
                    setMessage('Произошла ошибка при получении билета');
                }
            });
    };

    return (
        <Space direction="vertical" size="small" style={{ display: 'flex', flexDirection: 'column' }}>
            <Space>
                <Title level={2}>Контроль билетов</Title>
            </Space>

            {!!message.length && <Alert message={message} type="error" />}

            <Space>
                <Input
                    status={status}
                    size="large"
                    placeholder="Номер билета"
                    maxLength={7}
                    type="number"
                    onChange={(e) => setTicketNumber(e.target.value)}
                />
                <Button
                    type="primary"
                    size="large"
                    onClick={postTicket}
                    style={{ backgroundColor: '#722ed1' }}
                    shape="circle"
                    icon={<SearchOutlined />}
                />
            </Space>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                {ticket.controllerTicket === null ? (
                    <Carouselcontroller />
                ) : (
                    <CheckCardController />
                )}
            </div>
        </Space>
    );
};

export default observer(ControllerComponent);
