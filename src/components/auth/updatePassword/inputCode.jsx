import React, { useContext, useState } from 'react';
import { Alert, Button, Form, Input } from "antd";
import { Context } from "../../../index";
import reciveCodeService from "../../../services/userService/receiveCodeService";
import inputCodeService from "../../../services/userService/inputCodeService";

const InputCode = ({ setPage, email }) => {
    const [form] = Form.useForm();
    const [message, setMessage] = useState(null);
    const { user } = useContext(Context);
    const [openPas, setOpenPas] = useState(false);

    const onFinish = (values) => {
        inputCodeService(email, values.code)
            .then(result => {
                if (result === true) {
                    setPage(3);
                } else {
                    setMessage('Код не верен');
                }
            })
            .catch(() => {
                setMessage('Ошибка при проверке кода');
            });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            onFinish={onFinish}
        >
            <h2 style={{ textAlign: 'center' }}>Введите код из письма</h2>
            {message && (
                <Alert type="error" message={message} showIcon />
            )}
            <Form.Item
                style={{ textAlign: 'center', padding: 30 }}
                name="code"
                rules={[
                    {
                        required: true,
                        message: 'Код должен содержать 6 цифр',
                        pattern: /^\d{6}$/,
                    },
                ]}
            >
                <Input.OTP
                    size="large"
                    maxLength={6}
                    style={{ width: '100%' }}
                    placeholder="Введите 6-значный код"

                />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" style={{ width: 200, height: 40, fontSize: 18, backgroundColor: '#722ed1' }}>
                    Ввод
                </Button>
            </Form.Item>
        </Form>
    );
};

export default InputCode;
