import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import * as paths from '../routes/Paths.js';

// Route for redirecting not authorized users
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        sessionStorage.token == "" || sessionStorage.token == undefined ? (
          <Redirect to={paths.AUTH} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

export default PrivateRoute;