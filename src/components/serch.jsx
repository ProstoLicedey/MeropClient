import React, {useContext, useEffect, useState} from 'react';
import Search from "antd/es/input/Search";
import {Context} from "../index";
import {fetchEvent, fetchOneEvent, fetchTypes} from "../http/eventAPI";
import {EVENT_ROUTE, HOME_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {theme} from "antd";

const SerchInput = ({style}) => {
    const [value, setValue] = useState('')
    const {event} = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        fetchTypes().then(data => event.setTypes(data))
        fetchEvent(null, 1, null, null).then(data => {
            event.setEvents(data.rows)
            event.setTotalCount(data.count)
        })
    }, []);


    useEffect(() => {
        setTimeout(() => {
            event.setSerchTitle(value)
        }, 1000);
    }, [value]);
    useEffect(() => {
        if (event.serchTitle === null || event.serchTitle === {} || event.serchTitle === undefined) {
            setValue("")
        }
    }, [event.serchTitle]);


    return (
        <Search
            placeholder="Найти мероприятие"
            onSearch={() => navigate(HOME_ROUTE)}
            style={style}
            value={value}
            onChange={(event) => setValue(event.target.value)}
        />
    );
};

export default observer(SerchInput);
