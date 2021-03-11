/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";

import "./App.scss";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import { store } from "store";
import { connect, Provider } from "react-redux";
import SignInSide from "views/Auth/Login";
import Error404 from "views/Common/Error404";

const hist = createBrowserHistory();

const mapStateToProps = (state) => {
  return {
    user: state.userReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

const App = connect(mapStateToProps, mapDispatchToProps)((props) => {
  useEffect(() => {
    if (!props.user?.isAuthenticated) {
      // debugger;
      hist.replace('/login')
    }else{
      hist.replace('/admin')
    }
  }, [props.user])

  // console.log(props.user?.isAuthenticated );
  return (
    <Router history={hist}>
      {
        // props.user?.isAuthenticated ?
          <Switch>
            <Route path="/login" component={SignInSide} />
            <Route path="/admin" component={Admin} />
            <Route path="/rtl" component={RTL} />
            {/* <Route path="/" exact component={Admin} /> */}
            <Redirect exact from="/" to="/admin/dashboard" />
            <Route component={Error404} />
          </Switch>
          // :
          // <Switch>
          //   <Route path="/login" component={SignInSide} />
          //   {/* <Route path="/" component={SignInSide} /> */}
          //   <Redirect from="/" to="/login" />
          // </Switch>
      }
    </Router>
  )
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById("root")
);
