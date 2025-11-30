import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const res = await dispatch(registerUser(payload));
      if (res.meta.requestStatus === "fulfilled") {
        const role = res.payload.user.role;
        role === "admin" ? navigate("/admin") : navigate("/home");
      }
    } catch (err) {
      console.error("Registration failed:", err);
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
            <h2 className="text-3xl font-bold gbu-heading">Create your student account</h2>
            <p className="mt-2 text-sm text-gray-500">Already have an account? <a href="/login" style={{color: 'var(--gbu-blu)'}} className="underline">Log in</a></p>

            <div className="mt-6 max-w-md w-full">
              <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <input className="auth-input" type="text" placeholder="First Name*" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
                <input className="auth-input" type="text" placeholder="Last Name" />
              </div>

              <div>
                <input className="auth-input" type="email" placeholder="Email*" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input className="auth-input" type="password" placeholder="Password*" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
                <input className="auth-input" type="password" placeholder="Confirm Password*" value={formData.confirmPassword} onChange={(e)=>setFormData({...formData, confirmPassword: e.target.value})} required />
              </div>

              <input type="hidden" value={formData.role} />

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex items-center">
                <input id="agree" type="checkbox" className="h-4 w-4 mr-2" />
                <label htmlFor="agree" className="text-sm text-gray-600">I agree with the terms and conditions.</label>
              </div>

              <div>
                <button type="submit" disabled={loading} className={`gbu-btn-primary w-full ${loading ? 'opacity-60 cursor-not-allowed':''}`}>{loading? 'Registering...':'Create account'}</button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
