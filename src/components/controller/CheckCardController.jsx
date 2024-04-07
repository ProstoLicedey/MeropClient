import React, {useContext, useState} from 'react';
import {Button, Card, Flex, message, notification, Space} from 'antd';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import Title from "antd/es/typography/Title";
import {CheckedHttp, checkTicket, unCheckTicket} from "../../http/ticketAPI";
const CheckCardController = ({ style }) => {
    const { ticket, user } = useContext(Context);
    if (!ticket.controllerTicket) {
        return null;
    }
    const bgColor = ticket.controllerTicket.status ? '#d9f7be' : '#ff7875';

    const  Checked = () =>{
        CheckedHttp( ticket.controllerTicket.number,  user.user.id ).finally(
            () =>{
                ticket.setControllerTicket(null);
            }
        )


    }

    const success = () => {

    };
    return (
        <Card
            hoverable
            style={{ ...style,  height: '50vh', width:'60vw', backgroundColor: bgColor, padding:10,  }}
            bodyStyle={{
                padding: 0,
                overflow: 'hidden',
            }}
        >
            <Flex vertical justify={"space-around"} direction="vertical" size={"middle"}>
                {!ticket.controllerTicket.status ?
                    (<Space direction={"vertical"} size={0}>
                    <Title level={2}>
                        Билет использован в {ticket.controllerTicket.updatedAt}
                    </Title>
                <Title level={5}>
                    Кто-то уже использовал данный билет для прохода
                </Title>
                </Space>)
                    :
                    (
                        <Space direction={"vertical"} size={0}>
                            <Title level={2}>
                                Удачно
                            </Title>
                        </Space>
                    )
                }
                <Space>
                    <Title level={4} type="secondary">
                      название:
                    </Title>
                    <Title level={3} >
                        {ticket.controllerTicket.event.title}
                    </Title>
                    <Title></Title>
                </Space>
                <Space>
                    <Title level={4} type="secondary">
                        дата:
                    </Title>
                    <Title level={3} >
                        {ticket.controllerTicket.event.dateTime}
                    </Title>
                </Space>

                <Space>
                    <Title level={4} type="secondary">
                        вид:
                    </Title>
                    <Title level={3} >
                        {ticket.controllerTicket.entranceOptionPrice.entranceOption.name}
                    </Title>

                </Space>

                {ticket.controllerTicket.row && (<Space>
                    <Title level={4} type="secondary">
                        ряд:
                    </Title>
                    <Title level={3} >
                        {ticket.controllerTicket.row}
                    </Title>

                </Space>)}
                {ticket.controllerTicket.seat && (<Space>
                    <Title level={4} type="secondary">
                        место:
                    </Title>
                    <Title level={3} >
                        {ticket.controllerTicket.seat}
                    </Title>

                </Space>)}
                {ticket.controllerTicket.status &&  (<Button  style={{backgroundColor:'#722ed1'}} type={"primary"} onClick={Checked}> Прошел</Button>)}
            </Flex>
        </Card>
    );
};

export default observer(CheckCardController);
