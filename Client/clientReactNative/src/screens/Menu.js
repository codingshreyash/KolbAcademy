import React, { useState, Fragment, useEffect, useRef, component } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Dimensions, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { set } from 'lodash';
import { Modal, Portal, Provider, FAB } from 'react-native-paper';
import * as restService from '../services/RestService'




const FoodItem = (props) => {
    return (
        <View style={{marginTop: 15, marginHorizontal:15, height:'auto', backgroundColor: '#FFFFFF', textAlign:'center', borderRadius: 20, paddingVertical: 10, paddingHorizontal:10, flexDirection: 'column', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 6}}>
            <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'center'}}>{props.foodName}</Text>
            <Text style={{alignSelf:'center', fontSize:16, marginTop:3, marginBottom: 5}}>{props.foodType}</Text>
            <View style={{flexDirection:'column'}}>
                <Image style={{width:100, height:100, marginRight:10, resizeMode:'contain', alignSelf:'center'}} source={{uri:props.foodImage}}/>
                    <View style={{flexDirection:'row', alignSelf:'center'}}>
                        <View style={{flexDirection:'column', marginRight:30}}>
                            <Text style={{fontSize:16, alignSelf:'center'}}>Protein</Text>
                            <Text style={{fontSize:18, alignSelf:'center', fontWeight:'bold'}}>{props.protein} gm</Text>
                        </View>

                        <View style={{flexDirection:'column', marginRight:30}}>
                            <Text style={{fontSize:16, alignSelf:'center'}}>Carbs</Text>
                            <Text style={{fontSize:18, alignSelf:'center', fontWeight:'bold'}}>{props.carbs} gm</Text>
                        </View>

                        <View style={{flexDirection:'column', marginRight:30}}>
                            <Text style={{fontSize:16, alignSelf:'center'}}>Fats</Text>
                            <Text style={{fontSize:18, alignSelf:'center', fontWeight:'bold'}}>{props.fats} gm</Text>
                        </View>
                    </View>
            </View>
        </View>
    )
}




export default function Menu() {
    const [selectedDay, setSelectedDay] = useState('M');

    const [menu, setMenu] = useState({});
 

    getMenu = () => {
        restService.getMenu("1").then(response => {
            setMenu(response);
        });
    }

    useEffect(() => {
        getMenu();
    }, []);
    

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#5e4eb9', borderRadius: 30 }}>
            <Provider>
                <View style={styles.footer}>
                    <Text style={styles.header}>
                        Menu
                    </Text>
                </View>

                <View style={styles.container}>
                    <View style={{marginTop: -25, marginHorizontal:15, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 10, flexDirection: 'row',  justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 6}}>
                            <TouchableOpacity style={selectedDay === 'M' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('M')}}><Text style={selectedDay === 'M' ? styles.dayBtnTextSelected : styles.dayBtnText}>M</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'T' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('T')}}><Text style={selectedDay === 'T' ? styles.dayBtnTextSelected : styles.dayBtnText}>T</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'W' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('W')}}><Text style={selectedDay === 'W' ? styles.dayBtnTextSelected : styles.dayBtnText}>W</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'Th' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('Th')}}><Text style={selectedDay === 'Th' ? styles.dayBtnTextSelected : styles.dayBtnText}>Th</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'F' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('F')}}><Text style={selectedDay === 'F' ? styles.dayBtnTextSelected : styles.dayBtnText}>F</Text></TouchableOpacity>
                    </View> 

                    {menu.hasOwnProperty("M") && <ScrollView>
                        <FoodItem foodName={menu[selectedDay].mainCourse.name} foodType='Main Course' foodImage={menu[selectedDay].mainCourse.image} protein={menu[selectedDay].mainCourse.protein} carbs={menu[selectedDay].mainCourse.carbs} fats={menu[selectedDay].mainCourse.fats}/>
                        <FoodItem foodName={menu[selectedDay].sideDish.name} foodType='Side Dish' foodImage={menu[selectedDay].sideDish.image} protein={menu[selectedDay].sideDish.protein} carbs={menu[selectedDay].sideDish.carbs} fats={menu[selectedDay].sideDish.fats}/>
                        <FoodItem foodName={menu[selectedDay].drink.name} foodType='Drink' foodImage={menu[selectedDay].drink.image} protein={menu[selectedDay].drink.protein} carbs={menu[selectedDay].drink.carbs} fats={menu[selectedDay].drink.fats}/>
                        <FoodItem foodName={menu[selectedDay].dessert.name} foodType='Dessert' foodImage={menu[selectedDay].dessert.image} protein={menu[selectedDay].dessert.protein} carbs={menu[selectedDay].dessert.carbs} fats={menu[selectedDay].dessert.fats}/>
                    </ScrollView>}                      

                </View>

            </Provider>
            </SafeAreaView>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
        </Fragment>
    );
}

const styles = StyleSheet.create({

    dayBtn: { borderRadius: 10, borderWidth: 1.5, borderColor: '#5e4eb9', padding: 10, marginHorizontal: 9, width: 47, height: 47, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
    dayBtnSelected: { borderRadius: 10, borderWidth: 1.5, borderColor: '#5e4eb9', padding: 10, marginHorizontal: 9, width: 47, height: 47, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5e4eb9' },
    dayBtnText: { fontSize: 16, fontWeight: 'bold', lineHeight: 20, color: '#5e4eb9' },
    dayBtnTextSelected: { fontSize: 16, fontWeight: 'bold', lineHeight: 20, color: '#FFFFFF' },

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
	},

});
