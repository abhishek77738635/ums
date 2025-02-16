import { Button, Col, Collapse, Descriptions, Form, Input, message, Modal, Popconfirm, Popover, Row, Select, Space, Spin, Table, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { getAPI, postAPI } from "../../common/apisfunctions";
import CustomPagination from "../../common/CustomPagination";
import debounce from "debounce";
import { DeleteFilled, DeleteOutlined, DownloadOutlined, EditOutlined, EyeFilled, FilterFilled, FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { convertCsvToExcel } from "../../common/exportExcel";
import { Link } from "react-router";



export default function Users() {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [current, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [searchText, setSearchText] = useState(undefined);
    const [modalData, setModalData] = useState(false);
    const [items, setItems] = useState([]);
    const [closeFilter, setCloseFilter] = useState(false);
    const [rolesData, setRolesData] = useState([]);
    const [filterKeys, setFilterKeys] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();


    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        console.log("Selected Row IDs:", selectedRows.map(row => row.id));
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedIds(selectedRows.map(row => row.id));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
            disabled: record.disabled,
        }),
    };




    const [sortConfig, setSortConfig] = useState({});

    useEffect(() => {
        getRoles();
    }, [])


    useEffect(() => {
        getUsers();
    }, [pageSize, searchText, sortConfig, filterKeys])


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

    const getUsers = (page = 1) => {
        setLoading(true);
        let apiParams = {
            page,
            per_page: pageSize,
            search: searchText ? searchText : undefined,
            ...sortConfig,
            // filter: encodedFilter       
        };

        let successFn = function (res) {
            setUsers(res.data);
            setNextPage(res.last_page);
            setCurrentPage(res.current_page);
            setCount(res.total);
            setLoading(false);
        };

        let errorFn = function (error) {
            console.log(error);
            setLoading(false);
        };
        getAPI("/users", successFn, errorFn, apiParams);
    };

    const updatePage = (e) => {
        setPageSize(e);
    };

    


    const columns = [
        {
            title: "S. No.",
            key: "s_no",
            width:"90px",
            render: (item, record, index) => index + 1
        },
        {
            title: "Name",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "Email",
            key: "email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Role",
            key: "role",
            dataIndex: "role_id",
            sorter: true,
            render: (item, record,) => <span>{record?.role ? record?.role?.name : "--"}</span>
        }, {
            title: "DOB",
            key: "dob",
            dataIndex: "dob",
            sorter: true,
        }, {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
            sorter: true,
            render: (item, record,) => <span>{record?.gender_text ? record?.gender_text : "--"}</span>

        }, {
            title: "Status",
            key: "status",
            dataIndex: "status",
            sorter: true,
            render: (item, record,) => <span>{record?.status_text ? record?.status_text : "--"}</span>
        },
        {
            title: "Actions",
            key: "actions",
            dataIndex: "actions",
            render: (item, record,) => <Space>
                <EyeFilled onClick={() => getUsersByParam(record?.id)} />

                <Link to="/add-user"  state={{ user: record }}><EditOutlined /></Link>
                <Popconfirm
                    title="Are you sure delete this user?"
                    onConfirm={() => handleBulkDelete([record?.id])}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined />
                </Popconfirm>
            </Space>
        },

    ];



    const getExport = () => {
        setLoading(true);
        let apiParams = {

        };

        let successFn = function (res) {
            convertCsvToExcel(res, "users_excel.csv")
            setLoading(false);

        };

        let errorFn = function (error) {
            console.log(error);
            setLoading(false);
        };
        getAPI("/users-export", successFn, errorFn, apiParams);
    };

    const getUsersByParam = (ID) => {
        setLoading(true);
        let apiParams = {

        };

        let successFn = function (res) {
            let currArr = [];

            [res?.data]?.forEach((x) => {
                currArr.push(
                    { label: 'Name', span: 3, children: x?.name },
                    { label: 'Email', span: 3, children: x?.email },
                    { label: 'Role', span: 3, children: x?.role?.name || 'N/A' },
                    { label: 'Date of Birth', span: 3, children: x?.dob },
                    { label: 'Gender', span: 3, children: x?.gender_text },
                    { label: 'Status', span: 3, children: x?.status_text },
                    { label: 'Profile Picture', span: 3, children: <a href={x?.profile}>View</a> },
                );


            });

            setItems(currArr);
            setModalData(true);
            setLoading(false);

        };

        let errorFn = function (error) {
            console.log(error);
            setLoading(false);
        };
        getAPI(`/users/${ID}`, successFn, errorFn, apiParams);
    };

    const searchUser = debounce((value) => setSearchText(value), 600);


    const handleTableChange = (pagination, filters, sorter) => {

        if (sorter.field) {
            setSortConfig({
                sort: sorter.field,
                order_by: sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : ""
            })
            // getUsers(1,sorter.field,sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : "");
        } else {
            setSortConfig({
                sort: undefined,
                order_by: undefined
            })
        }
    };

    const resetFilters = () => {
        setFilterKeys({});
        setSearchText(null);
        formRef.current?.resetFields();
    };



    const handleBulkDelete = (ids) => {
        let reqData = { id: ids };
        setLoading(true);

        let successFn = function () {
            messageApi.open({
                type: 'success',
                content: "Users deleted successfully!",
            });
            setSelectedRowKeys([]);
            setSelectedIds([]);
            getUsers();
            setLoading(false);
        };

        let errorFn = function () {
            messageApi.open({
                type: 'error',
                content: "Failed to delete users. Please try again.",
            });
            setLoading(false);
        };

        postAPI("/users-delete-multiple", reqData, successFn, errorFn);
    };


    const FilterBox = (
        <>
            <Form ref={formRef}>
                <Collapse
                    defaultActiveKey={["1"]}
                    style={{ width: "100%", padding: 0 }}
                >
                    <Collapse.Panel header="roles" key="roles">
                        <Form.Item name={"roles"}>
                            <Select
                                placeholder="Select a Role"
                                optionFilterProp="children"
                                showSearch
                                allowClear
                                onChange={(value) => setSearchText(value)}
                            >
                                {rolesData?.length > 0
                                    ? rolesData?.map((option) => (
                                        <Select.Option key={option.id} value={option.name}>
                                            {option.name}
                                        </Select.Option>
                                    ))
                                    : <Select.Option disabled key="no-data">No Roles available</Select.Option>}
                            </Select>
                        </Form.Item>
                    </Collapse.Panel>
                </Collapse>
            </Form>
        </>
    );


    return (
        <div>
            {contextHolder}
            <Typography.Text style={{ fontSize: "18px", color: "#007190", fontWeight: "bold" }}>List Of All Users</Typography.Text>
            <Row style={{ marginTop: "30px" }}>
                <Col span={12}>
                    <Input style={{ width: "50%", border: "none" }} placeholder="Search..." prefix={<SearchOutlined style={{ color: "#007190", fontWeight: "bolder", fontSize: "16px" }} />} onChange={(e) => searchUser(e.target.value)} />
                </Col>
                <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
                    <Space>


                        <div>
                            <Tooltip title="Filters">
                                <Popover
                                    // style={{ marginRight: "10px" }}
                                    placement="bottomLeft"
                                    title={
                                        <div>
                                            <Row style={{ display: "flex" }}>
                                                {" "}
                                                <Col span={10} style={{ marginTop: "4px" }}>
                                                    <FilterOutlined /> Filter
                                                </Col>{" "}
                                                <Col
                                                    span={14}
                                                    style={{ color: "#31A6C7", textAlign: "end" }}
                                                >
                                                    <Button type="link"
                                                        onClick={() => resetFilters()}
                                                    >
                                                        Reset
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                    content={FilterBox}
                                    trigger="hover"
                                    onOpenChange={() =>
                                        !closeFilter ? setCloseFilter(true) : setCloseFilter(false)
                                    }
                                    open={closeFilter}
                                >
                                    <Button
                                        style={{
                                            textAlign: "center",
                                            alignContent: "center",
                                            border: 0,
                                            backgroundColor: "#3f51b5"
                                        }}
                                    >
                                        <FilterFilled style={{ color: "white" }} />
                                    </Button>
                                </Popover>
                            </Tooltip>
                        </div>
                        <div hidden={selectedIds?.length === 0}>
                            <Popconfirm
                                title="Are you sure to delete all these?"
                                onConfirm={() => handleBulkDelete(selectedIds)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button style={{ backgroundColor: "red", paddingLeft: "20px", paddingRight: "20px" }} icon={<DeleteFilled style={{ color: "white" }} />} />
                            </Popconfirm>

                        </div>
                        <Tooltip title="Export">
                            <div onClick={() => getExport()}>
                                <Button icon={<DownloadOutlined style={{ color: "black", fontWeight: "bold", paddingLeft: "20px", paddingRight: "20px" }} />} />
                            </div>
                        </Tooltip>
                        <Link to="/add-user">
                            <Button icon={<PlusOutlined style={{ color: "black", fontWeight: "bold", paddingLeft: "20px", paddingRight: "20px" }} />} />
                        </Link>
                    </Space>
                </Col>
            </Row>
            <Spin spinning={loading}>
                <div style={{ marginTop: '10px',width:"100%" }}>
                    <Table scroll={{x:"max-content",y:"1000px"}} rowKey={(record) => record.id} columns={columns} dataSource={users} pagination={false} onChange={handleTableChange} rowSelection={rowSelection} />
                    <Row
                        style={{
                            display: "flex",
                            padding: "5px",
                            backgroundColor: "#EAEEF2",
                            justifyContent: "end",
                        }}
                    >
                        <CustomPagination
                            nextPage={nextPage}
                            loadData={getUsers}
                            currentPage={current}
                            count={count}
                            pageSize={pageSize}
                            updatePage={updatePage}
                        />
                    </Row>
                </div>
            </Spin>

            <Modal width={800} open={modalData} onCancel={() => setModalData(false)} footer={false} destroyOnClose>
                <div>
                    <Descriptions bordered title="View User" items={items} />
                </div>
            </Modal>
        </div >
    )
}
