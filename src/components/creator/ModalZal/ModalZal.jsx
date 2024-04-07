import React, {useState} from 'react';
import {Flex, Modal, Segmented, Space} from "antd";
import RegLogForm from "../../auth/regLogForm";
import UpdatePasswordModal from "../../auth/updatePassword/updatePasswordModal";
import CreateEntrance from "./createEntrance";
import CreateZal from "./createZal";
import Title from "antd/es/typography/Title";

const ModalZal = ({open, onCancel}) => {
    const [option, setOption] = useState('Входные билеты');
    return (

        <Modal
            title={'Схема продажи'}
            open={open}
            footer={null}
            onCancel={() => {
                onCancel();
            }}
        >
            <Flex justify={"center"} vertical>
                <Segmented
                    options={['Входные билеты', 'Зрительный зал',]}

                    onChange={(value) => {
                        setOption(value)
                    }}
                    style={{maxWidth:255}}
                />

                {option == 'Входные билеты'?
                    (<CreateEntrance Close={() => onCancel()}/>)
                    :
                    (<CreateZal/>)
                }

            </Flex>
        </Modal>
    );
};

export default ModalZal;