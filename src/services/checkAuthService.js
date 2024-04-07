import axios from "axios";
import jwtDecode from "jwt-decode";

const checkAuthService = async (user) => {

    try {
        console.log('yes')
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/user/refresh`, {withCredentials: true})
        localStorage.setItem('token', response.accessToken);

        user.setUser(response.data.user);
        user.setIsAuth(true);

    } catch (e) {
        console.log(e);
    }
    //http://localhost:5000/api/user/refresh
}
export default checkAuthService;