import React, {useContext, useEffect} from 'react';
import {Context} from "../../index";
import {Button, Col, Popconfirm, Row} from "antd";
import ParametersBar from "../../components/home/ParametersBar";
import EventList from "../../components/home/EventList";
import Orders from "../../components/user/orders";
import Profile from "../../components/user/profile";
import {fetchOneEvent} from "../../http/eventAPI";
import {getInfo, logout} from "../../http/userAPI";
import {observer} from "mobx-react-lite";
import {LogoutOutlined} from "@ant-design/icons";

const User = () => {
    const {user} = useContext(Context)

    const handleLogout = () => {
        logout()
            .then(r => {
                    window.location.reload()
                }
            )
    };

    return (
        <Row className="mt-3">
            <Col md={8} style={{padding: "3em"}}>
                <Popconfirm
                    title="Выйти из аккаунта?"
                    onConfirm={handleLogout}
                    okText="Выйти"
                    cancelText="Остаться"
                    placement="bottom"
                    okButtonProps={{ style: { backgroundColor: '#722ed1' } }}
                >
                    <Button  block >
                        Выйти из аккаунта<LogoutOutlined/>
                    </Button>
                </Popconfirm>
                <Profile/>
            </Col>
            <Col md={16}>
                <Orders/>
            </Col>

        </Row>
    );
};

export default observer(User);