import React, {useContext, useEffect, useState} from 'react';
import ControllerComponent from "../../components/controller/ControllerComponent";
import {Button, Drawer, Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import CreatorMenu from "../../components/creator/CreatorMenu";
import {Context} from "../../index";
import MeropTable from "../../components/creator/tables/event";
import Halls from "../../components/creator/tables/halls";
import Buyers from "../../components/creator/tables/buyers";
import ControllerCreator from "../creator/controllerCreator";
import Profile from "../../components/user/profile";
import {MenuFoldOutlined, SlidersOutlined} from "@ant-design/icons";
import ParametersBar from "../../components/home/ParametersBar";
import EventList from "../../components/home/EventList";
import {useMediaQuery} from "react-responsive";

const PLANS = {
    controller: ControllerComponent,
    aboutMe: Profile,
}

const ControllerPage = () => {
    const hashValue = window.location.hash.substring(1);
    const initialSelectedPlan = PLANS[hashValue] ? hashValue : 'controller';
    const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
    const isMobile = useMediaQuery({ maxWidth: 950 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
            const hashValue = window.location.hash.substring(1);

            setSelectedPlan(PLANS[hashValue] ? hashValue : 'controller');
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

            <Layout style={{ backgroundColor: 'white', margin:'2%'}}>
                {!isMobile &&(
                <Sider width="20%" style={{backgroundColor: 'white', }} >
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

export default ControllerPage;