import {updatePass} from "../../http/userAPI";

const reciveCodeService = async (email, password) => {
    try {

        const  data = await updatePass(email, password);

        if(data.status === 200) {
            return true;
        }
    } catch (e) {
        return e
    }
};

export default reciveCodeService;
