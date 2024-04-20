import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:4000/api/v1/user/reset-password-token",
        { email},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setEmailSent(true)
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
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
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>
          <p className="my-4 text-lg leading-6 text-secondary">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email, we can try account recovery."
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address <sup className="text-danger">*</sup>
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="form-control"
                />
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary mt-4 w-100"
            >
              {!emailSent ? "Submit" : "Resend Email"}
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

export default ForgotPassword;
