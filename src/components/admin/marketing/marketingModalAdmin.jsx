import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, InputNumber, Modal, notification, Select } from "antd";
import { Context } from "../../../index";
import {createMarketing, getEventForMarketing, marketingStatusUpdate} from "../../../http/marketingAPI";

const { Item } = Form;

const options = [
    {
        value: 'NEW',
        label: 'Новая заявка',
    },
    {
        value: 'ACCEPTED',
        label: 'Заявка принята',
    },
    {
        value: 'ACTIVE',
        label: 'Рекламируется',
    },
    {
        value: 'CANCELLED',
        label: 'Заявка отклонена',
    },
    {
        value: 'STOP',
        label: 'Реклама остановлена',
    },
];

const MarketingModalAdmin = ({ open, onCancel, mark }) => {
    const [form] = Form.useForm();
    const { user, marketing } = useContext(Context);
    const [statusChanged, setStatusChanged] = useState(false); // Состояние для отслеживания изменений статуса

    useEffect(() => {
        form.setFieldsValue({
            status: mark.status
        });
    }, [mark.status]);

    const handleEventSelect = (value) => {
        setStatusChanged(true);

        if (mark.status === form.getFieldsValue().status){
            setStatusChanged(false);
        }

    };

    return (
        <Modal
            title={"Реклама №" + mark.id}
            visible={open}
            footer={null}
            onCancel={onCancel}
        >
            <Form
                form={form}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Item
                    label="Статус"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: 'Поле не должно быть пустым',
                        },
                    ]}
                >
                    <Select
                        style={{ width: '100%' }}
                        options={options}
                        onChange={handleEventSelect}
                    />
                </Item>

                <Item style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            width: 200,
                            height: 40,
                            fontSize: 18,
                            backgroundColor: '#722ed1',
                        }}
                        disabled={!statusChanged} // Блокируем кнопку, если статус не был изменен
                        onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    marketingStatusUpdate(mark.id, values.status)
                                        .then(() => {
                                            onCancel();
                                            setStatusChanged(false)
                                            setStatusChanged(false); // Сбрасываем состояние после успешного сохранения
                                            form.resetFields();
                                            notification.success({
                                                message: 'Успешно создано',
                                            });
                                        })
                                        .catch((error) => {
                                            notification.error({
                                                message: 'Ошибка создания',
                                                description: error.message,
                                            });
                                            console.error("Error during marketing creation:", error);
                                        });
                                })
                                .catch((error) => {
                                    notification.error({
                                        message: 'Ошибка валидации формы',
                                        description: error.message,
                                    });
                                    console.error('Error during form validation:', error);
                                });
                        }}
                    >
                        Сохранить
                    </Button>
                </Item>
            </Form>
        </Modal>
    );
};

export default MarketingModalAdmin;
