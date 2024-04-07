import React, {useContext, useEffect, useState} from 'react';
import SerchInput from "../../components/serch";
import {useMediaQuery} from "react-responsive";
import EventList from "../../components/home/EventList";
import {Context} from "../../index";
import {fetchEvent, fetchTypes} from "../../http/eventAPI";
import {observer} from "mobx-react-lite";
import {Button, Col, Drawer, Row} from "antd";
import ParametersBar from "../../components/home/ParametersBar";
import {SlidersOutlined} from "@ant-design/icons";


const Home = observer( () =>  {
    const isMobile = useMediaQuery({ maxWidth: 950 });
    const  {event} = useContext(Context)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    useEffect(() => {
       fetchTypes().then(data => event.setTypes(data))
        fetchEvent(null, 1, null, null).then(data => {
            event.setEvents(data.rows)
            event.setTotalCount(data.count)
        })
    }, []);
    useEffect(() => {
        fetchEvent(event.selectedType.value, event.page, event.selectedPrice, event.selectedDate, event.serchTitle).then(data => {
            event.setEvents(data.rows)
            event.setTotalCount(data.count)
        })
    }, [event.page, event.selectedType, event.selectedDate,event.selectedPrice, event.serchTitle])
    return (
        <div>
            {isMobile && (<SerchInput style={{ padding: '3vw'}}/> )}
            {!isMobile &&<Row className="mt-3">
                <Col md={6}>
                      <ParametersBar/>
                </Col>
                <Col md={18}>
                    <EventList/>
                </Col>

            </Row>}
            {isMobile &&
            <div >
                <Button  type="text" style={{marginLeft:'0.5em', fontSize:'1.5em', width:30, height:30}} onClick={handleMenuToggle}>
                    <SlidersOutlined style={{color: '#722ed1'}} />
                </Button>
                <Drawer

                    title="Параметры"
                    placement="left"
                    onClose={handleMenuToggle}
                    open={isMenuOpen}
                >
                    <ParametersBar />
                </Drawer>
                <EventList/>
            </div>}


        </div>
    );
});

export default Home;