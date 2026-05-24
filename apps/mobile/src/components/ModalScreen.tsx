import React from 'react';
import {Text, StyleSheet, View, Pressable, Button} from 'react-native';
import {observer} from 'mobx-react-lite';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RouteType';

type ModalScreenProps = NativeStackScreenProps<RootStackParamList, 'MyModal'>;

function CustomModalScreen({navigation}: ModalScreenProps) {
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
