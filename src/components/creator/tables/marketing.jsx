import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Button,
    ConfigProvider,
    Empty,
    Input,
    notification,
    Popconfirm,
    Popover,
    Space,
    Table,
    Tooltip,
    Tour
} from "antd";
import Title from "antd/es/typography/Title";
import {QuestionOutlined, SearchOutlined} from "@ant-design/icons";
import { Context } from "../../../index";
import Link from "antd/es/typography/Link";
import { deleteMarketing, getMerketingCreator } from "../../../http/marketingAPI";
import { observer } from "mobx-react-lite";
import MarketingModal from "../ModalZal/marketingModal";
import ruRU from "antd/es/locale/ru_RU";

const Marketing = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [update, setUpdate] = useState(1);
    const { user, marketing } = useContext(Context);
    const [modal, setModal] = useState(false);
    const [open, setOpen] = useState(false);

    const ref1 = useRef(null);

    useEffect(() => {
        if (user.user) {
            getMerketingCreator(user.user.id)
                .then(data => marketing.setMarketingController(data))
                .catch((e) => console.error(e));
        }
    }, [user.user, modal, update]);

    const deleteItem = (id) => {
        deleteMarketing(id)
            .then(() => {
                setUpdate(update + 1);
                notification.success({ message: 'Успешно удалено' });
            })
            .catch(error => {
                notification.error({ message: 'Ошибка', description: error.message });
            });
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Введите ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Найти
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Сброс
                    </Button>
                    <Button type="link" size="small" onClick={close}>
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
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

    const renderStatusColumn = (status) => {
        let alertMessage = '';
        let alertType = '';
        let popoverTitle = '';
        let popoverContent = '';

        switch (status) {
            case 'NEW':
                alertMessage = 'Новая заявка';
                alertType = 'success';
                popoverTitle = 'Заявка создана';
                popoverContent = 'В течении 1 рабочего дня с вами свяжется администратор, для оплаты';
                break;
            case 'ACCEPTED':
                alertMessage = 'Заявка принята';
                alertType = 'info';
                popoverTitle = 'Заявка на рекламу принята';
                popoverContent = `Заявка получена нами, вам была отправлена информация об оплате. Если это не произошло, пожалуйста, свяжитесь с нами по почте ${process.env.REACT_APP_EMAIL}`;
                break;
            case 'ACTIVE':
                alertMessage = 'Рекламируется';
                alertType = 'success';
                popoverTitle = 'Ваше мероприятие продвигается';
                break;
            case 'CANCELLED':
                alertMessage = 'Заявка отклонена';
                alertType = 'error';
                popoverTitle = 'Заявка была отклонена администратором';
                popoverContent = `Скорее всего вы не ответили на наше письмо. Если хотите возобновить заявку, напишите нам на почту ${process.env.REACT_APP_EMAIL}`;
                break;
            case 'COMPLETED':
                alertMessage = 'Реклама завершена';
                alertType = 'info';
                popoverTitle = 'Рекламирование мероприятия успешно завершено';
                break;
            case 'STOP':
                alertMessage = 'Реклама остановлена';
                alertType = 'error';
                popoverTitle = 'Заявка была остановлена администратором';
                popoverContent = `Для уточнения причин остановки рекламы напишите нам на почту ${process.env.REACT_APP_EMAIL}`;
                break;
            default:
                alertMessage = '';
                alertType = 'info';
                break;
        }

        return (
            <Popover content={popoverContent} title={popoverTitle}>
                <Alert message={alertMessage} type={alertType} showIcon />
            </Popover>
        );
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Мероприятие',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Количество дней рекламы',
            dataIndex: 'numberDays',
            key: 'numberDays',
            width: '5%',
            sorter: (a, b) => a.numberDays - b.numberDays,
        },
        {
            title: 'Даты',
            dataIndex: 'date',
            key: 'date',
            width: '20%',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            sorter: (a, b) => a.status.length - b.status.length,
            render: renderStatusColumn,
        },
        {
            title: 'Действия',
            key: 'actions',
            width: '15%',
            render: (record) => (
                <Space size="large" direction="vertical">
                    <Popconfirm
                        title="Вы уверены, что хотите отменить заявку на рекламу?"
                        onConfirm={() => deleteItem(record.id)}
                        okText="Удалить"
                        cancelText="Отмена"
                    >
                        <Tooltip title={record.status !== 'NEW' ? 'Удалить можно только новые мероприятия' : ''}>
                            <Button danger disabled={record.status !== 'NEW'}>Удалить</Button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const steps = [
        {
            title: 'Реклама',
            description: 'Если вы хотите чтобы ваше мероприятие чаще выдели покупатели оформите заявку на рекламу',


        },
        {
            title: 'Реклама',
            description: 'Стоимость рекламы 5₽ день',

        },
        {
            title: 'Реклама',
            description: 'Для создания заявки на рекламу нажмите на кнопку "Новая реклама +"',
            target: () => ref1.current,
        },
        {
            title: 'Реклама',
            description: 'В течение 1 рабочего дня с вами свяжется наш администратор по почте для оплаты',
        },
        {
            title: 'Реклама',
            description: 'После оплаты ваше мероприятие будет появляться 1 в поиске',
        },
    ];

    return (
        <Space direction="vertical" style={{ textAlign: 'left', backgroundColor: 'white', marginLeft: "1%", marginTop: "1%", width: '100%' }}>
           <Space>
               <Title level={2}>Реклама</Title>
               <Button style={{marginBottom: 10}} shape="circle" size={"small"} onClick={() => setOpen(true)}
                          icon={<QuestionOutlined/>}/>
           </Space>

            <Button ref={ref1} type="primary" style={{ backgroundColor: '#722ed1' }} onClick={() => setModal(true)}>
                Новая реклама +
            </Button>

            {marketing.marketingController.length > 0 ? (
                <Table
                    bordered
                    style={{ overflowX: 'auto' }}
                    columns={columns}
                    dataSource={marketing.marketingController}
                    responsive={{ xs: true, sm: true, md: true, lg: true, xl: true, xxl: true }}
                />
            ) : (
                <Empty description={<span>У вас пока нет рекламы</span>}>
                    <Link target="_blank" onClick={() => setModal(true)}>Создать</Link>
                </Empty>
            )}

            <MarketingModal
                open={modal}
                onCancel={() => setModal(false)}
            />
            <ConfigProvider locale={ruRU}>
            <Tour
                open={open}
                onClose={() => setOpen(false)}
                steps={steps}

            />;
            </ConfigProvider>
        </Space>
    );
};

export default observer(Marketing);
