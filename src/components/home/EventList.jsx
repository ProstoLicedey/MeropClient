import React, {useContext} from 'react';
import {Context} from "../../index";
import {Empty, Row, Space} from "antd";
import EventItem from "./EventItem";
import {observer} from "mobx-react-lite";
import Title from "antd/es/typography/Title";
import Link from "antd/es/typography/Link";
import {scryRenderedComponentsWithType} from "react-dom/test-utils";

const EventList = ({thisEvent}) => {
    const {event} = useContext(Context)
    return (
        <div style={{display: "flex", justifyContent: "center", margin: "5vh"}}>
            <Row className="d-flex" style={{maxWidth: "1500px"}}>
                {event.events.length === 0 ? (
                    <Space direction="vertical" style={{display: "flex", textAlign: 'center', alignItems: 'center',  justifyContent: 'center', }}>
                        <Empty description="По вашему запросу мероприятий не найдено("/>
                        <Link onClick={() => {
                            event.setPage()
                            event.setSelectedType({})
                            event.setSelectedDate({})
                            event.setSelectedPrice({})
                            event.setSerchTitle(null)
                            }}

                        >Сброс настроек</Link>
                    </Space>
                ) : (
                    <Space wrap size={"large"} style={{minWidth:260}}>
                        {event.events.map(event =>
                            <EventItem key={event.id} thisEvent={event}/>
                        )}
                    </Space>
                )}
            </Row>
        </div>

    );
};

export default observer(EventList);