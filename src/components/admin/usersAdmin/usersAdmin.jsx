import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, Input, Space} from "antd";
import Title from "antd/es/typography/Title";
import {Context} from "../../../index";
import {getTicketAdmin, getUserAdmin} from "../../../http/adminAPI";
import {SearchOutlined} from "@ant-design/icons";
import UserTable from "./userTable";
import UsersTable from "./usersTable";
import {observer} from "mobx-react-lite";


const UsersAdmin = () => {

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const {user} = useContext(Context);


    useEffect(() => {

        if (!!user.userBroadcast) {
            setEmail(user.userBroadcast);

        }
    }, [user.userBroadcast]);

    useEffect(() => {

        if (email.length == 0) {
            user.setUserAdmin(null)
        }
    }, [email]);

    const poiskUser = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Неправильный формат почты');
            setStatus('error');
            return;
        }

        setStatus('');
        setMessage('');

        getUserAdmin(email)
            .then((response) => {

                user.setUserAdmin(response);
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
                    setMessage( "Внутренняя ошибка");
                }
            })
    };

    return (
        <Space direction="vertical" size="small" style={{width: '100%'}}>
            <Space>
                <Title level={2}>Пользователи</Title>
            </Space>


            {!!message.length && <Alert message={message} type="error"/>}

            <Space>

                <Input
                    allowClear
                    status={status}
                    size="large"
                    placeholder="Email пользователя"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    type="primary"
                    size="large"
                    onClick={poiskUser}
                    style={{backgroundColor: '#722ed1'}}
                    shape="circle"
                    icon={<SearchOutlined />}
                />

            </Space>
            {user.userAdmin ? ( <UserTable/>) : (<UsersTable/>)}

        </Space>
    );
};

export default observer(UsersAdmin);