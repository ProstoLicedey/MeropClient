import React, {useContext, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {Context} from "../../index";
import {Space} from "antd";
import Title from "antd/es/typography/Title";
import {fetchOneEvent} from "../../http/eventAPI";
import {fetchOneHall} from "../../http/hallAPI";
import moment from "moment";
import {observer} from "mobx-react-lite";
import HallGenerate from "../../components/event/hall/hallGenerate";

const Hall = () => {
    const {id} = useParams();
    const {hall} = useContext(Context);
    useEffect(() => {
        fetchOneHall(id).then(data => hall.setHall(data));
    }, []);

    if (!hall || !hall.hall || !hall.hall.event || !hall.hall.hollOptionPrice) {
        return null; // Возвращаем null, если нет данных
    }

    return (
        <Space size={0} direction={"vertical"} style={{margin: 10, flex: 1, width: '100%', height: '100%'}}>
            <Title>{hall.hall.event.title}</Title>
            <Space style={{width: '100%', height: '100%'}}>
                <Title level={4}>{moment(hall.hall.event.dateTime).locale('ru').format('DD MMMM')} •</Title>
                <Title level={4}>{moment(hall.hall.event.dateTime).locale('ru').format('ddd ')} •</Title>
                <Title level={4}>{moment(hall.hall.event.dateTime).locale('ru').format('HH:mm')} •</Title>
                <Title level={4}>{hall.hall.event.hall.name}</Title>
            </Space>
            <div style={{display: "flex",  alignItems: 'center', justifyContent: 'center', margin:5}}>
                <HallGenerate numberRows={hall.hall.event.hall.numberRows}
                              numberSeatsInRow={hall.hall.event.hall.numberSeatsInRow}
                              hallOptionPrice={hall.hall.hollOptionPrice} style={{flex: 1}}/>
            </div>
        </Space>
    );
};

export default observer(Hall);