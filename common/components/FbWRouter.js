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
import {
  Actions
} from "react-native-router-flux";

var _ = require('lodash');

var credentials = require('../constants/credentials');

var UserStore = require('../stores/User');

var Error = require('./error/Error');
var InitializeQBank = require('./initialize/InitializeQBank');
var Loading = require('./loading/Loading');
if (credentials.login == 'd2l') {
  var Login = require('./login/D2LLogin');
} else {
  var Login = require('./login/SimpleLogin');
}
var Missions = require('./missions/MissionsManager');


var createReducer = (params) => {
  return (state, action) => {
    return Reducer(params)(state, action);
  }
}

var styles = StyleSheet.create({
  navigationBarStyle: {
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
  },
  titleStyle: {
    color: '#555',
    fontWeight: "700",
    fontSize: 12
  }
});

class FbWRouter extends Component {
  constructor(props) {
    super (props);
    this.state = {
      showLogin: true
    };
  }
  componentDidMount() {
    this.checkUserState();
  }
  checkUserState() {
    var _this = this;
    UserStore.hasSession(function (hasSession) {
      if (!hasSession) {
        Actions.login();
      } else {
        UserStore.setLMSUserId(hasSession.Identifier);
      }
    });
  }
  render() {
    var loginTitleStyle = _.assign({}, styles.titleStyle, {
      color: '#fff',
      fontWeight: "600",
      fontStyle: 'italic',
      marginTop: 42,
      fontSize: 21,
    });
    var loginNavBarStyle = _.assign({}, styles.navigationBarStyle, {
      paddingTop: 60,
      backgroundColor: '#FF6F69',
      borderBottomWidth: 0,
    });

    return <Router createReducer={createReducer}>
      <Scene key="modal" component={Modal} >
        <Scene key="root">
          <Scene component={Login}
                 key="login"
                 title="Fly-by-Wire"
                 titleStyle={loginTitleStyle}
                 navigationBarStyle={loginNavBarStyle} />
          <Scene component={Loading}
                 initial={true}
                 key="loading"
                 title="Loading ..."
                 type="reset"
                 titleStyle={loginTitleStyle}
                 navigationBarStyle={loginNavBarStyle} />
          <Scene component={Missions}
                 key="missions"
                 title="Mission Control"
                 type="reset"
                 titleStyle={loginTitleStyle}
                 navigationBarStyle={loginNavBarStyle}
                 hideNavBar={true} />
          <Scene component={InitializeQBank}
                key="initializeQbank"
                title="Initializing"
                type="reset"
                titleStyle={loginTitleStyle}
                navigationBarStyle={loginNavBarStyle} />
        </Scene>
        <Scene key="error" component={Error} title="Error!" />
      </Scene>
    </Router>;
  }
}

module.exports = FbWRouter;
