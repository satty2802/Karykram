import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";

// 🔹 Components & Pages
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import MyTickets from "./pages/MyTickets";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // attempt to rehydrate user from token on app load
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
     
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />


        {/* Protected Routes - Only for authenticated users */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyTickets />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<h2>404 – Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
