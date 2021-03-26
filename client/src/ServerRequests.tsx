import { LoginInfo } from "./Login";
import { ServerInfo } from "./ServerInfo";



interface ServerLogoutProps {
    serverInfo: ServerInfo,
    loginInfo: LoginInfo,
    callback?: () => void,
}

export const logoutToServer = (props: ServerLogoutProps): void => {
    let requestHeaders: any = { // typescript doesnt like custom sessionID header
        'Content-Type': 'application/json',
        "sessionID": props.loginInfo.sessionID
    };

    fetch(props.serverInfo.apiURL + "/logout/", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
            "userID": props.loginInfo.username,
        }),
    }).then((res) => {if(props.callback) props?.callback()})
}


interface ServerLoginProps {
    username: string,
    password: string,
    serverInfo: ServerInfo,
    onClose: () => void,
    setLoading: (loading: Boolean) => void,
    setLoginInfo: (info: LoginInfo) => void,
    setShouldShowUsernameError: (val: Boolean) => void,
}

export const loginToServer = (props: ServerLoginProps): void => {
    props.setLoading(true);
    fetch(props.serverInfo.apiURL + "/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "userID": props.username,
            "password": props.password,
        }),
    }).then((res) => res.json())
        .then((res) => {
            console.log(res)
            props.setLoading(false);
            if (res.status != "success") {
                props.setShouldShowUsernameError(true);
            } else {
                props.setLoginInfo({
                    loggedIn: true,
                    displayName: res.displayName,
                    email: res.email,
                    sessionID: res.sessionID,
                    username: res.username,
                })
                props.onClose()
            }

        });
}