import { toast } from "react-hot-toast";
import axios from "axios";

const getUserDetails = async () => {
  try {
    const res = await axios.get('/api/users/me');
    const user = {
      name: res.data.data.name,
      email: res.data.data.email,
      college: res.data.data.college,
      city: res.data.data.city,
      profileImage: res.data.data.profileImage,
      isProfileComplete: res.data.data.isProfileComplete,
    };
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error: any) {
    console.log(error.message);
    toast.error(error.message);
  }
};

export default getUserDetails;