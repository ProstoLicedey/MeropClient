import React from 'react';
import {Card, Typography} from "antd";
import Meta from "antd/es/card/Meta";
import {observer} from "mobx-react-lite";
import moment from 'moment';
import {EVENT_ROUTE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import 'moment/locale/ru';
import * as events from "events";

const {Text, Title} = Typography

const EventItem = ({thisEvent}) => {
    const navigate = useNavigate()
    return (
        <Card
            hoverable
            style={{width: 240}}
            onClick={() => navigate(EVENT_ROUTE + '/' + thisEvent.id)}
            cover={
                <div style={{position: 'relative', paddingBottom: '150%'}}>
                    <img
                        alt="photo"
                        src={process.env.REACT_APP_API_URL + thisEvent.img}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            backgroundColor: '#9254de',
                            color: 'white',
                            borderRadius: '30%',
                            padding: '5px',
                            fontSize: '14px',
                            opacity: '0.8'
                        }}
                    >
                        от {thisEvent.minPrice}₽
                    </div>
                </div>
            }
        >
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#722ed1',
                color: 'white',
                borderRadius: '50%',
                padding: '5px',
                opacity: '0.8'
            }}>{thisEvent.ageRating? thisEvent.ageRating.age : null }+
            </div>
            <Title level={4} style={{height: '3em'}}>
                {thisEvent.title}
            </Title>
            <Title level={5} type="secondary" style={{height: '1em'}}>
                {thisEvent.dateTime
                    ? moment(thisEvent.dateTime).locale('ru').format('DD MMMM HH:mm ddd')
                    : ''}
            </Title>
            <Title level={5} type="secondary" style={{height: '1em'}}>
                {
                    thisEvent.hall ? thisEvent.hall.name : thisEvent.entrance ? thisEvent.entrance.name : null
                }

            </Title>
        </Card>
    )

};

export default observer(EventItem);