import React, { useState, Fragment, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Dimensions, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconText from '../components/IconText';
import { Modal, Portal, Provider, Snackbar, FAB } from 'react-native-paper';
import * as restService from '../services/RestService'

export default function Home(props) {

    const [bugText, setBugText] = useState('');

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#5e4eb9', borderRadius: 30 }}>
                
                <View style={styles.footer}>
                    <Text style={styles.header}>
                        Home
                    </Text>
                </View>

                <View style={styles.container}>
                    
                    <View style={{marginTop: -25, marginHorizontal: 15, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 6}}>
                         <Text style={{alignSelf: 'center', fontSize: 20, lineHeight: 40, color: '#5e4eb9', fontWeight:'bold'}}>Hello, {props.userInfo.firstName}</Text>   
                    </View>

                   
                   
                    <View style={{ marginTop: 25, padding: 10, marginHorizontal: 15, backgroundColor: "#FFFFFF", borderRadius: 20, flexDirection: "column", justifyContent: "center", alignItems: "center", shadowOffset: { width: 10, height: 10 }, shadowColor: "black", shadowOpacity: 2, elevation: 6 }}>
                        <Image style={{ width: 70, height: 70, alignSelf: 'center', borderRadius:40, marginBottom:10 }} source={{ uri: props.userInfo.profilePicture }} />
                        <Text style={{ alignSelf: "center", fontSize: 18, fontWeight: "bold", color: '#5e4eb9', lineHeight:20 }}>{props.userInfo.firstName} {props.userInfo.lastName}</Text>
                        <Text style={{ alignSelf: "center", fontSize: 16, lineHeight:25 }}>{props.userInfo.title}</Text>
                        <Text style={{ alignSelf: "center", fontSize: 16, lineHeight:25 }}>{props.userInfo.emailAddress}</Text>
                    </View>

                    <View style={{ marginTop: 45, padding: 10, marginHorizontal: 15, backgroundColor: "#FFFFFF", borderRadius: 20, flexDirection: "column", alignItems: "center", shadowOffset: { width: 10, height: 10 }, shadowColor: "black", shadowOpacity: 2, elevation: 6 }}>
                        <Text style={{ alignSelf: "center", fontSize: 18, fontWeight:'bold', lineHeight:25, marginBottom:5, color: '#5e4eb9' }}>Report an Bug</Text>
                        <Text style={{ alignSelf: "center", fontSize: 16, lineHeight:25, marginBottom:10 }}>We're eager to get feedback</Text>
                        <TextInput value={bugText} style={{ textAlignVertical: 'top', fontSize: 16, backgroundColor: '#F7F8FA', width:'100%', borderRadius:20, height:150}} placeholder={"this app is too perfect!"} multiline={true} onChangeText={text => setBugText(text)} />
                    </View>




                </View>

            </SafeAreaView>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 8,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    footer: {
        flex: 1.3,
        flexDirection: 'row',
        backgroundColor: '#5e4eb9',
        alignItems: 'center',
        justifyContent: "center",
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
	header: {
		textAlign: 'center',
		color: '#FFFFFF',
		fontSize: 32,
		fontWeight: 'bold',
		marginTop: -25
	}
});