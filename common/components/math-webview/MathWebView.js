// MathWebView

'use strict';

import React, {
    Component,
}  from 'react';
import {
  Dimensions,
  View,
  WebView,
  StyleSheet
} from "react-native";

var _ = require('lodash');

var credentials = require('../../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
// var WrapHTML = fbwUtils.WrapMathjax;
var wrapHTML = require('../../wrapHTML');
//var heightCalculate = require('../../heightCalculate');

var styles = StyleSheet.create({
  webViewStyle: {
    backgroundColor: 'transparent',
  }
});

// const webviewStyles = require('../../web')

class MathWebView extends Component {
  constructor(props) {
    super (props);  // props includes the mission / assessment

    this.state = {
      height: 0
    };
  }

  effectiveWidth() {
    let {height, width} = Dimensions.get('window');
    return width * .75;
  }

  rescaleImage() {
    // scales the image to fit the view. probably should refactor into a selector

    let newContent;
    if (this.props.content.indexOf('<img ') > -1) {
      // console.log('image content', this.props.content);

      let widthMatch = this.props.content.match(/width:(.*)px/)[0];
      let heightMatch = this.props.content.match(/height:(.*)px/)[0];
      let originalWidth = parseInt(widthMatch.replace('width:', ''), 10);
      let originalHeight = parseInt(heightMatch.replace('height:', ''), 10);


      let k = this.effectiveWidth() / originalWidth;
      let scaledWidth = Math.floor(originalWidth * k);        // important to prevent layout thrashing
      let scaledHeight = Math.floor(originalHeight * k);

      newContent = this.props.content.replace(/width:(.*?)px/, 'width:' + scaledWidth + 'px');
      newContent = newContent.replace(/height:(.*)px(?=;)/, 'height:' + scaledHeight + 'px');
      // console.log('replaced height:', newContent);

    } else {
      newContent = this.props.content;
    }

    return newContent
  }

  // componentDidMount() {
  //   // we need to adjust height after the component has rendered once,
  //   // because of MathJax
  //
  //   // remember to use the rescaled image's height
  //   let newContent = this.rescaleImage();
  //   // font size of assessment is pegged to a static 14
  //   let {height, width} = Dimensions.get('window');
  //   let requiredHeight = heightCalculate(newContent, 16, this.effectiveWidth());
  //
  //   // requiredHeight = 0;
  //
  //   console.log('setting new height in componentDidMount')
  //   this.setState({
  //     height: requiredHeight
  //   });
  //
  //   if (this.props.onHeightCalculate) {
  //     this.props.onHeightCalculate(requiredHeight);
  //   }
  // }

  // because we might need to call TouchableHighlight on this custom element
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    // source={{html: WrapHTML(this.props.content)}}
    //automaticallyAdjustContentInsets={false}
    //  contentInset={{top: -15}}

    let newContent = this.rescaleImage();
    // console.log('newContent', newContent);

    return (
      <View ref={component => this._root = component}>
        <WebView contentInset={{top: 0}}
                 javascriptEnabled={true}
                 injectedJavaScript={credentials.MathJaxConfig}
                 onNavigationStateChange={this._updateWebViewNavState}
                 scrollEnabled={false}
                 source={{html: wrapHTML(newContent, null, credentials.MathJaxURL)}}
                 style={[this.props.style, styles.webViewStyle, {height: this.state.height }]}
                 />
      </View>

    )
  }

  _updateWebViewNavState = (navState) => {
    console.log('navigationStateChange', navState.title);

    if (navState.title) {
      let height = parseInt(navState.title);
      console.log('setting new state in updatewebviewnav', height);
      this.setState({ height: height});

      if (this.props.setHeightCallback) {
        this.props.setHeightCallback(height);
      }
    }
  }
}

module.exports = MathWebView;
