import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../index';
import {blockEvent, blockUser} from '../../../http/adminAPI';
import { Alert, Button, notification, Popconfirm, Table } from 'antd';
import { observer } from 'mobx-react-lite';

const EventTable = () => {
    const { event, user } = useContext(Context);
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        if (!!event.eventAdmin && event.eventAdmin[7].value === 'BLOCKED') {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [event.eventAdmin]);

    if (!event.eventAdmin) {
        return null;
    }
    const block = () => {
        blockEvent(event.eventAdmin[0].value)
            .then((response) => {
                event.setEventAdmin(null);
                return notification.success({
                    message: "Успешно",
                });
            })
            .catch((error) => {
                return notification.success({
                    message: `Ошибка блокировки`,
                    description: error
                });
            })
    };

    const columns = [
        {
            dataIndex: 'field',
            key: 'field',
            width: '30%',
            render: (text) => <strong>{text}</strong>,
        },
        {
            dataIndex: 'value',
            key: 'value',
            render: (value, record, index) => {
                if (index === 2) {
                    return (
                        <a href="#" onClick={(event) => {
                            user.setUserBroadcast(value)
                            event.preventDefault();
                            window.location.hash = "usersAdmin";
                        }}>
                            {value}
                        </a>
                    );
                }
                if (Array.isArray(value)) {
                    return (
                        <div>
                            {value.map((item, index) => (
                                <div key={index}>
                                    <strong>{item.field}:</strong> {item.value}
                                </div>
                            ))}
                        </div>
                    );
                }
                return value;
            },
        },
    ];

    return (
        <div>
            {blocked && (
                <Alert
                    message={'Внимание! Мероприятие было заблокировано'}
                    type="warning"
                    showIcon
                    style={{ maxWidth: 400 }}
                />
            )}
            <Table
                showHeader={false}
                columns={columns}
                dataSource={event.eventAdmin}
                pagination={false}
                bordered
                style={{ marginTop: 16 }}
                footer={() => (
                    <Popconfirm
                        title={blocked ? 'Разблокировать мероприятие?' : 'Заблокировать мероприятие?'}
                        description={
                            blocked
                                ? ''
                                : 'Полная блокировка аккаунта пользователя приведет к невозможности совершению им каких-либо действий на платформе'
                        }
                        okText={blocked ? 'Разблокировать' : 'Заблокировать'}
                        cancelText="Отмена"
                        onConfirm={block}
                    >
                        <Button
                            type="primary"
                            block
                            style={{ backgroundColor: blocked ? '#722ed1' : '#ff4d4f' }}
                        >
                            {blocked ? '  Разблокировать мероприятие' : 'Заблокировать мероприятие'}
                        </Button>
                    </Popconfirm>
                )}
            />
        </div>
    );
};

export default observer(EventTable);
