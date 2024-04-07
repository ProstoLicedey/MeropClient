import React, {useContext, useState} from 'react';
import {Alert, Button, Form, Input} from "antd";
import {Context} from "../../../index";
import reciveCodeService from "../../../services/userService/receiveCodeService";

const InputEmail = ({setPage, setEmail}) => {
    const [form] = Form.useForm();
    const [message, setMessage] = useState(false);
    const {user} = useContext(Context)
    const [openPas, setOpenPas] = useState(false);

    return (

        <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
                modifier: 'public',
            }}
        >

            {message && (
                <Alert type="error" message={message} showIcon />
            )}
            <Form.Item
                label="Почта"
                name="email"
                rules={[
                    {
                        message: 'почта не корректна',
                        required: true,
                        type: 'email',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" style={{width: 200, height: 40, fontSize: 18,  backgroundColor:'#722ed1'}}
                        onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    reciveCodeService(values)
                                        .then(result => {
                                            if (result === true) {
                                                console.log(true)
                                                setPage(2)
                                                setEmail(values.email)
                                            } else {
                                                console.log(result)
                                            }
                                        });

                                })
                                .catch((info) => {
                                    console.log('Failed:', info);
                                });
                        }}
                >
                 Обновить
                </Button>
            </Form.Item>

        </Form>
    );
};

export default InputEmail;