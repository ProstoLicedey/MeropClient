import {login, registration, receiveCode} from "../../http/userAPI";

const reciveCodeService = async (values) => {
    try {

          const  data = await receiveCode(values.email);

        if(data.status === 200) {
            return true;
        }
    } catch (e) {
        return e
    }
};

export default reciveCodeService;
