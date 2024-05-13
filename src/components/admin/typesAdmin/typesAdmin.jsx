import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, List, notification, Popconfirm, Space} from "antd";
import Title from "antd/es/typography/Title";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

import {deleteEvent, fetchTypes} from "../../../http/eventAPI";
import {observer} from "mobx-react-lite";
import {deleteType} from "../../../http/adminAPI";
import {Context} from "../../../index";
import TypesModal from "./typesModal";

const TypesAdmin = () => {
    const  {event} = useContext(Context)
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(1)

    useEffect(() => {
        fetchTypes().then(data => event.setTypes(data))
    }, [open, update]);

    const daleteType = (id) => {
        deleteType(id)
            .then(() => {
                setUpdate(update + 1)
                return notification.success({
                    message: 'Успешно удалено',
                })

            })
            .catch(error => {
                return notification.error({
                    message: 'Ошибка',
                    description: error,
                })
            });
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2}>
                Типы меропрятий
            </Title>
            <Button style={{ backgroundColor: '#722ed1' }} type="primary" onClick={()=> setOpen(true)}>
                Добавить тип <PlusCircleOutlined />
            </Button>
            <List
                style={{ width: '100%' }}
                size="large"
                bordered
                dataSource={event.types}
                renderItem={(item) => (
                    <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {item.label}
                        <Popconfirm
                            style={{ marginLeft: "1" }}
                            title="Вы уверены, что хотите удалить тип? Все мероприятия с этим типом также будут удалены"
                            onConfirm={() => daleteType(item.value)}
                            okText="Да"
                            cancelText="Отмена">
                            <Button danger>Удалить</Button>
                        </Popconfirm>
                    </List.Item>
                )}
            />

            <TypesModal
                open={open}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </Space>
    );
};

export default observer(TypesAdmin);