import { Layout, Menu, Avatar, Dropdown, Row, Col } from "antd";
import { UserOutlined, LogoutOutlined, TeamOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { persistor } from "../redux/store";

const { Sider, Content } = Layout;

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };

  // Map paths to menu keys
  const menuKeyMap = {
    "/users": "1",
    "/add-user": "2",
  };

  return (
    <Layout style={{ minHeight: "100vh"}}>
      <Sider collapsible>
        <div className="logo" style={{ color: "white", textAlign: "center", padding: "16px", fontSize: "18px" }}>
          UMS
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[menuKeyMap[location.pathname] || "1"]}>
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to="/users">All Users</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />}>
            <Link to="/add-user">Add User</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Row style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", background: "#fff", height: "50px" }}>
          <Col span={12} style={{ display: "flex", textAlign: "start", justifyContent: "start" }}>
            <h3>User Management</h3>
          </Col>
          <Col span={11} style={{ display: 'flex', justifyContent: "end" }}>
            <h3 style={{ color: "#007190" }}>Hi,</h3>
            <h3>{user?.name}</h3>
          </Col>
          <Col span={1} style={{ display: "flex", justifyContent: "end" }}>
            <Dropdown overlay={
              <Menu>
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu>
            } placement="bottomRight">
              <Avatar size="large" src={user?.profile} icon={!user?.profile && <UserOutlined />} />
            </Dropdown>
          </Col>
        </Row>

        {/* Page Content */}
        <Content style={{ margin: "16px", padding: "16px", background: "#fff", borderRadius: "8px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
