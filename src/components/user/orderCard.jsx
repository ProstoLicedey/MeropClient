import React from 'react';
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {Card, Row, Tag, Typography} from "antd";
import {EVENT_ROUTE, ORDER_ROUTE} from "../../utils/consts";
import moment from "moment/moment";
import Title from "antd/es/typography/Title";
import AddressLink from "../event/AddressLink";
import MoneyIcon from "../../assets/icon/MoneyIcon";
import Ticket from "../../assets/icon/Ticket";
import PlaceHolder from '../../assets/placeholder.png'
import ControllerComponent from "../controller/ControllerComponent";
import Profile from "./profile";
const {Text} = Typography

const PLANS = {
    true: "Активны",
    false: "Билеты использованны",
    notAll: "Часть билетов использована",
    prosrock: "Билеты просрочены"
}
const PLANSCOLORS = {
    true: "purple",
    false: "error",
    notAll: "orange",
    prosrock: "#cd201f"
}
const OrderCard = ({thisOrder}) => {
            const navigate = useNavigate()
    const isPastEvent = moment(thisOrder.dateTime).isBefore(moment());


    const StatusView = PLANS[isPastEvent && thisOrder.status != false ? "prosrock" :thisOrder.status];
    const StatusColor = PLANSCOLORS[isPastEvent && thisOrder.status != false ? "prosrock" :thisOrder.status];

            return (
            <Card
                title= {moment(thisOrder.dateTime).locale('ru').format('DD MMMM HH:mm ddd')}
                hoverable
                style={{width: 240}}
                onClick={() => navigate(ORDER_ROUTE + '/' + thisOrder.id)}
                cover={
                    <div style={{
                        position: 'relative',
                        paddingBottom: '150%',
                        filter: isPastEvent ? 'grayscale(100%)' : 'none', // Добавляем эффект ч/б, если это прошедшее событие
                    }}>
                        <img
                            alt="photo"
                            src={thisOrder.img? process.env.REACT_APP_API_URL + thisOrder.img : PlaceHolder}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                }
            >
                <Title level={4} evel={4} style={{ maxHeight: '3em', overflow: 'hidden' }}>
                    {thisOrder.title}
                </Title>
                <Tag color= {StatusColor}>{StatusView}</Tag>
                <Row>
                <Ticket style={{width:20, height:20, marginTop: 3, marginRight: 3, color:'#999898'}} />
                    <Title level={5} type="secondary" style={{ height: '1em' }}>
                        {thisOrder.ticketsCount} {thisOrder.ticketsCount > 1 ? 'билета' : 'билет'}

                    </Title>
                </Row>
                <AddressLink
                style={{marginTop: -10}}
                name={thisOrder ? thisOrder.addressName : null}
                address={thisOrder ? thisOrder.address : null}
                styleIcon={{width:'20',marginTop: 3, height: '20', marginRight: 3, color:'#999898', }}
                styleTitle={{height: '1em', color:'#999898', }}
                level={5}
                />
            </Card>
            )

};

export default observer(OrderCard);