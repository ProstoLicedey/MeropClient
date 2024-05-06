import React, {useContext, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import {fetchOneHall} from "../../http/hallAPI";
import {List, Space, Tag, Typography, Button} from "antd";
import Title from "antd/es/typography/Title";
import moment from "moment/moment";
import HallGenerate from "../../components/event/hall/hallGenerate";
import ErrorPage from "../ErrorPage";
import {DeleteOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import addTicket from "../../services/addTicket";
import {createOrder} from "../../http/orderAPI";
import {ORDER_ROUTE} from "../../utils/consts";

const color = [
    '#0958d9',
    '#ff7a45',
    '#73d13d',
    '#c41d7f',
    '#874d00',
    '#ffa940',
    '#36cfc9',
    '#ffec3d',
    '#36cfc9',
    '#ff7a45',
    '#ffc53d',
    '#cf1322',
    '#5b8c00',
    '#ff4d4f',
    '#bae637',
];

const Booking = () => {


    const {id} = useParams();
    const {hall, user} = useContext(Context);
    const navigate = useNavigate()

    useEffect(() => {
        if (hall.hall === {}) {
            fetchOneHall(id).then(data => hall.setHall(data));
        }
    }, []);

    if (!hall || !hall.hall || !hall.hall.event || !hall.hall.hallOptionPrice || !hall.selectedSeats) {
        return <ErrorPage/>;
    }
    console.log(hall.selectedSeats)

    function getPrice(row, seat) {
        let str = "";
        hall.hall.hallOptionPrice.forEach(HOP => {
            if (
                HOP.hallOption.seatStart <= seat &&
                HOP.hallOption.seatFinish >= seat &&
                HOP.hallOption.rowStart <= row &&
                HOP.hallOption.rowFinish >= row
            ) {
                str = HOP.price + "₽";
            }
        });
        return str;
    }

    function getName(row, seat) {
        let str = "";
        hall.hall.hallOptionPrice.forEach(HOP => {
            if (
                HOP.hallOption.seatStart <= seat &&
                HOP.hallOption.seatFinish >= seat &&
                HOP.hallOption.rowStart <= row &&
                HOP.hallOption.rowFinish >= row
            ) {
                str = HOP.hallOption.name;
            }
        });
        return str;
    }

    function getId(row, seat) {
        let id = 0;
        hall.hall.hallOptionPrice.forEach((HOP, index) => {
            if (
                HOP.hallOption.seatStart <= seat &&
                HOP.hallOption.seatFinish >= seat &&
                HOP.hallOption.rowStart <= row &&
                HOP.hallOption.rowFinish >= row
            ) {
                id = index;
            }
        });
        return id;
    }

    const calculateTotalPrice = () => {
        let totalPrice = 0;


        for (const seat in hall.selectedSeats) {
            const [rowIndex, seatIndex] = hall.selectedSeats[seat].split('-');
            hall.hall.hallOptionPrice.forEach(HOP => {
                if (
                    HOP.hallOption.seatStart <= seatIndex &&
                    HOP.hallOption.seatFinish >= seatIndex &&
                    HOP.hallOption.rowStart <= rowIndex &&
                    HOP.hallOption.rowFinish >= rowIndex
                ) {
                    totalPrice += HOP.price;
                }
            });

        }
        return totalPrice;
    };
    const Oformlenie = () => {
        for (const seat in hall.selectedSeats) {
            const [rowIndex, seatIndex] = hall.selectedSeats[seat].split('-');
            addTicket(null, hall, null, rowIndex, seatIndex);
        }
        const formData = new FormData
        formData.append('userId', user.user.id)

        formData.append('tickets', JSON.stringify(hall.ticket))
        createOrder(formData).then(data => {
            hall.setSelectedSeats([])
            hall.setHall({})
            navigate(ORDER_ROUTE + '/' + data.id)

        }).finally(hall.setTicket([]))
    };

    const handleDelete = (index) => {
        const updatedSelectedSeats = hall.selectedSeats;
        // Удаляем элемент по переданному индексу
        delete updatedSelectedSeats[index];
        console.log(updatedSelectedSeats)
        // Обновляем состояние объекта selectedSeats
        hall.setSelectedSeats(updatedSelectedSeats);
        console.log(hall.selectedSeats)
    };


    return (
        <Space size={0} direction="vertical" style={{margin: 10, width: '95%', height: '100%'}}>
            <Title>{hall.hall.event.title}</Title>
            <Space style={{width: '100%', height: '100%'}}>
                <Title level={4}>{moment(hall.hall.event.dateTime).locale('ru').format('DD MMMM')} •</Title>
                <Title level={4}>{moment(hall.hall.event.dateTime).locale('ru').format('ddd ')} •</Title>
                <Title level={4}>{moment(hall.hall.event.dateTime).locale('ru').format('HH:mm')} •</Title>
                <Title level={4}>{hall.hall.event.hall.name}</Title>
            </Space>

            <List
                style={{margin: 5, width: '99%'}}
                footer={<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Title level={2}>Итого: {calculateTotalPrice()}₽</Title>
                    <Button type="primary"
                            shape="round"
                            size="large"
                            onClick={() => Oformlenie()}
                            style={{
                                backgroundColor: '#722ed1',
                                fontSize: '1.5em',
                                display: 'flex', // добавляем flex-контейнер
                                alignItems: 'center', // выравниваем по центру по вертикали
                                justifyContent: 'center' // выравниваем по центру по горизонтали
                            }}>Оформить</Button>
                </div>}
                bordered
                itemLayout="vertical"
                dataSource={hall.selectedSeats}
                renderItem={(item, index) => (
                    <List.Item>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <Space direction={'horizontal'} align="center" justify="space-between">
                                <Space direction={'horizontal'}>
                                    <Title level={5}>
                                        Ряд {parseInt(item.split("-")[0])} Место {parseInt(item.split("-")[1])}
                                    </Title>
                                    <Tag style={{marginBottom: 10}}
                                         color={color[getId(parseInt(item.split("-")[0]), parseInt(item.split("-")[1]))]}>
                                        {getName(parseInt(item.split("-")[0]), parseInt(item.split("-")[1]))}
                                    </Tag>
                                </Space>
                            </Space>
                            <Title level={5} style={{alignSelf: 'flex-end'}}>
                                {getPrice(parseInt(item.split("-")[0]), parseInt(item.split("-")[1]))}
                            </Title>
                        </Space>
                    </List.Item>


                )}
            />
        </Space>
    );
};

export default observer(Booking);
