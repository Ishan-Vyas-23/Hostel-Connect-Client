import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Recover from "./pages/Recover";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ManageComplaints from "./pages/ManageComplaints";
import Feedbacks from "./pages/Feedbacks";
import AdminUsers from "./pages/AdminUsers";
import CreateUser from "./pages/CreateUser";
import CreateNotice from "./pages/createNotice";
import Notices from "./pages/Notices";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<Recover />} />

        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="submit" element={<SubmitComplaint />} />
          <Route path="my-complaints" element={<MyComplaints />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="/manage-complaints" element={<ManageComplaints />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/create-notice" element={<CreateNotice />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="dark"
        toastStyle={{
          backgroundColor: "#faedcd",
          color: "black",
        }}
        progressStyle={{
          background: "#4FD1C5",
        }}
      />
    </>
  );
};

export default App;
