import React, {useContext, useMemo, useRef, useState} from 'react';
import Title from "antd/es/typography/Title";
import {Alert, Button, Input, Select, Space, Spin, Tooltip} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {Context} from "../../../index";
import Search from "antd/es/input/Search";
import {getEventAdmin, searchEventAdmin} from "../../../http/adminAPI";
import {observer} from "mobx-react-lite";
import EventTable from "./eventTable";

const EventAdmin = () => {
    // const [input, setInput] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [fetching, setFetching] = useState(false);
    const {event} = useContext(Context);

    const poiskEvent = (value) => {

        if(!value){
            setMessage('Мероприятие не выбрано');
            return
        }
        setStatus('');
        setMessage('');

        getEventAdmin(value)
            .then((response) => {
                event.setEventAdmin(response);
                console.log(event.eventAdmin)
            })
            .catch((error) => {
                console.error('Error fetching ticket:', error);
                setMessage("Внутреняя ошибка");
            })
    };


    const handleChange = (value) => {

        setFetching(true);
        setStatus('');
        setMessage('');

        searchEventAdmin(value)
            .then((response) => {
                event.setEventList(response);
                console.log(event.eventList)
            })
            .catch((error) => {
                console.error('Error fetching ticket:', error);
                setMessage("Внутреняя ошибка");
            })
            .finally(() => setFetching(false));
    };


    return (
        <Space direction="vertical" size="small" style={{width: '100%'}}>
            <Title level={2}>
                Мероприятия
            </Title>
            {!!message.length && <Alert message={message} type="error"/>}
            <Space>
                <Select

                    placeholder={"Поиск мероприятия"}
                    showSearch
                    style={{

                        minWidth: '280px'
                    }}
                    filterOption={false}
                    onSearch={handleChange}
                    options={event.eventList}
                    notFoundContent={fetching ? <Spin size="small"/> : <p>Мероприятий не найдено</p>}
                    onChange={poiskEvent}
                />

            </Space>
            <EventTable/>
        </Space>
    );
};

export default observer(EventAdmin);