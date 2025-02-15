import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Login from "../pages/login";
import Users from "../pages/Users";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../AppLayout";
import AddUser from "../pages/AddUser";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
        <Route element={<AppLayout/>}>
          <Route path="/users" element={<Users />} />
          <Route path="/add-user" element={<AddUser />} />    
        <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
