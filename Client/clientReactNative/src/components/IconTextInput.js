import React, { useState, Fragment, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Button, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';

export default function IconTextInput(props) {
    console.log(props)
    return (
        <View style={{...props.style, flexDirection: 'row'}}>
            <Icons style={{marginRight: 5, alignSelf: 'center'}} name={props.iconName} size={props.iconSize} color={props.iconColor}/>
            <TextInput style={props.textStyle} defaultValue={props.defaultText} editable={props.editable} onChangeText={(text) => {props.setText(text)}}/>
        </View>
    )

}