import React, {useContext, useEffect} from 'react';
import {Button, DatePicker, Empty, Form, Input, Row, Space} from "antd";
import onCreate from "../../services/userService/authService";
import Link from "antd/es/typography/Link";
import EventItem from "../home/EventItem";
import moment from "moment/moment";
import {Context} from "../../index";
import {getInfo, getOrders} from "../../http/userAPI";
import {useNavigate} from "react-router-dom";
import {HOME_ROUTE} from "../../utils/consts";
import {observe} from "mobx";
import {observer} from "mobx-react-lite";
import OrderCard from "./orderCard";
import Title from "antd/es/typography/Title";


const Orders = observer(() => {

    const { user } = useContext(Context);
    const navigate = useNavigate()

    useEffect(() => {
        if(user.user.id != undefined) {
            getOrders(user.user.id).then(data => user.setOrders(data));
        }
    }, [user.user]);

    return (
        <div style={{margin: "3em", justifyContent: "center", minWidth:300}}>
        <Title level={2} s>Мои билеты</Title>
    <div style={{display: "flex", justifyContent: "center", }}>
        <Row className="d-flex" style={{maxWidth: "1500px"}}>
            {user.orders.length === 0 ? (
                <Space direction="vertical" style={{display: "flex", textAlign: 'center', alignItems: 'center',  justifyContent: 'center', }}>
                    <Empty description="У вас пока нет билетов("/>
                    <Link onClick={() => {
                        navigate(HOME_ROUTE)
                    }}

                    >Исрпавить</Link>
                </Space>
            ) : (
                <Space wrap size={"large"} style={{minWidth:260}}>
                    {user.orders.map(order =>
                        <OrderCard key={order.id} thisOrder={order}/>
                    )}
                </Space>
            )}
        </Row>
    </div>
        </div>
    );
});

export default Orders;