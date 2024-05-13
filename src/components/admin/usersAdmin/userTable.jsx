import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, notification, Popconfirm, Table} from "antd";
import { Context } from "../../../index";
import { observer } from "mobx-react-lite";
import {blockUser, deleteTicketAdmin} from "../../../http/adminAPI";

const UserTable = () => {
    const { user } = useContext(Context);
    const [blocked, setBlocked] = useState(false)


    useEffect(() => {

        if (!!user.userAdmin && user.userAdmin[1].value.startsWith('BLOCKED')) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [user.userAdmin]);

    if (!user.userAdmin) {
        return null;
    }
    const block = () => {

        blockUser(user.userAdmin[0].value)
            .then((response) => {
                user.setUserAdmin(null);
                return notification.success({
                    message: `Пользователь успешно заблокирован`,

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
            width: '40%',
            render: (text) => <strong>{text}</strong>,
        },
        {
            dataIndex: 'value',
            key: 'value',
            render: (value, record) => {
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
            }
        },
    ];

    return (
        <div>
            {blocked && (<Alert message={"Внимание! Пользователь был заблокирован"} type="warning" showIcon style={{maxWidth:400}} />) }
        <Table
            showHeader={false}
            columns={columns}
            dataSource={user.userAdmin}
            pagination={false}
            bordered
            style={{ marginTop: 16 }}
            footer={() => (
                <Popconfirm
                    title= {blocked ?"Разблокировать пользователя?" :"Заблокировать пользователя?"}
                    description=  {blocked ? "" : "Полная блокировка аккаунта пользователя приведет к невозможности совершению им каких-либо действий на платформе"}
                    okText= {blocked ?"Разблокировать" :"Заблокировать" }
                    cancelText="Отмена"
                    onConfirm={block}
                >
                    <Button
                        type="primary"
                        block
                        style={{ backgroundColor: blocked ?  '#722ed1':  '#ff4d4f'}}
                    >
                        {blocked ?"  Разблокировать аккаунт" : "Заблокировать аккаунт"}
                    </Button>

                </Popconfirm>
            )}

        />
        </div>
    );
};

export default observer(UserTable);
