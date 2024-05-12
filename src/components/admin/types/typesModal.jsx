import React from 'react';
import {Alert, Button, Flex, Form, Input, Modal, notification} from "antd";
import RegLogForm from "../../auth/regLogForm";
import UpdatePasswordModal from "../../auth/updatePassword/updatePasswordModal";
import reciveCodeService from "../../../services/userService/receiveCodeService";
import {createType} from "../../../http/adminAPI";

const TypesModal = ({open, onCancel}) => {
    const [form] = Form.useForm();

    return (
        <Modal
            open={open}
            title={"Добавить тип мероприятия"}
            footer={null}
            onCancel={() => {
                onCancel();
            }}

        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >


                <Form.Item
                    label="Название типа"
                    name="type"
                    rules={[
                        {
                            message: '',
                            required: true,
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
                                        createType(values.type)
                                            .then(result => {
                                                onCancel();
                                                values.name = ''
                                                return notification.success({
                                                    message: 'Удалено',
                                                    description: `Тип ${result} успешно добавлен`,
                                                    style: {
                                                        width: 600
                                                    }
                                                });
                                            });

                                    })
                                    .catch((info) => {
                                            return notification.error({
                                                message: 'Ошибка',
                                                description: `info`,
                                                style: {
                                                    width: 600
                                                }
                                            });
                                    });
                            }}
                    >
                       Добавить
                    </Button>
                </Form.Item>
                <Input

                    size="large"
                    placeholder="Номер билета"
                    maxLength={7}
                    type="email"

                />
            </Form>
        </Modal>
    );
};

export default TypesModal;