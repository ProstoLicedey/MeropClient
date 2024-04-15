import React, { useState } from 'react';
import {Alert, Button, Flex, Input, Segmented, Space, Tabs, Typography} from 'antd';

import { observer } from 'mobx-react-lite';

import ControllerComponent from "../../components/controller/ControllerComponent";

import MyController from "../../components/creator/Controller/MyController";

const { Title } = Typography;

const ControllerCreator = () => {
    const [option, setOption] = useState('Проверка билетов');
    return (
            <Flex justify={"center"} vertical style={{margin:'1%',  width: '100%'}}>
                <Tabs
                    defaultActiveKey="1"
                    onChange={(key) => {
                        setOption(key);
                    }}
                    size={"large"}
                    style={{
                        width: '100%'
                    }}
                >
                    <Tabs.TabPane tab="Проверка билетов" key="1">
                        <ControllerComponent />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Мои контроллеры" key="2">
                        <MyController />
                    </Tabs.TabPane>
                </Tabs>

            </Flex>
    );
};

export default observer(ControllerCreator);