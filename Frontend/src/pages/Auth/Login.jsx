import React, { useState } from "react";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice.js";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  console.log(formData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser(formData));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Login successful!");
        navigate("/");
        // Redirect based on role
        // switch (result.payload.role) {
        //   case "admin":
        //     navigate("/admin/dashboard");
        //     break;
        //   case "manager":
        //     navigate("/manager/dashboard");
        //     break;
        //   case "user":
        //     navigate("/user/dashboard");
        //     break;
        //   default:
        //     navigate("/");
        // }
      } else {
        toast.error(result.payload || "Login failed!");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <Title
          title="Login"
          subTitle="Access your dashboard based on your role"
        />

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            name="email"
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

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
