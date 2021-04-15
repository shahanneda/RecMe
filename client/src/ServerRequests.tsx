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
            "userID": props.loginInfo.userID,
        }),

    }).then((res) => {console.log(res);if(props.callback) props?.callback()})
}


interface ServerLoginProps {
    userID: string,
    password: string,
    serverInfo: ServerInfo,
    onClose: () => void,
    setLoading: (loading: Boolean) => void,
    setLoginInfo: (info: LoginInfo) => void,
    setShouldShowUsernameError: (val: Boolean) => void,
}
export type {ServerLoginProps}


export const loginToServer = (props: ServerLoginProps): void => {
    props.setLoading(true);
    fetch(props.serverInfo.apiURL + "/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "userID": props.userID,
            "password": props.password,
        }),
    }).then((res) => res.json())
        .then((res) => {
            console.log(res)
            saveServerResponseToLoginInfo(res, props)
            props.setLoading(false);
        });
}

interface ServerCreateAccountProps extends ServerLoginProps { 
    email: string,
}
export type {ServerCreateAccountProps};

export const createAccountOnServer = (props: ServerCreateAccountProps): void => {
    props.setLoading(true);
    fetch(props.serverInfo.apiURL + "/create-account/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "userID": props.userID,
            "password": props.password,
            "email": props.email,
        }),
    }).then((res) => res.json())
        .then((res) => {
            console.log(res)
            saveServerResponseToLoginInfo(res, props)
            props.setLoading(false);
        });
}

const saveServerResponseToLoginInfo = (res: any, props:ServerLoginProps ) => {
            if (res.status != "success") {
                props.setShouldShowUsernameError(true);
            } else {
                console.log(res);
                props.setLoginInfo({
                    loggedIn: true,
                    displayName: res.displayName,
                    email: res.email,
                    sessionID: res.sessionID,
                    userID: res.userID,
                })
                props.onClose()
            }


}

interface UserInfo{
    displayName: String,
    email: String,
    userID: String,


}
// const getUserFromServer = ():Promise => {
//     fetch(serverInfo.apiURL + "/api/user/mary6/get_movies/")
//         .then(res => res.json())
//         .then(res => {
//             console.log(res)
//             setCurrentUser(res);
//         });
// }

