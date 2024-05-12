import React from 'react';
import Title from "antd/es/typography/Title";
import {Button, Space, Tooltip} from "antd";
import {CREATEEVENT_ROUTE} from "../../utils/consts";

const EventAdmin = () => {
    return (
        <Space direction={'horizontal'}>
        <Title level={2}>
            Мероприятия
        </Title>


    </Space>
    );
};

export default EventAdmin;