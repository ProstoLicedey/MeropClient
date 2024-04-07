import React, {useContext, useState} from 'react';
import {Alert, Button, Form, Input} from "antd";
import {Context} from "../../../index";
import UpdatePassword from "../../../services/userService/updatePass";

const InputNewPass = ({setPage, email}) => {
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
            <h2 style={{textAlign: 'center'}} >Придумайте новый пароль</h2>
            {message && (
                <Alert type="error" message={message} showIcon />
            )}
            <Form.Item

                label="Пароль"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'введите пароль',
                    },
                ]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item
                label="Повторите пароль"
                name="password2"
                dependencies={['password']}
                rules={[
                    {
                        required: true,
                        message: 'Пароли должны совпадать',
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароли должны совпадать'));
                        },
                    }),
                ]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" style={{width: 200, height: 40, fontSize: 18,  backgroundColor:'#722ed1'}}
                        onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    UpdatePassword(email, values.password)
                                        .then(result => {
                                            if (result === true) {
                                                console.log(true)
                                                setPage(4)

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

export default InputNewPass;