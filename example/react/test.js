'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  DrawerLayoutAndroid,
  ListView,
  TouchableNativeFeedback,
  TouchableHighlight,
  ToastAndroid,
  Platform
} = React;

var ToolbarAndroid = require('ToolbarAndroid');
var SwitchAndroid = require('SwitchAndroid');
var ProgressBar = require('ProgressBarAndroid');
var TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
}


var TestPage = React.createClass({

   getInitialState : function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            eventSwitchIsOn: false,
        };  
  },
  
  _switchChange: function(value){
      // ToastAndroid.show('开关' + val, ToastAndroid.SHORT);
      console.log(value);
      this.setState({eventSwitchIsOn: value})
  },
  
  
  render: function() {
    return (
       <View style={{flex:1}}> 
            <View style={styles.container}>
                <SwitchAndroid
                    //onValueChange={(value) => this.setState({eventSwitchIsOn: value})}
                    onValueChange={this._switchChange}
                    style={{marginBottom: 10}}
                    value={this.state.eventSwitchIsOn} />
                <Text>{this.state.eventSwitchIsOn ? 'On' : 'Off'}</Text>
            </View>
             <View style={{flex:1}}> 
               <TouchableElement style={{flux:1}} onPress={() => ToastAndroid.show('click' , ToastAndroid.SHORT) }>
                    <View><Text>{'Click Me'}</Text></View>
                </TouchableElement>
             </View>
       </View>
    );
     //      <ListView  dataSource={this.state.dataSource}   renderRow={(rowData) => <Text>{rowData}</Text>} />
      // <ProgressBar styleAttr="Large" />
  }
  
});

var toolbarActions = [
  {title: 'Create',  show: 'always'},
  {title: 'Settings', show: 'always'},
];


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'red'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
   pic: {
        width:100,
        height:100,
    },
   toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
});


module.exports = TestPage;