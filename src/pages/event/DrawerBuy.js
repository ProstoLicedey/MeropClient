import React, {useContext, useEffect, useState} from 'react';
import {Button, Drawer, Empty, Space} from "antd";
import {getEntrance} from "../../http/entranceAPI";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {useNavigate, useParams} from "react-router-dom";
import Title from "antd/es/typography/Title";
import EntranceLine from "../../components/event/entranceLine";
import {createOrder} from "../../http/orderAPI";
import { ORDER_ROUTE} from "../../utils/consts";

const DrawerBuy = ({open, onClose, entranceId}) => {
    const { event, hall, user} = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if(event.event.entranceId){
            getEntrance(event.event.entranceId, event.event.id).then(data => hall.setEntrance(data))
        }
    }, [event.event]);

    const  addOrder = () =>{
        const  formData = new FormData
        formData.append('userId', user.user.id)
        formData.append('tickets', JSON.stringify(hall.ticket))
        createOrder(formData).then(data => {
           navigate(ORDER_ROUTE+ '/' + data.id)

        })
    };

    return (
        <Drawer
            title="Выбрать билет"
            placement="bottom"
            onClose={onClose}
            open={open}

        >

            {hall.entrance.length === 0 ? (
                <Space direction="vertical" style={{display: "flex", textAlign: 'center', alignItems: 'center',  justifyContent: 'center', }}>
                    <Title>Ошибочка...</Title>
                    <Title level={3}>Уже чиним</Title>

                </Space>
            ) : (
                <Space direction={"vertical"} style={{width:'100%'}}>
                    {hall.entrance.map(entrance =>
                        <EntranceLine key={entrance.id} thisEntranceOption={entrance}/>
                    )}

                </Space>
            )}
                      <Button
                type="primary"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#722ed1',
                    width: '15em',
                    height: '4em',
                    margin: '20px'
                }}
                onClick={addOrder}
            >
                Оформить
            </Button>
        </Drawer>
    );
};



export default observer(DrawerBuy);