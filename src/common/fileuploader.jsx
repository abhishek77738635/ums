// eslint-disable-next-line no-unused-vars
import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const FileUploader = ({ onFileUpload }) => {
    const handleUpload = async ({ file }) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            const binaryData = reader.result;
            onFileUpload(binaryData);

            const payload = {
                notifier: {
                    name: "Bugsnag JavaScript",
                    version: "7.20.2",
                    url: "https://github.com/bugsnag/bugsnag-js"
                },
                device: {
                    locale: "en-US",
                    userAgent: navigator.userAgent,
                    orientation: "landscape-primary",
                    id: "cm71tky0r00003b6u4q5xvuzx"
                },
                app: {
                    releaseStage: "production",
                    type: "browser"
                },
                sessions: [
                    {
                        id: "cm73kd2mc00033b6u1oylpm57",
                        startedAt: new Date().toISOString(),
                        user: {}
                    }
                ]
            };

            try {
                const response = await axios.post("https://sessions.bugsnag.com/", payload, {
                    headers: {
                        "bugsnag-api-key": "33c870922bb9bde1574b52cc13d830a0",
                        "Content-Type": "application/json",
                        "bugsnag-sent-at": new Date().toISOString(),
                        "bugsnag-payload-version": "1",
                    },
                });
                message.success("File uploaded successfully");
                console.log("Response:", response.data);
            } catch (error) {
                message.error("File upload failed");
                console.error("Upload error:", error);
            }
        };

        reader.onerror = () => {
            message.error("Error reading file");
        };
    };

    return (
        <Upload customRequest={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
    );
};

export default FileUploader;
