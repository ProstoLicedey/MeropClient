import React, {useContext, useEffect, useState} from 'react';
import ControllerComponent from "../../components/controller/ControllerComponent";
import {Button, Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import CreatorMenu from "../../components/creator/CreatorMenu";
import {Context} from "../../index";
import MeropTable from "../../components/creator/tables/event";
import Halls from "../../components/creator/tables/halls";
import Buyers from "../../components/creator/tables/buyers";
import ControllerCreator from "../creator/controllerCreator";
import Profile from "../../components/user/profile";

const PLANS = {
    controller: ControllerComponent,
    aboutMe: Profile,
}

const ControllerPage = () => {
    const hashValue = window.location.hash.substring(1);
    const initialSelectedPlan = PLANS[hashValue] ? hashValue : 'events';
    const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
    const {user} = useContext(Context)
    useEffect(() => {
        const handleHashChange = () => {
            const hashValue = window.location.hash.substring(1);

            setSelectedPlan(PLANS[hashValue] ? hashValue : 'events');
        };

        // Подписываемся на событие изменения hash при монтировании компонента
        window.addEventListener('hashchange', handleHashChange);

        // Убираем подписку при размонтировании компонента
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []); // Пустой массив зависимостей, чтобы хук useEffect выполнился только при монтировании


    const PlanView = PLANS[selectedPlan];
    return (

            <Layout style={{width: '90%', backgroundColor: 'white'}}>
                <Sider width="20%" style={{backgroundColor: 'white'}}>
                    <CreatorMenu/>
                </Sider>
                <PlanView style={{backgroundColor: 'white'}}/>

            </Layout>
    );
};

export default ControllerPage;