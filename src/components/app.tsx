import * as React from "react";
import {
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CreateAccount from "./CreateAccount";

interface appProps {
  url:string;
}
export const App = (props:appProps) => (
  <div>
    <HashRouter>
      <div>
        Welcome To RecMe!
        <Link to="/create-account">
          <button>create account</button>
        </Link>
        <Link to="/login">
          <button>login</button>
        </Link>
        <Switch>
          <Route path="/login">
            login
          </Route>
          <Route path="/create-account">
            <CreateAccount url={props.url} />
          </Route>
          <Route path="/">
          </Route>
        </Switch>
      </div>
    </HashRouter>
  </div>
);
