import { Button, Col, Form, Input, Radio, Switch, Row, Typography, Select, Spin, DatePicker, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { getAPI, postAPI } from "../../common/apisfunctions";
import moment from "moment";
import { useLocation } from "react-router";

export default function AddUser() {
    const location = useLocation();
    const user = location.state?.user
    const [form] = Form.useForm();
    const [rolesData, setRolesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState([]);
    const [galary, setGalary] = useState([]);
    const [galary2, setGalary2] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const fileInputRef = useRef(null);



    useEffect(() => {
        if (user?.id) {
            form.setFieldsValue({ ...user, dob: moment(user.dob, "YYYY-MM-DD") })
        }
    }, [user?.id])



    useEffect(() => {
        getRoles();
    }, [])

    const getRoles = (page = 1) => {
        setLoading(true);
        let apiParams = {
            page,
        };

        let successFn = function (res) {
            setRolesData(res.data);
            setLoading(false);

        };

        let errorFn = function (error) {
            console.log(error);
            setLoading(false);
        };
        getAPI("/roles", successFn, errorFn, apiParams);
    };

    const onFinish = (values) => {

        const formData = new FormData();

        // Append regular fields
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('role_id', values.role_id);
        formData.append('dob', values.dob && moment(values.dob).format("YYYY-MM-DD"));
        formData.append('gender', values.gender);
        formData.append('status', values.status ? 1 : 0);
        formData.append('password', values.password);
        formData.append('profile', file);
        formData.append('user_galleries[]', galary);
        formData.append('user_pictures[]', galary2);


        setLoading(true);

        let successFn = function () {
            if (user?.id) {
                messageApi.open({
                    type: 'success',
                    content: "User is updated successfully!",
                });
            } else {
                messageApi.open({
                    type: 'success',
                    content: "User is created successfully!",
                });
            }

            resetAllFields();
            setLoading(false);
        };

        let errorFn = function (e) {
            let errors = e.data.errors;
            setLoading(false);
            let errorMessages = Object.values(errors).flat();
            errorMessages.forEach((error, index) => {
                setTimeout(() => {
                    messageApi.open({
                        type: "error",
                        content: error,
                        duration: 10,
                    });
                }, index * 1000);
            });

        };
        if (user?.id) {
            formData.id = user.id;
            postAPI(`/users/${user?.id}`, formData, successFn, errorFn);
        } else {
            postAPI("/users", formData, successFn, errorFn);
        }
    };

    const handFileChange = (event) => {
        console.log(event, "event");
        setFile(event?.target?.files[0]);
    }

    const handGalaryChange = (event) => {
        console.log(event, "event");
        setGalary(event?.target?.files[0]);
    }

    const handGalary2Change = (event) => {
        console.log(event, "event");
        setGalary2(event?.target?.files[0]);
    }

    const resetAllFields = () => {
        form.resetFields();
        setGalary([]);
        setGalary2([]);
        setFile("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }



    return (
        <div>
            {contextHolder}
            <Typography.Text style={{ fontSize: "18px" }}>Create Admin User</Typography.Text>
            <Spin spinning={loading}>
                <div style={{ marginTop: "20px", paddingRight: "40px" }}>
                    <Form layout="vertical" form={form} onFinish={onFinish}>
                        <Row gutter={[50, 10]}>
                            <Col lg={12} md={24} sm={24} xl={12}>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please input user name!' }]}
                                >
                                    <Input placeholder="Name" />
                                </Form.Item>
                            </Col>

                            <Col lg={12} md={24} sm={24} xl={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please input email!' },
                                        {
                                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Please enter a valid email address!'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Email" type="email" />
                                </Form.Item>
                            </Col>

                            <div hidden={user?.id ? true : false} style={{ width: '100%' }}>
                                <Col lg={12} md={24} sm={24} xl={12} >
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: user?.id ? false : true, message: 'Please input password!' }]}
                                    >
                                        <Input.Password placeholder="Password" />
                                    </Form.Item>
                                </Col>
                            </div>


                            <Col lg={12} md={24} sm={24} xl={12}>
                                <Form.Item
                                    label="Role"
                                    name="role_id"
                                    rules={[{ required: true, message: 'Please select role!' }]}
                                >
                                    <Select
                                        placeholder="Select a Role"
                                        optionFilterProp="children"
                                        showSearch
                                        allowClear
                                    >
                                        {rolesData?.length > 0
                                            ? rolesData?.map((option) => (
                                                <Select.Option key={option.id} value={option.id}>
                                                    {option.name}
                                                </Select.Option>
                                            ))
                                            : <Select.Option disabled key="no-data">No Roles available</Select.Option>}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={"DOB"}
                                    name={"dob"}
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker
                                        style={{ width: "100%", borderRadius: "5px" }}
                                        format={"DD/MM/YYYY"}
                                    />
                                </Form.Item>
                            </Col>

                            <Col lg={12} md={24} sm={24} xl={12}>
                                <Form.Item
                                    label="Gender"
                                    name="gender"
                                    rules={[{ required: true, message: 'Please select gender!' }]}
                                >
                                    <Radio.Group>
                                        <Radio value="0">Male</Radio>
                                        <Radio value="1">Female</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col lg={12} md={24} sm={24} xl={12} style={{ marginTop: "10px" }}>
                                Profile
                                <div style={{ backgroundColor: "#e9e9e9", padding: "10px", width: "50%", borderRadius: "10px" }}>
                                    <input ref={fileInputRef} type="file" onChange={handFileChange} />
                                </div>
                            </Col>
                            <Col lg={12} md={24} sm={24} xl={12} style={{ marginTop: "10px" }}>
                                User Galliries
                                <div style={{ backgroundColor: "#e9e9e9", padding: "10px", width: "50%", borderRadius: "10px" }}>
                                    <input ref={fileInputRef} multiple type="file" onChange={handGalaryChange} />
                                </div>
                            </Col>
                            <Col lg={12} md={24} sm={24} xl={12} style={{ marginTop: "10px" }}>
                                User Pictures
                                <div style={{ backgroundColor: "#e9e9e9", padding: "10px", width: "50%", borderRadius: "10px" }}>
                                    <input ref={fileInputRef} type="file" multiple onChange={handGalary2Change} />
                                </div>
                            </Col>

                            <Col lg={12} md={24} sm={24} xl={12} style={{ marginTop: "10px" }}>
                                <Form.Item
                                    label="Is Active"
                                    name="status"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                gap: '10px',
                                marginTop: '20px'
                            }}>
                                <Button onClick={() => resetAllFields()}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Spin >

        </div >
    )
}