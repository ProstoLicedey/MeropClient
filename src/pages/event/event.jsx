import React, {useContext, useEffect, useState} from 'react';
import {fetchOneEvent} from '../../http/eventAPI';
import {useNavigate, useParams} from 'react-router-dom';
import {Context} from '../../index';
import {Button, Col, Collapse, Image, Row, Space, Tag, Typography} from 'antd';
import {observer} from 'mobx-react-lite';
import Title from 'antd/es/typography/Title';
import ShareButton from '../../components/event/ShareButton';
import AddressLink from '../../components/event/AddressLink';
import Paragraph from 'antd/es/typography/Paragraph';
import DrawerBuy from "./DrawerBuy";
import CollectionCreateForm from "../../components/auth/authModals";
import {EVENT_ROUTE, HALL_ROUTE} from "../../utils/consts";
import moment from "moment";
import {CalendarOutlined} from "@ant-design/icons";
import IconCalendar from "../../assets/icon/CalendarIcon";
import MoneyIcon from "../../assets/icon/MoneyIcon";
import {ReCAPTCHA} from "react-google-recaptcha";

const {Text, Link} = Typography;
const {Panel} = Collapse;


const Event = () => {
    const {id} = useParams();
    const {event, user} = useContext(Context);
    const [expanded, setExpanded] = useState(false);
    const [rows, setRows] = useState(3);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchOneEvent(id).then(data => event.setEvent(data));
    }, []);

    if (!event || !event.event) {
        return null; // Возвращаем null, если нет данных о событии или свойства event.event
    }

    const handleExpand = () => {
        setExpanded(prevExpanded => !prevExpanded);
        setRows(prevRows => (prevRows === 3 ? 0 : 3));
    };

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            
            <Row style={{margin: '5%'}}>
                <Col md={6}>
                    <Image
                        alt="photo"
                        src={process.env.REACT_APP_API_URL + event.event.img}
                        width={'20vw'}
                        height={'30vw'}
                        style={{
                            borderRadius: '5%',
                            padding: '5px',
                            objectFit: 'cover',
                        }}
                    />
                </Col>
                <Col md={18} style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Space direction="vertical" size={"middle"}>
                        <Row s>
                            <Tag style={{fontWeight: 'bold'}} bordered={false}>
                                {event.event.ageRating ? event.event.ageRating.age : null}
                                +
                            </Tag>
                            <Tag style={{fontWeight: 'bold'}} bordered={false}>
                                {event.event.type ? event.event.type.name : null}
                            </Tag>
                        </Row>
                        <Title>{event.event.title}</Title>
                        <AddressLink
                            style={{marginTop: -10}}
                            name={event.event.hall ? event.event.hall.name : event.event.entrance ? event.event.entrance.name : null}
                            address={event.event.hall ? event.event.hall.address : event.event.entrance ? event.event.entrance.address : null}
                            styleIcon={{width:30, height:30, marginRight: 5}}
                            styleTitle={{cursor:"pointer"}}
                            level = {4}
                            underline ={true}
                        />
                        <Row tyle={{display: 'flex', alignItems: 'center',}}>
                            <IconCalendar style={{width:30, height:30, marginRight: 5}}/>
                            <Title level={4}>{moment(event.event.dateTime).locale('ru').format('DD MMMM HH:mm ddd ')}</Title>
                        </Row>
                        <Row>
                           <MoneyIcon style={{width:30, height:30, marginRight: 5}} />
                        <Title level={4}>{event.event.minPrice}-{event.event.maxPrice}₽</Title>
                        </Row>
                        <div>
                            <Paragraph
                                ellipsis={{
                                    rows,
                                    symbol: expanded ? 'Свернуть' : 'Подробнее',
                                }}
                                title={event.event.description}
                                style={{whiteSpace: 'pre-wrap'}}
                            >
                                {event.event.description}

                            </Paragraph>
                            <Button type="link" onClick={handleExpand} style={{float: 'right', marginTop: '-1em'}}>
                                {expanded ? 'Свернуть' : 'Подробнее'}
                            </Button>

                        </div>
                        <Space style={{float: 'right'}}>
                            <Button
                                type="primary"
                                style={{backgroundColor: '#722ed1',  height: '4em', fontSize:'1.4em'}}
                                onClick={() => {
                                    if (user.isAuth) {
                                        if (event.event.entranceId) {
                                            setOpenDrawer(true);
                                        } else if (event.event.hallId) {
                                            navigate(HALL_ROUTE + '/' + event.event.id)
                                        }
                                    } else {

                                        setOpenAuth(true);
                                    }
                                }}
                            >
                                {event.event.hall ? 'Выбрать место' : 'Бронировать'}
                            </Button>
                            <ShareButton/>
                        </Space>

                    </Space>
                </Col>
            </Row>
            <DrawerBuy open={openDrawer} onClose={() => setOpenDrawer(false)}/>
            <CollectionCreateForm
                open={openAuth}
                onCancel={() => {
                    setOpenAuth(false);
                }}

            />
        </div>
    );
};

export default observer(Event);