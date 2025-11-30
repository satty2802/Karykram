import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="gbu-navbar text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/home" : "/"} className="flex items-center text-2xl font-bold">
          <img src="/logo1.png" alt="Gautam Buddha University seal" className="nav-logo bg-transparent rounded-2xl" />
            <img src="/log4.png" alt="Gautam Buddha University seal" className="nav-logo1" />
            
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === "admin" && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/create-event"
                      className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Create Event
                    </Link>
                  </>
                )}
                <Link
                  to="/home"
                  className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Events
                </Link>
                {user.role !== "admin" && (
                  <Link
                    to="/my-tickets"
                    className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Tickets
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="gbu-btn-primary "
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
