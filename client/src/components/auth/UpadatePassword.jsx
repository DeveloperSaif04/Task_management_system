import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";

import { Link, useLocation, useNavigate } from "react-router-dom";


function UpdatePassword() {
  const navigate = useNavigate();

  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);

    axios
    .post(
      "http://localhost:4000/api/v1/user/reset-password",
      { password, confirmPassword, token},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      toast.success(res.data.message);
      navigate("/login")
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response?.data.message);
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className="max-w-500 p-4 lg:p-8">
          <h1 className="text-3xl font-semibold leading-10 text-dark">
            Choose new password
          </h1>
          <p className="my-4 text-lg leading-6 text-secondary">
            Almost done. Enter your new password and you're all set.
          </p>
          <form onSubmit={handleOnSubmit}>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">
                New Password <sup className="text-danger">*</sup>
              </label>
              <input
                required
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="form-control"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="position-absolute end-0  translate-middle-y cursor-pointer postions"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password <sup className="text-danger">*</sup>
              </label>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="form-control"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="position-absolute end-0 postions   translate-middle-y cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-4 w-100"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-4 d-flex justify-content-between align-items-center">
            <Link to="/login" className="text-secondary">
              <span className="me-2">
                <BiArrowBack />
              </span>
              Back To Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword;
