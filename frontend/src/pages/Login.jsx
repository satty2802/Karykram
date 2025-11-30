import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser(formData));
      if (res.meta.requestStatus === "fulfilled") {
        const role = res.payload.user.role;
        role === "admin" ? navigate("/admin") : navigate("/home");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="auth-card auth-card-small card-animate">
        <div className="auth-inner md:flex">
          <div className="auth-left">
            <div className="auth-left-decor" aria-hidden>
              
            </div>
          </div>
          <div className="auth-right">
            <h2 className="text-3xl font-bold gbu-heading"> Login</h2>
            <p className="mt-2 text-sm text-gray-500">Don't have an account? <a href="/signup" style={{color: 'var(--gbu-blu)'}} className="underline">Sign up</a></p>

            <div className="mt-6 max-w-md w-full">
              <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  required
                  className="auth-input"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  className="auth-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`gbu-btn-primary w-full ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
