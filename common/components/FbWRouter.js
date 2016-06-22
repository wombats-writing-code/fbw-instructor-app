// FbWRouter.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Modal,
  Reducer,
  Router,
  Scene
} from 'react-native-router-flux';

var Error = require('./error/Error');
var Login = require('./login/D2LLogin');
var Missions = require('./missions/MissionsManager');


var createReducer = (params) => {
  return (state, action) => {
    return Reducer(params)(state, action);
  }
}


class FbWRouter extends Component {
  constructor(props) {
    super (props);
    this.state = {
    };
  }
  render() {
    return <Router createReducer={createReducer}>
      <Scene key="modal" component={Modal} >
        <Scene key="root">
          <Scene component={Login}
                 initial={true}
                 key="login"
                 title="Fly-by-Wire Login" />
          <Scene component={Missions}
                 key="missions"
                 title="Mission Control"
                 type="reset" />
        </Scene>
        <Scene key="error" component={Error} title="Error!" />
      </Scene>
    </Router>;
  }
}

module.exports = FbWRouter;