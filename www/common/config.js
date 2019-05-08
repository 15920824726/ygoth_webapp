angular.module("ygoworld.configs", [])
    //设置模式，开发或生产
    .constant("APP", {
        "devMode": true
    })

    //国内环境
    .constant("ChinaServerConfiguration", {
        "baseApiUrl": "https://th.ygoworld.com",
        "socketUrl": "https://th.ygoworld.com",
        "domain": "https://th.ygoworld.com",
        "updateUrl": "https://th.ygoworld.com"
    })

    //泰国环境
    .constant("ServerConfiguration", {
        "baseApiUrl": "https://th.ygoworld.com",
        "socketUrl": "https://th.ygoworld.com",
        "domain": "https://th.ygoworld.com",
        "updateUrl": "https://th.ygoworld.com"
    })

    //开发环境
    .constant("DevServerConfiguration", {
        "baseApiUrl": "https://th.ygoworld.com",
        "socketUrl": "https://th.ygoworld.com",
        "domain": "https://th.ygoworld.com",
        "updateUrl": "https://th.ygoworld.com"
    });
