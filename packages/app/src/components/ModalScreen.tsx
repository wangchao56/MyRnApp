import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {observer} from 'mobx-react-lite';
import {View, Pressable, Button} from 'react-native';

function CustomModalScreen({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* 半透明遮罩 */}
      <Pressable style={StyleSheet.absoluteFill} onPress={navigation.goBack}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} />
      </Pressable>

      {/* 弹窗内容 */}
      <View
        style={{
          width: 300,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 12,
        }}>
        <Text>这是一个自定义弹窗</Text>
        <Button title="关闭" onPress={navigation.goBack} />
      </View>
    </View>
  );
}

export const ModalScreen = observer(CustomModalScreen);
