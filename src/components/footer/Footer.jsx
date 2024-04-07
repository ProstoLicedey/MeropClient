import React from 'react';
import Link from "antd/es/typography/Link";
import {CREATORREGIST_ROUTE} from "../../utils/consts";

const FooterPage = () => {
    return (
        <div style={{
            margin: '3vh',
            marginTop: 0,
            position: 'relative',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            height: '5vw',
            justifyContent: 'space-between',
            flexDirection: 'column', // Set flexDirection to 'column' to stack the children vertically
        }}>
            <Link
                href={CREATORREGIST_ROUTE}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    textDecoration: 'underline',
                    color: '#9254de',
                    marginRight: '3vh',
                    marginTop: '1vh',
                    marginBottom: '2vh',
                }}
            >
                Организаторам
            </Link>

            <p style={{ marginTop: 'auto', marginBottom: '3vh' }}>Merop ©2023 Created by Licedey </p>
        </div>
    );
};

export default FooterPage;