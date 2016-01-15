/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  DrawerLayoutAndroid,
  Dimensions,
  ToastAndroid,
  ToolbarAndroid
} = React;

var TestPage = require("./test")
//var Drawer = require('react-native-drawer');
var Animated = require('Animated');
var WINDOW_WIDTH = Dimensions.get('window').width;
var DRAWER_REF = 'drawer';

var toolbarActions = [
  {title: '提醒', icon: require('./ic_message_white.png'), show: 'always'},
  //{title: '夜间模式', show: 'never'},
  //{title: '设置选项', show: 'never'},
];


var AwesomeProject = React.createClass({
    getInitialState : function() {
       return {
            searchString: 'xx'
        };
    },
    onSearchTextChanged(event) {
        console.log('onSearchTextChanged');
        this.setState({ searchString: event.nativeEvent.text });
        console.log(this.state.searchString);
     },
  render2: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Hello React
        </Text>
         <Image style={styles.pic} source={{uri: 'https://avatars3.githubusercontent.com/u/6133685?v=3&s=460'}}>
         </Image>
         <TestPage text="params"></TestPage>
      </View>
    );
  },
  render: function() {
    // 创建抽屉栏需要显示的内容
    var navigationView = (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 20, fontSize: 20,backgroundColor: "red", textAlign: 'left'}}>First drawer</Text>
        <Text style={{margin: 20, fontSize: 20,backgroundColor: "blue", textAlign: 'left'}}>Second drawer</Text>
        </View>
    );
    return (
        <View style={{flex: 1}}>
            <DrawerLayoutAndroid
                    ref={DRAWER_REF}
                    drawerWidth={WINDOW_WIDTH} //抽屉组件的宽度
                    drawerPosition={DrawerLayoutAndroid.positions.Left}  //指定弹出的方向
                    // 通过renderNavigationView方法渲染一个抽屉组件，其内容就是显示主视图
                    renderNavigationView={() => navigationView}>
                    <View style={{flex: 1, flexDirection: 'column',   backgroundColor: '#FAFAFA'}}>
                        <ToolbarAndroid
                                navIcon= {require('./ic_menu_white.png')}
                                title="Title"
                                titleColor="white"
                                style={styles.toolbar}
                                actions={toolbarActions}
                                onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}
                                onActionSelected={this._onActionSelected} />

                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
                                <TextInput
                                    style={styles.searchInput}
                                    value={this.state.searchString}
                                    onChange={this.onSearchTextChanged.bind(this)}
                                    placeholder='Search via name or postcode'/>
                            </View>
                    </View>
              </DrawerLayoutAndroid>
        </View>
    );
  },
   _onActionSelected: function(position) {
    ToastAndroid.show('Selected ' + toolbarActions[position].title, ToastAndroid.SHORT);
  },


});

var styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#00a2ed',
    height: 56,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
