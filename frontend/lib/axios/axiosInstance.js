import axios from "axios";
import Base_URL from "../../BaseURL"
const axiosInstance = axios.create({
    baseURL: Base_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}
)

export default axiosInstance;