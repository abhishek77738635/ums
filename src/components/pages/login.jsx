import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/authSlice";
import { Button, Divider, Form, Input, Typography } from "antd";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        const result = await dispatch(loginUser({ email:e.email, password:e.password }));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/users");
        }
    };

    return (
        <div className="login-wrap">
            <div className="login1">
                {/* {user && (
          <div className="mt-4 p-3 bg-gray-200 rounded">
            <h3 className="text-lg font-semibold">Welcome, {user.name}!</h3>
            <p>Role: {user.role}</p>
            <p>Status: {user.status}</p>
            <p>Gender: {user.gender}</p>
            <h4 className="font-semibold mt-2">Permissions:</h4>
            <ul className="list-disc list-inside">
              {permissions.slice(0, 3).map((perm) => (
                <li key={perm.id}>{perm.display_name}</li>
              ))}
            </ul>
          </div>
        )} */}
            </div>
            <div className="login2" >
                <div style={{ display: "block", textAlign: 'center',width:"50%"}}>
                  <div style={{width:"auto",height:"auto", border:"1px dotted red",borderRadius:"5px",color:"red"}} hidden={!error}>{error && <p>{error}</p>}</div>
                    <Typography.Text style={{ fontSize: "25px" }}>Login</Typography.Text>
                    <p style={{color:"#8daab3",fontSize:"12px"}} className="poppins">Enter your username and password</p>
                    <Divider type="horizontal" />
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Form.Item name={"email"} label="Email"  rules={[{required:true,message:"Email is required!"}]}>
                             <Input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 mb-2 border rounded"
                            required
                        />
                        </Form.Item>
                       <Form.Item name={"password"} label="Password" rules={[{required:true,message:"Password is required!"}]}>
                         <Input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 mb-2 border rounded"
                            required
                        />
                       </Form.Item>
                       <Form.Item>
                          <Button
                          style={{width:"100%",color:"white",backgroundColor:"#007190"}}
                            htmlType="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                       </Form.Item>
                      
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
