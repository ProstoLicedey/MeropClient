import React, {useContext, useState} from 'react';
import {Button, Divider, notification, Row, Space} from "antd";
import Title from "antd/es/typography/Title";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import addTicket from "../../services/addTicket";
import {Context} from "../../index";
import removeTicket from "../../services/removeTicket";


const EntranceLine = ({thisEntranceOption}) => {
    const [counter, setCounter] = useState(0);
    const { event, hall } = useContext(Context);
    const [disable, setDisable] = useState(false);

    const counterMinus = () => {
        if (counter > 0) {
            setCounter(counter - 1);
            setDisable(false);
            removeTicket(thisEntranceOption.entranceOptionPrice.id, event, hall)
        }
    };

    const counterPlus = () => {
        if( counter >= thisEntranceOption.entranceOptionPrice.seatsLeft){
            return notification.info({
                message: 'Таких билетов больше не осталось :(',
            })
        }
        if( counter >= 5){
            return notification.error({
                message: 'Нельзя забронировать больше 5 билетов за раз',
            })
        }
            setCounter(counter + 1);
            //addTicket(thisEntranceOption.entranceOptionPrice.id, event, hall);
            addTicket( event, hall, thisEntranceOption.entranceOptionPrice.id);
            console.log(hall.ticket)
    };

    return (
        <Row
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginLeft: "2.5%",
                marginRight: "20%",
            }}
        >
            <Title level={3}>{thisEntranceOption.name}</Title>

            <Space style={{ display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ margin: 3 }}>
                    {thisEntranceOption.entranceOptionPrice.price}₽
                </Title>
                <Button
                    type="primary"
                    shape="circle"
                    icon={<MinusOutlined />}
                    style={{ backgroundColor: "#722ed1" }}
                    onClick={counterMinus}
                />
                <Title level={2} style={{ margin: 3 }}>
                    {counter}
                </Title>
                <Button
                    type="primary"
                    shape="circle"
                    disabled={disable}
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: "#722ed1" }}
                    onClick={counterPlus}
                />
            </Space>
            <Divider />
        </Row>
    );
};

export default EntranceLine;