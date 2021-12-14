import React, { useState, Fragment, useEffect, useRef, component } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Dimensions, Button, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { set } from "lodash";
import { Modal, Portal, Provider, FAB } from "react-native-paper";
import * as restService from "../services/RestService"




const ClubListItem = (props) => {
    const clubColors = ["#FF3F71", "#f8b963", "#ec5bbf", "#5e4eb9"];
    return (
        <TouchableOpacity style={{ padding: 10, marginLeft: 12, marginBottom: 2, height: 40, width: 100, backgroundColor: clubColors[props.club.id % clubColors.length], textAlign: "center", justifyContent: "center", alignItems:'center', borderRadius: 20, flexDirection: "column", shadowOffset: { width: 10, height: 10 }, shadowColor: "black", shadowOpacity: 2, elevation: 6 }} onPress={() => { props.setSelectedClubIndex(props.index) }}>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold", alignSelf: "center" }}>{props.club.name}</Text>
        </TouchableOpacity>
    )
}

const ClubRosterItem = (props) => {
    return (
        <View style={{alignSelf:'center', flexDirection:'row', alignContent:'center', marginBottom: 10, borderRadius: 10, width:300, height:50}}>
            <Image style={{ width: 50, height: 50, alignSelf: 'center', borderRadius: 50, marginRight: 10 }} source={{ uri: props.member.image }} />
            <View style={{flexDirection:'column'}}>
                <Text style={{fontSize:18, lineHeight:30, alignSelf:'center'}}>{props.member.name}</Text>
                <Text style={{fontSize:14, lineHeight:20}}>{props.member.position}</Text>
            </View>
        </View>
    )
}




export default function Activity() {

    const [clubs, setClubs] = useState([]);
    const [selectedClubIndex, setSelectedClubIndex] = useState(0);
    const clubsFlatListRef = useRef(null)

    getActivities = () => {
        restService.getActivities("1").then(response => {
            setClubs(response);
        });
    }

    useEffect(() => {
        getActivities();
    }, []);


    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: "#FFFFFF" }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#5e4eb9", borderRadius: 30 }}>
                <View style={styles.footer}>
                    <Text style={styles.header}>
                        {"Teams & Clubs"}
                    </Text>
                </View>

                <View style={styles.container}>

                    <View style={{ marginTop: -25, padding: 10, marginHorizontal: 15, backgroundColor: "#FFFFFF", borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", shadowOffset: { width: 10, height: 10 }, shadowColor: "black", shadowOpacity: 2, elevation: 6 }}>
                        {clubs.length > 0 &&
                            <View style={{ flexDirection: "row" }}>
                                <FlatList
                                    data={clubs}
                                    horizontal={true}
                                    ref={clubsFlatListRef}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (<ClubListItem club={item} index={index} clubIndex={selectedClubIndex} setSelectedClubIndex={setSelectedClubIndex} />)
                                    }}
                                    keyExtractor={id => id}
                                    contentContainerStyle={{
                                    }}
                                />
                            </View>}
                    </View>



                    {clubs.length > 0 && <View style={{ marginTop: 25, padding: 10, marginHorizontal: 15, backgroundColor: "#FFFFFF", borderRadius: 20, flexDirection: "column", justifyContent: "center", alignItems: "center", shadowOffset: { width: 10, height: 10 }, shadowColor: "black", shadowOpacity: 2, elevation: 6 }}>
                        <Image style={{ width: 80, height: 80, resizeMode: 'contain', alignSelf: 'center' }} source={{ uri: clubs[selectedClubIndex].image }} />
                        <Text style={{ alignSelf: "center", fontSize: 22, fontWeight: "bold" }}>{clubs[selectedClubIndex].name}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column', marginRight: 40 }}>
                                <Text style={{ fontSize: 14, color: '#555555', fontWeight: 'bold', marginTop: 10, alignSelf: 'center' }}>Season</Text>
                                <Text style={{ alignSelf: "center", fontSize: 18, fontWeight: "bold", color: '#5e4eb9' }}>{clubs[selectedClubIndex].season}</Text>
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 14, color: '#555555', fontWeight: 'bold', marginTop: 10, alignSelf: 'center' }}>Time</Text>
                                <Text style={{ alignSelf: "center", fontSize: 18, fontWeight: "bold", color: '#5e4eb9' }}>2:30 - 5:30</Text>
                            </View>
                        </View>

                        <Text style={{ fontSize: 14, color: '#555555', fontWeight: 'bold', marginTop: 15 }}>Meeting Days</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            {['M', 'T', 'W', 'Th', 'F'].map((day) => {
                                return (
                                    <View style={clubs[selectedClubIndex]['days'][day] ? styles.modalDayBtnSelected : styles.modalDayBtn}>
                                        <Text style={clubs[selectedClubIndex]['days'][day] ? styles.modalDayBtnTxtSelected : styles.modalDayBtnTxt}>{day}</Text>
                                    </View>
                                )
                            })}
                        </View>

                    </View>}

                    {clubs.length > 0 && <View style={{ marginTop: 20, height:230, padding: 0, marginHorizontal: 15, backgroundColor: "#FFFFFF", borderRadius: 20, flexDirection: "column", alignItems: "center", shadowOffset: { width: 10, height: 10 }, shadowColor: "black", shadowOpacity: 2, elevation: 6 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', padding:5 }}>Roster</Text>

                        <View style={{ flexDirection: "column", maxHeight:180 }}>
                            <FlatList
                                data={clubs[selectedClubIndex].members}
                                renderItem={({ item, index }) => {
                                    return (<ClubRosterItem member={item} index={index} />)
                                }}
                                keyExtractor={id => id}
                                contentContainerStyle={{
                                    // flexGrow: 1
                                }}

                            />

                        </View>
                    </View>}
                </View>


            </SafeAreaView>
            <SafeAreaView style={{ flex: 0, backgroundColor: "#FFFFFF" }} />
        </Fragment>
    );
}

const styles = StyleSheet.create({


    container: {
        flex: 8,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    footer: {
        flex: 1.3,
        flexDirection: "row",
        backgroundColor: "#5e4eb9",
        alignItems: "center",
        justifyContent: "center",
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    header: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "bold",
        marginTop: -25
    },


    modalDayBtnSelected: { 'backgroundColor': '#5e4eb9', borderColor: '#5e4eb9', borderWidth: 2, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    modalDayBtn: { 'backgroundColor': '#FFFFFF', borderColor: '#5e4eb9', borderWidth: 2, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    modalDayBtnTxt: { color: '#5e4eb9', alignSelf: 'center', fontSize: 16, fontWeight: 'bold' },
    modalDayBtnTxtSelected: { color: '#FFFFFF', alignSelf: 'center', fontSize: 16, fontWeight: 'bold' }

});
