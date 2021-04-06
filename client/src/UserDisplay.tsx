import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-elements';
import { RouteComponentProps } from 'react-router'
import { RColors } from './RColors';
import { ServerInfo, ServerInfoContext } from './ServerInfo';

interface Props extends RouteComponentProps<any> {

}



export default function UserDisplay(props: Props): ReactElement {

    const { theme } = useTheme();
    const [currentUser, setCurrentUser] = useState();
    const serverInfo: ServerInfo = useContext<ServerInfo>(ServerInfoContext);

    

    useEffect(() => {
        // getUserFromServer(props.match.params.id)
    }, [props.match.params.id])

    return (
        <View style={{
            marginHorizontal: "auto",
            backgroundColor: RColors.background2,
            width: 100,
            height: 100,
            paddingHorizontal: 500,
            paddingVertical: 300,
        }}>
            User: {props.match.params.id}
        </View>
    )
}
