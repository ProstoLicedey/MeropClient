import React, {useContext, useEffect, useState} from 'react';
import {Context} from '../../../index';
import {Form, InputNumber, Modal, Select, Button, Alert, notification} from 'antd';
import {observer} from 'mobx-react-lite';
import {createMarketing, getEventForMarketing} from '../../../http/marketingAPI';

const {Item} = Form;

const MarketingModal = ({open, onCancel}) => {
    const [form] = Form.useForm();
    const {user, marketing} = useContext(Context);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        if (!!user.user) {
            getEventForMarketing(user.user.id)
                .then((response) => marketing.setEvents(response));
        }
    }, [open]);

    const handleEventSelect = (value) => {
        const event = marketing.events.find((event) => event.value === value);
        setSelectedEvent(event);
    };

    return (
        <Modal
            title="Заявка на рекламу"
            visible={open}
            footer={null}
            onCancel={onCancel}
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                autoComplete="off"
            >
                <Item
                    label="Мероприятие"
                    name="eventId"
                    rules={[
                        {
                            required: true,
                            message: 'Поле не должно быть пустым',
                        },
                    ]}
                >
                    <Select
                        placeholder="Поиск мероприятия"
                        showSearch
                        style={{width: '100%'}}
                        options={marketing.events}
                        notFoundContent={<p>Мероприятий не найдено</p>}
                        onChange={handleEventSelect}
                    />
                </Item>

                {selectedEvent && (
                    <Item
                        label="Количество дней рекламирования"
                        name="numberDays"
                        rules={[
                            {
                                required: true,
                                message: 'Поле не должно быть пустым',
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={selectedEvent.daysLeft}
                            style={{width: '100%'}}
                        />
                    </Item>
                )}

                <Item style={{textAlign: 'center'}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            width: 200,
                            height: 40,
                            fontSize: 18,
                            backgroundColor: '#722ed1',
                        }}
                        onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    createMarketing(values)
                                        .then(() => {
                                            onCancel();
                                            setSelectedEvent(null)
                                            form.resetFields()
                                            notification.success({
                                                message: 'Успешно создано',
                                            });
                                        })
                                        .catch((error) => {
                                            notification.error({
                                                message: 'Ошибка создания',
                                                description: error.message, // Исправил error на error.message
                                            });
                                            console.error("Error during marketing creation:", error);
                                        });
                                })
                                .catch((error) => {
                                    notification.error({
                                        message: 'Ошибка валидации формы',
                                        description: error.message, // Исправил error на error.message
                                    });
                                    console.error('Error during form validation:', error);
                                });
                        }}

                    >
                        Создать
                    </Button>
                </Item>
            </Form>
        </Modal>
    );
};

export default observer(MarketingModal);
