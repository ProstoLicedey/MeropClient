import { login, registration } from "../../http/userAPI";

const onCreate = async (values, user, isRegistration, role, creatorId) => {
    try {
        let data;
        if (!isRegistration) {
            data = await login(values.email, values.password);
        }
        else {
            data = await registration(
                values.email,
                values.password,
                values.name,
                values.surname,
                values.birthday,
                role,
                creatorId
            );
        }
        if (data === true) {
            return true;
        }
        else {
            user.setUser(data);
            user.setIsAuth(true);
            localStorage.setItem('token', data.accessToken)
        }
        return true;
    } catch (e) {
        return e;
    }
};

export default onCreate;