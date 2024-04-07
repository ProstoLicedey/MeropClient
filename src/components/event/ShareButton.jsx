import React from 'react';
import {ShareAltOutlined} from "@ant-design/icons";
import {Button} from "antd";

const ShareButton = () => {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href,
            })
                .then(() => console.log('Page shared successfully.'))
                .catch((error) => console.error('Error sharing page:', error));
        } else {

        }
    };

    return (
        <Button  style={{ width:'3em', height:'3em', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ShareAltOutlined  style={{fontSize:24}} onClick={handleShare}/>
        </Button>
    );
};

export default ShareButton;
