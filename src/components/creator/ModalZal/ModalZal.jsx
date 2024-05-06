import React, {useContext, useEffect, useState} from 'react';
import {Flex, Modal, Segmented, Space} from "antd";
import RegLogForm from "../../auth/regLogForm";
import UpdatePasswordModal from "../../auth/updatePassword/updatePasswordModal";
import CreateEntrance from "./createEntrance";
import CreateZal from "./createZal";
import Title from "antd/es/typography/Title";
import {getUpdate} from "../../../http/hallAPI";
import {Context} from "../../../index";

const ModalZal = ({open, onCancel, id, type}) => {

    const [option, setOption] = useState('Входные билеты');
    const {hall} = useContext(Context)

    useEffect(() => {
        if(id && type) {
            setOption(type === 'Зрительный зал' ? 'Зрительный зал' : 'Входные билеты');
            getUpdate(id, type).then(data => {
                hall.setHallUpdate(data)
                hall.setCity([{label: data.city.name, value: data.city.ideficator}])

            })
        }
    }, [type, id]);

    useEffect(() => {
        if(!id && !type) {
            hall.setHallUpdate({})
        }
    }, [open]);

    return (

        <Modal
            title={!!id ? "Редактирование схемы продажи" : 'Схема продажи'}
            open={open}
            footer={null}
            onCancel={() => {
                onCancel();
            }}
            maskClosable={false} // Запрещаем закрытие при клике вне модального окна
        >
            <Flex justify={"center"} vertical>
                <Segmented
                    options={['Входные билеты', 'Зрительный зал',]}
                    hidden={!!id}
                    onChange={(value) => {
                        setOption(value)
                    }}
                    style={{maxWidth: 255}}
                />

                {option == 'Входные билеты' ?
                    (<CreateEntrance Close={() => onCancel()}/>)
                    :
                    (<CreateZal Close={() => onCancel()}/>)
                }

            </Flex>
        </Modal>
    );
};

export default ModalZal;