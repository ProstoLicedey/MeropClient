import {Layout, notification, Spin, theme} from 'antd';
import AppRouter from "./components/AppRouter";
import 'antd/dist/reset.css';
import HeaderPage from "./components/header/Header";
import FooterPage from "./components/footer/Footer";
import {BrowserRouter} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import checkAuthService from "./services/checkAuthService";
import ErrorBoundary from "./components/Error";

const {Header, Content, Footer} = Layout;


const App = observer (() =>  {
    const {user}  = useContext(Context)
    const [loading, setLoading] = useState(true)
    const {
        token: {colorBgContainer},
    } = theme.useToken();


    useEffect(() => {

        if(localStorage.getItem('token')){
            checkAuthService(user).then(()=> setLoading(false))
        }
    }, []);

    if (loading){
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        )
    }
    return (
        <ErrorBoundary>
        <BrowserRouter>

            <Layout className="layout" style={{minHeight: '100vh'}}>
                <HeaderPage/>
                <Content className="site-layout-content"
                         style={{ margin: '3vh', marginBottom:0, background: colorBgContainer}}>
                    <AppRouter />
                </Content>
                <div>
                    <FooterPage/>
                </div>
            </Layout>
        </BrowserRouter>
        </ErrorBoundary>
    );
})

export default App;
