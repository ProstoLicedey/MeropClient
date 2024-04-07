import {inputCode} from "../../http/userAPI";

const InputCodeService = async (email, code) => {
    try {

        const  data = await inputCode(email, code);

        if(data.status === 200) {
            return true;
        }
    } catch (e) {
        return e
    }
};

export default InputCodeService;
