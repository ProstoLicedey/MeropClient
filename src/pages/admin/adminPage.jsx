import React, {useContext, useEffect, useState} from 'react';
import ControllerComponent from "../../components/controller/ControllerComponent";
import Profile from "../../components/user/profile";
import {useMediaQuery} from "react-responsive";
import {Button, Drawer, Form, Layout} from "antd";
import CreatorMenu from "../../components/creator/CreatorMenu";
import Sider from "antd/es/layout/Sider";
import {MenuFoldOutlined} from "@ant-design/icons";
import UsersAdmin from "../../components/admin/usersAdmin/usersAdmin";
import RefundsAdmin from "../../components/admin/refundsAdmin/refundsAdmin";
import EventAdmin from "../../components/admin/eventAdmin/eventAdmin";
import TypesAdmin from "../../components/admin/typesAdmin/typesAdmin";
import MarketingAdmin from "../../components/admin/marketing/marketingAdmin";

const PLANS = {
    eventAdmin: EventAdmin,
    usersAdmin: UsersAdmin,
    refunds: RefundsAdmin,
    marketing: MarketingAdmin,
    typeEvent: TypesAdmin,
}

const AdminPage = () => {
    const hashValue = window.location.hash.substring(1);
    const initialSelectedPlan = PLANS[hashValue] ? hashValue : 'eventAdmin';
    const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
    const isMobile = useMediaQuery({ maxWidth: 950 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);



    useEffect(() => {
        const handleHashChange = () => {
            const hashValue = window.location.hash.substring(1);

            setSelectedPlan(PLANS[hashValue] ? hashValue : 'eventAdmin');
        };

        // Подписываемся на событие изменения hash при монтировании компонента
        window.addEventListener('hashchange', handleHashChange);


        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);


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

export default AdminPage;