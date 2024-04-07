import React, {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {HOME_ROUTE} from "../utils/consts";
import {adminRoutes, controllerRoutes, creatorRoutes, publicRoutes, userRoutes} from "../routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import ErrorPage from "../pages/ErrorPage";

const AppRouter = () => {
    const {user} = useContext(Context)
    let role
    if(user.user) {
         role = user.user.role

    return (
        <Routes>
            {adminRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={role === 'ADMIN' ? <Component/> : <Navigate to="/"/>}/>
            ))}
            {creatorRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={role == 'CREATOR' ? <Component/> : <Navigate to="/"/>}/>
            ))}
            {userRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={role === 'USER' ? <Component /> : <Navigate to="/"/>}/>
            ))}
            {controllerRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={role === 'CONTROLLER' ? <Component /> : <Navigate to="/"/>}/>
            ))}
            {publicRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={<Component/>}/>
            ))}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
    }
};

export default observer(AppRouter);