import { Button, Col, Input, Row, Select, Typography } from "antd";
import { LeftOutlined, RightOutlined, StepBackwardOutlined, StepForwardOutlined, } from "@ant-design/icons";
import  { useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_ARR } from "./contants";

const { Text } = Typography;

// eslint-disable-next-line react/prop-types
const CustomPagination = ({ count, loadData, nextPage, currentPage, pageSize = DEFAULT_PAGE_SIZE, updatePage, totalItems }
) => {
    const [newCurrent, setNewCurrent] = useState(currentPage);
    const [input, setInput] = useState(null);
    const [sizeOfPage, setSizeOfPage] = useState(1);
    const inputRef = useRef();

    // const sizeOfPage = parseInt(Math.ceil(count / pageSizee));

    useEffect(() => {
        if (count > pageSize) {
            setSizeOfPage(parseInt(Math.ceil(count / pageSize)));
        } else {
            setSizeOfPage(1);
        }
    }, [count, pageSize]);

    const handleJump = (page) => {
        if (page > sizeOfPage) {
            loadData(sizeOfPage);
        } else if (page < 1) {
            loadData(1);
            setNewCurrent(1);
        } else {
            loadData(page);
        }
    };

    useEffect(() => {
        if (input) {
            handleJump(newCurrent);
        }
    }, [input]);

    useEffect(() => {
        setNewCurrent(currentPage);
        inputRef.current.input.value = currentPage;
    }, [currentPage]);

    const handleInputChange = (e) => {
        setNewCurrent(e.target.value);
        setInput(e.target.value);
    };

    const handleBlur = () => {
        const value = parseInt(newCurrent);
        if (value > sizeOfPage) {
            setNewCurrent(sizeOfPage);
        }
    };

    return (
        <>
            <Col span={6} style={{}}>
                <Row>
                    {
                        totalItems > 0 &&
                        <Col span={12}>
                            <Text>Total Items: {totalItems}</Text>
                        </Col>
                    }
                    <Col span={totalItems ? 12 : 24}>
                        <Select
                            placeholder={"Rows"}
                            optionFilterProp="children"
                            onChange={(e) => updatePage(e)}
                            value={pageSize}
                            style={{
                                borderRadius: "10px",
                                margin: "0.5vh",
                                width: "10vh",
                                height: "3vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 4
                            }}
                        >
                            {PAGE_SIZE_ARR?.map((option) => (
                                <Select.Option
                                    label={option.page}
                                    value={option.page}
                                    key={option.key}
                                >
                                    {option.page}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Col>
            <Col
                span={18}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        disabled={currentPage === 1}
                        style={{
                            borderRadius: "10px",
                            margin: "0.5vh",
                            width: "1vh",
                            height: "2.7vh",
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "19px",
                        }}
                        onClick={() => loadData(1)}
                    >
                        <StepBackwardOutlined style={{marginTop:"17px"}}/>
                    </Button>
                    <Button
                        disabled={currentPage === 1}
                        style={{
                            borderRadius: "10px",
                            margin: "0.5vh",
                            width: "1vh",
                            height: "2.7vh",
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "19px",
                        }}
                        onClick={() => loadData(currentPage - 1)}
                    >
                        <LeftOutlined style={{marginTop:"17px"}}/>
                    </Button>
                    <Typography.Text
                        style={{
                            borderRadius: "10px",
                            margin: "0.5vh",
                            backgroundColor: "white",
                            height: "3.5vh",
                            width: "12vh",
                            paddingTop: "2px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Input
                            min={1}
                            ref={inputRef}
                            max={sizeOfPage}
                            onBlur={handleBlur}
                            value={newCurrent}
                            onChange={handleInputChange}
                            style={{ display: "none" }}
                        />
                        {newCurrent} / {sizeOfPage}
                    </Typography.Text>
                    <Button
                        disabled={!nextPage}
                        style={{
                            borderRadius: "10px",
                            margin: "0.5vh",
                            width: "1vh",
                            height: "2.7vh",
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "19px",
                        }}
                        onClick={() => loadData(nextPage)}
                    >
                        <RightOutlined style={{marginTop:"17px"}}/>
                    </Button>
                    <Button
                        disabled={!nextPage}
                        style={{
                            borderRadius: "10px",
                            margin: "0.4vh",
                            width: "1vh",
                            height: "2.7vh",
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "19px",
                        }}
                        onClick={() => loadData(sizeOfPage)}
                    >
                        <StepForwardOutlined style={{marginTop:"17px"}}/>
                    </Button>
                </div>
            </Col>
        </>
    );
};

export default CustomPagination;
