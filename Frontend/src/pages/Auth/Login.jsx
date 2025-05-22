import { useState } from "react";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../redux/authSlice.js";
import { assets } from "../../assets/assets.js";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    empcod: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseURL}auth/login`,
        { empcod: formData.empcod, password: formData.password },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log(res.data)
        dispatch(setAuthUser(res.data.user));
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <img
            src={assets.logo}
            alt="Western Logo"
            className="h-10 w-auto mr-3"
          />
          <h1 className="text-2xl font-bold text-blue-800 tracking-wide">
            Western Refrigeration Pvt.Ltd
          </h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow w-96">
          <Title
            title="Login"
            subTitle="Access your dashboard based on your role"
          />

          <form onSubmit={handleSubmit} className="mt-2">
            <InputField
              label="Employee Code"
              type="text"
              placeholder="Enter your employee code"
              value={formData.empcod}
              onChange={handleChange}
              name="empcod"
              required
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              required
            />

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
