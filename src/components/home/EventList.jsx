import React, {useContext, useEffect, useState} from 'react';
import { Context } from "../../index";
import {Empty, Row, Space, Pagination, Select} from "antd";
import EventItem from "./EventItem";
import { observer } from "mobx-react-lite";
import Title from "antd/es/typography/Title";
import Link from "antd/es/typography/Link";
import {fetchEvent} from "../../http/eventAPI";

const EventList = ({ thisEvent }) => {
    const { event } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 12; // You can change this according to your preference

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = event.events.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber) => event.setPage(pageNumber);

    return (
        <div style={{ display: "flex", justifyContent: "center", margin: "5vh" }}>
            <Row className="d-flex" style={{ maxWidth: "1500px" }}>
                {event.events.length === 0 ? (
                    <Space direction="vertical" style={{ display: "flex", textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                        <Empty description="По вашему запросу мероприятий не найдено(" />
                        <Link onClick={() => {
                            event.setPage();
                            event.setSelectedType({});
                            event.setSelectedCity({});
                            event.setSelectedDate({});
                            event.setSelectedPrice({});
                            event.setSerchTitle(null);
                        }}>Сброс настроек</Link>
                    </Space>
                ) : (
                    <>

                        <Space wrap size={"large"} style={{ minWidth: 260 }}>

                            {currentEvents.map(event =>
                                <EventItem key={event.id} thisEvent={event} />
                            )}
                        </Space>
                        {event.events.length > 12 && (
                        <Pagination
                            style={{ marginTop: "20px", textAlign: "center" }}
                            defaultCurrent={1}
                            current={event.pages}
                            pageSize={eventsPerPage}
                            total={event.totalCount}
                            onChange={paginate}
                        />
                            )}
                    </>
                )}
            </Row>
        </div>
    );
};

export default observer(EventList);
