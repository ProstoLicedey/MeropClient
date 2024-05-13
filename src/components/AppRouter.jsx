import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HOME_ROUTE } from '../utils/consts';
import { adminRoutes, controllerRoutes, creatorRoutes, publicRoutes, registrationRoutes, userRoutes } from '../routes';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import ErrorPage from '../pages/ErrorPage';
import checkAuthService from '../services/checkAuthService';
import {Spin} from "antd";

const AppRouter = () => {
    const { user } = useContext(Context);
    const { role } = user.user;
    const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки данных

    useEffect(() => {
        if (user.user && localStorage.getItem('token')) {
            // Вызов функции проверки авторизации
            checkAuthService(user)
                .then(() => setLoading(false)) // Установка loading в false после получения ответа
                .catch(error => {
                    setLoading(false); // Установка loading в false в случае ошибки
                    console.error('Ошибка при проверке авторизации:', error);
                });
        } else {
            setLoading(false); // Если пользователь не авторизован, установка loading в false
        }
    }, [user]);

    // Если данные еще загружаются, отображается загрузочный экран или индикатор
    if (loading) {
        return <Spin tip="Loading" size="large"/>

    }

    // После загрузки данных, отображаются маршруты
    return (
        <Routes>
            {registrationRoutes.map(({ path, Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        role === 'ADMIN' || role === 'CREATOR' || role === 'USER' || role === 'CONTROLLER' ? (
                            <Component />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            ))}
            {adminRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={role === 'ADMIN' ? <Component /> : <Navigate to="/" />} />
            ))}
            {creatorRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={role == 'CREATOR' ? <Component /> : <Navigate to="/" />} />
            ))}
            {userRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={role === 'USER' ? <Component /> : <Navigate to="/" />} />
            ))}
            {controllerRoutes.map(({ path, Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={role === 'CONTROLLER' ? <Component /> : <Navigate to="/" />}
                />
            ))}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};

export default observer(AppRouter);
