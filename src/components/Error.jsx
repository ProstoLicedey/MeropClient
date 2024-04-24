import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {HOME_ROUTE} from "../utils/consts";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // Можно также отправить информацию об ошибке на сервер для анализа
    }

    render() {
        if (this.state.hasError) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const navigate = useNavigate();
            navigate(HOME_ROUTE);
            return null;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
