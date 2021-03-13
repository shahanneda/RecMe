import * as React from "React";

type CreateAccountProps = {
    url: string;
};
type CreateAccountState = {
    count: number; // like this
};
class CreateAccount extends React.Component<CreateAccountProps, CreateAccountState> {
    state: CreateAccountState = {
        // optional second annotation for better type inference
        count: 0,
    };
    render() {
        return (
            <div>
                {this.props.url} {this.state.count}
            </div>
        );
    }
}

export default CreateAccount;