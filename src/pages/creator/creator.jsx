import React, {useContext, useEffect, useState} from 'react';
import {Button, Drawer, Layout, Space, Switch} from "antd";
import Title from "antd/es/typography/Title";
import CreatorMenu from "../../components/creator/CreatorMenu";
import MeropTable from "../../components/creator/tables/event";
import Sider from "antd/es/layout/Sider";
import ControllerCreator from "./controllerCreator";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {ReCAPTCHA} from "react-google-recaptcha";
import Profile from "../../components/user/profile";
import Halls from "../../components/creator/tables/halls";
import Buyers from "../../components/creator/tables/buyers";
import {logout} from "../../http/userAPI";
import {useMediaQuery} from "react-responsive";
import {MenuFoldOutlined} from "@ant-design/icons";


const PLANS = {
    events: MeropTable,
    zal: Halls,
    buyers: Buyers,
    controler: ControllerCreator,
    aboutMe: Profile,
}
const Creator = () => {
    const hashValue = window.location.hash.substring(1);
    const initialSelectedPlan = PLANS[hashValue] ? hashValue : 'events';
    const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
    const isMobile = useMediaQuery({ maxWidth: 950 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            {!isMobile &&(
            <Sider width="20%" style={{backgroundColor: 'white'}}>
                <CreatorMenu close={()=> setIsMenuOpen(false)}/>
            </Sider>)}

            {isMobile &&
                (<div >
                    <Button   type={"text"} style={{marginLeft:'0.5em', }} icon={<MenuFoldOutlined />} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        Меню
                    </Button>

                    <Drawer

                        title="Меню"
                        placement="left"
                        onClose={() => setIsMenuOpen(!isMenuOpen)}
                        open={isMenuOpen}
                    >
                        <CreatorMenu close={()=> setIsMenuOpen(false)}/>
                    </Drawer>
                </div>)}

            <PlanView style={{backgroundColor: 'white'}}/>
        </Layout>

    );
};

export default observer(Creator);