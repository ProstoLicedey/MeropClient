import React from 'react';
import Link from "antd/es/typography/Link";
import { CREATORREGIST_ROUTE } from "../../utils/consts";

const FooterPage = () => {
    return (
        <div style={styles.container}>
            <Link
                href={CREATORREGIST_ROUTE}
                style={styles.link}
            >
                Организаторам
            </Link>

            <p style={styles.text}>Merop ©2023 Created by Licedey</p>
        </div>
    );
};

const styles = {
    container: {
        margin: '3vh',
        marginTop: 0,
        position: 'relative',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        height: 'auto',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    link: {
        textDecoration: 'underline',
        color: '#9254de',
        margin: '1vh 3vh 2vh 0',
        alignSelf: 'flex-end',
    },
    text: {
        marginTop: 'auto',
        marginBottom: '3vh',
    }
};

export default FooterPage;
