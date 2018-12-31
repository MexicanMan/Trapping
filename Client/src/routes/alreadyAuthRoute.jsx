import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import * as paths from './Paths.js';

// Route for redirecting already authorized users
function AlreadyAuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        sessionStorage.token != "" && sessionStorage.token != undefined ? (
          <Redirect to={paths.LOBBIES} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

export default AlreadyAuthRoute;