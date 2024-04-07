import React, {useContext, useState} from 'react';
import {Alert, Button, Form, Input, InputNumber, Tooltip, Typography} from "antd";
import {Context} from "../../../index";
import reciveCodeService from "../../../services/userService/receiveCodeService";
import inputCodeService from "../../../services/userService/inputCodeService";



const InputCode = ({setPage, email}) => {
    const [form] = Form.useForm();
    const [message, setMessage] = useState();
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
            <h2 style={{textAlign: 'center'}} >Введите код из пиьма</h2>
            {message && (
                <Alert type="error" message={message} showIcon />
            )}
            <Form.Item
                style={{textAlign: 'center', padding: 30}}
                name="code"
                rules={[
                    {
                        type:"number",
                        min:100000,
                        required: true,
                        message: 'Код должен содержать 6 символов',

                    },
                ]}
            >
                <InputNumber size="large"  maxLength="6" min="0" style={{ width:120,  fontSize:24, textAlign:"center"}}/>
            </Form.Item>

            <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" style={{width: 200, height: 40, fontSize: 18,  backgroundColor:'#722ed1'}}
                        onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    inputCodeService(email,values.code)
                                        .then(result => {
                                            if (result === true) {
                                                console.log(true)
                                                setPage(3)

                                            } else {
                                                setMessage('Код не верен')
                                            }
                                        });

                                })
                                .catch((info) => {
                                    console.log('Failed:', info);
                                });
                        }}
                >
                    Ввод
                </Button>
            </Form.Item>

        </Form>
    );
};

export default InputCode;