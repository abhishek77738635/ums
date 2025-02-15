import axios from "axios";
import lockr from "lockr";




export const getAuthToken = function () {
    return lockr.get("token");
};

//eslnit-disable-next-line
console.log(getAuthToken(), 'token');



export const getAPI = async function (
    URL,
    successFn,
    errorFn,
    params = {},
    cancelToken = null
) {
    let token = getAuthToken();
    let authHeaders = {};
    if (token) {
        authHeaders.Authorization = `Bearer ${token}`;
    }
    axios({
        method: "get",
        url: `https://interview.optimavaluepro.com/api/v1${URL}`,
        headers: {
            ...authHeaders,
        },
        params: params,
        cancelToken: cancelToken?.token,
    })
        .then(function (response) {
            let data = response.data;
            successFn(data);
        })
        .catch(function (error) {
            errorFn(error);
        });
};



export const postAPI = async function (
    URL,
    data,
    successFn,
    errorFn,
    headerConfig = {}
) {
    let token = getAuthToken();
    let authHeaders = {};
    if (token) {
        authHeaders.Authorization = `Bearer ${token}`;
    }
    axios({
        method: "post",
        url: `https://interview.optimavaluepro.com/api/v1${URL}`,
        data: data,
        headers: {
            ...authHeaders,
            ...headerConfig,
        },
    })
        .then(function (response) {
            let data = response.data;

            successFn(data);
        })
        .catch(function (error) {
            errorFn(error.response);
        });
};