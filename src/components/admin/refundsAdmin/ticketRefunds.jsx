import React, {useContext, useEffect} from 'react';
import {Alert, Button, Card, Flex, notification, Popconfirm, Space, Table, Typography} from "antd";
import Title from "antd/es/typography/Title";
import {Context} from "../../../index";
import {CheckedHttp} from "../../../http/ticketAPI";
import {observer} from "mobx-react-lite";
import checkAuthService from "../../../services/checkAuthService";
import {deleteTicketAdmin, getTicketAdmin} from "../../../http/adminAPI";
const { Text, Link } = Typography;
const TicketRefunds = () => {
    const { ticket, user } = useContext(Context);
    if (!ticket.refundsTicket) {
        return null;
    }

    const columns = [
        {
            title: `Билет № ${ticket.refundsTicket.number}`,
            dataIndex: 'field',
            key: 'field',
            width: '15%',
        },
        {

            dataIndex: 'value',
            key: 'value',
        },
    ];

    const deleteTicket = (number) => {

        deleteTicketAdmin(number)
            .then((response) => {
                ticket.setRefundsTicket(null);
                return notification.success({
                    message: `Билет № ${number} удачно удален`,

                });
            })
            .catch((error) => {
                return notification.success({
                    message: `Ошибка удаления`,
                    description: error

                });
            })
    };


    return (

        <Table
            columns={columns}
            dataSource={ticket.refundsTicket.data}
            pagination={false}
            bordered
            style={{ marginTop: 16 }}
            footer={() => <Popconfirm
                title="Вернуть билет?"
                description=" Билет будет удален навечно, это действие нельзя будет отменить!"
                onConfirm={() =>deleteTicket(ticket.refundsTicket.number)}
                okText="Вернуть"
                cancelText="Отмена"
            >
                <Button type="primary" danger block>Вернуть билет</Button>
            </Popconfirm>}
        />

    );
};

export default observer(TicketRefunds);