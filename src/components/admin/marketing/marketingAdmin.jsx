import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, Button, Empty, Input, notification, Popconfirm, Popover, Space, Table, Tooltip} from "antd";
import Title from "antd/es/typography/Title";
import Carouselcontroller from "../../controller/Carouselcontroller";
import CheckCardController from "../../controller/CheckCardController";
import Link from "antd/es/typography/Link";
import MarketingModal from "../../creator/ModalZal/marketingModal";
import {Context} from "../../../index";
import {deleteMarketing, getMerketingAdmin, getMerketingCreator} from "../../../http/marketingAPI";
import {SearchOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import MarketingModalAdmin from "./marketingModalAdmin";

const MarketingAdmin = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [update, setUpdate] = useState(1)
    const {user,  marketing} = useContext(Context);
    const [modal, setModal] = useState(false);
    const [mark, setMark] = useState({});

    useEffect(() => {

            getMerketingAdmin()
                .then(data => marketing.setMarketingController(data))
                .catch((e) => console.log(e))


    }, [, modal, update]);


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{

                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Введите ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Найти
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Сброс
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },


    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            sorter: (a, b) => a.id.length - b.id.length,
        },
        {
            title: 'Мероприятие',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('event'),
        },
        {
            title: 'Создатель',
            dataIndex: 'email',
            key: 'email',
            width: '25%',
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('event'),
        },
        {
            title: 'Количество дней рекламы',
            dataIndex: 'numberDays',
            key: 'numberDays',
            width: '5%',
            sorter: (a, b) => a.numberDays.length - b.numberDays.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Даты',
            dataIndex: 'date',
            key: 'date',
            width: '20%',

            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            sorter: (a, b) => a.status.length - b.status.length,
            sortDirections: ['descend', 'ascend'],
            render: (status, record, index) => {
                let alertMessage = '';
                let alertType = '';
                let popoverTitle = '';
                let popoverContent = '';

                switch (status) {
                    case 'NEW':
                        alertMessage = 'Новая заявка';
                        alertType = 'success';
                        popoverTitle = 'Заявка создана'
                        popoverContent = 'В течении 1 рабочего дня с вами свяжется администратор, для оплаты'
                        break;
                    case 'ACCEPTED':
                        alertMessage = 'Заявка принята';
                        alertType = 'info';
                        popoverTitle = 'Заявка на рекламу принята'
                        popoverContent = `Заявка получена нами, вам была отправлена информация об оплате, если это не произошло пожалуйста свяжитесь с нами по почте ${process.env.REACT_APP_EMAIL}`
                        break;
                    case 'ACTIVE':
                        alertMessage = 'Рекламируется';
                        alertType = 'success';
                        popoverTitle = 'Ваше мероприятие продвигается'
                        break;
                    case 'CANCELLED':
                        alertMessage = 'Заявка отклонена';
                        alertType = 'error';

                        popoverTitle = 'Заявка была отклонена администратором'
                        popoverContent = `Скорее всего вы не ответили на наше письмо, если хотите возобновить заявку напишите нам на почту ${process.env.REACT_APP_EMAIL}`

                        break;
                    case 'COMPLETED':
                        alertMessage = 'Реклама завершена';
                        alertType = 'info';
                        popoverTitle = 'Рекламирование мероприятия успешно завершено'

                        break;
                    case 'STOP':
                        alertMessage = 'Реклама остановлена';
                        alertType = 'error';
                        popoverTitle = 'Заявка была остановлена администратором'
                        popoverContent = `Для уточнения причин остановки рекламы напишите нам на почту ${process.env.REACT_APP_EMAIL}`

                        break;
                    default:
                        alertMessage = '';
                        alertType = 'info';
                        break;
                }

                return (
                    <Popover content={popoverContent} title={popoverTitle}>
                        <Alert message={alertMessage} type={alertType} showIcon/>
                    </Popover>
                );
            },

        },
        // {
        //     width: '15%',
        //
        //     key: 'actions',
        //     render: (record) => {
        //         return (
        //                 <Button style={{ borderColor: '#722ed1', color: '#722ed1' }}>Открыть</Button>
        //         )
        //     }
        // }
    ];

    const handleRowClick = (record) => {
        if(record.status === 'COMPLETED'){
            return notification.error({
                message: 'Реклама уже завершена',
                description: 'Изменить статус нельзя, так-как реклама уже завершена',
                className: 'custom-class',
            })
        }
        setMark(record);
        setModal(true);
    };

    return (
        <Space  direction="vertical"  style={{textAlign: 'left', backgroundColor: 'white', marginLeft: "1%",  width: '100%'}}>
            <Title level={2}>
                Реклама
            </Title>


            <Table
                bordered
                style={{ overflowX: 'auto', cursor:'pointer' }}
                columns={columns}
                dataSource={marketing.marketingController}
                responsive={{ xs: true, sm: true, md: true, lg: true, xl: true, xxl: true }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record), // Вызываем функцию при клике на строку
                })}
            />


            <MarketingModalAdmin open={modal}
                            onCancel={() => {
                                setModal(false);
                            }}
                                 mark = {mark}
            />
        </Space>
    );
};
export default observer(MarketingAdmin);