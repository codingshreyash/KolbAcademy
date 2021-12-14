import React, { useState, Fragment, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Dimensions, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconText from '../components/IconText';
import { Modal, Portal, Provider, Snackbar, FAB } from 'react-native-paper';
import * as restService from '../services/RestService'

export default function Schedule(props) {
    const [selectedDay, setSelectedDay] = useState('M');
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const courseColors = ['#FF3F71', '#f8b963', '#ec5bbf', '#5e4eb9'];

    const newCourseTemplate = {
        "id": "Add New Course",
        "name": "",
        "location": "",
        "period": "",
        "days": {"M": false, "T": false, "W": false, "Th": false, "F": false},
        "teacherName": "",
        "icon": "add",
    }

    const [coursesList, setCoursesList] = useState([newCourseTemplate]);
    const [selectedCourse, setSelectedCourse] = useState(coursesList[0]);
    const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
    const [courseSchedule, setCourseSchedule] = useState([[], [], [], [], []]);
    const coursesFlatListRef = useRef(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [inEditMode, setInEditMode] = useState(false);
    const [inNewMode, setInNewMode] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    getCourses = () => {
        restService.getCourses(props.userInfo.clientId).then(response => {
            setCoursesList(response);
        });
    }

    updateSelectedCourseAttribute = (value) => {
        setSelectedCourse({ ...selectedCourse, ['name']: value });
        console.log(selectedCourse);
    }

    const CustomTextInput = ({ value, style, editable, attribute }) => {
        const [currentValue, setCurrentValue] = useState(`${value}`);
        return (
            <TextInput
            style={style}
              value={currentValue}
              editable={editable}
              onChangeText={v => setCurrentValue(v)}
              onEndEditing={() => {
                  tempCoursesList = [...coursesList];
                  for(var i = 0; i < tempCoursesList.length; i++) {
                      if(tempCoursesList[i].id === selectedCourse.id) {
                          tempCoursesList[i][attribute] = currentValue;
                          break;
                      }
                  }
                  setCoursesList(tempCoursesList);
              }}
            />
        );
    };


    function ScheduleModal() {
        return (
            <Portal>
                <Modal visible={modalVisible} onDismiss={setModalVisible} contentContainerStyle={styles.modal}>
                    <TouchableOpacity style={{position: 'absolute', right: 0, top:0, marginRight: 12, marginTop: 12, borderRadius:10, borderWidth: 1, padding: 7, borderColor:'#FF0000', width: 140, alignItems: 'center', justifyContent: 'center'}} onPress={() => {setModalVisible(false); setInEditMode(false); setInNewMode(false); }}>
                        <Text style={{color: '#FF0000', alignSelf: 'center', fontWeight: 'bold', fontSize: 16}}>{inEditMode||inNewMode ? 'Discard Changes' : 'Close Window'}</Text>
                    </TouchableOpacity>
                    <Text style={{marginTop: '10%', fontSize: 28, fontWeight: 'bold', marginLeft: 20}}>Courses</Text>
                
                <View style={{paddingVertical: 5, flexDirection: 'row'}}>
                    <FlatList
                            data={[newCourseTemplate, ...coursesList]}
                            horizontal={true}
                            ref={coursesFlatListRef}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                if (index === 0) {
                                    return (
                                        <TouchableOpacity style={{...styles.modalCourse, backgroundColor: '#86C296'}} onPress={() => { 
                                            setInNewMode(true);
                                            setCoursesList([item, ...coursesList]);
                                            setSelectedCourse(item);
                                            setSelectedCourseIndex(0);
                                        }}>
                                            <Icon name={item.icon} color="#FFFFFF" size={40} />
                                            <Text style={{alignSelf: 'center', fontSize: 12, color: '#FFFFFF', fontWeight: 'bold', marginTop: 5}}>{item.id}</Text>
                                        </TouchableOpacity>
                                    )
                                }

                                else if (index > 0) {
                                    return (
                                        <TouchableOpacity style={selectedCourse.id === item.id ? {...styles.modalCourse, backgroundColor: courseColors[index%courseColors.length]} : {...styles.modalCourse, backgroundColor: courseColors[index%courseColors.length]}} onPress={() => { console.log(selectedCourseIndex); setSelectedCourse(item); setSelectedCourseIndex(index-1); coursesFlatListRef.current.scrollToItem({animated:true, item:selectedCourse });   }}>
                                            <Icon name={item.icon} color="#FFFFFF" size={40} />
                                            <Text style={{alignSelf: 'center', fontSize: 12, color: '#FFFFFF', fontWeight: 'bold', marginTop: 5}}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                
                            }}
                            keyExtractor={id => id}
                            contentContainerStyle={{
                                flexGrow: 1,
                            }}   
                    />
                </View>

                <View style={{marginTop: 10}}>


                    <View style={{marginHorizontal: 30, marginVertical: 10}}>
                        <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Course Name</Text>
                        <CustomTextInput attribute='name' value={selectedCourse.name} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                    </View>

                    <View style={{marginVertical: 20, marginHorizontal: 30}}>
                        <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Meeting Days</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#F7F8FA', borderRadius: 10, padding: 10}}>
                            {['M', 'T', 'W', 'Th', 'F'].map((day)=>{
                                return (
                                    <TouchableOpacity 
                                    style={{...(selectedCourse.days[day] ? styles.modalDayBtnSelected : styles.modalDayBtn), opacity: (inEditMode||inNewMode) ? 1 : 0.75}}
                                    disabled={!inEditMode && !inNewMode}
                                    onPress={() => {
                                            tempCoursesList = []
                                            for (let i = 0; i < coursesList.length; i++) {
                                                    if(coursesList[i].id === selectedCourse.id) {
                                                        tempSelectedCourse = {...selectedCourse}
                                                        tempSelectedCourse.days[day] = !selectedCourse.days[day]
                                                        setSelectedCourse(tempSelectedCourse)
                                                        tempCoursesList.push(tempSelectedCourse)
                                                    } else {
                                                        tempCoursesList.push(coursesList[i])
                                                    }
                                            }
                                            setCoursesList(tempCoursesList)
                                            console.log(selectedCourse.days)
                                        }
                                    }>
                                        <Text style={selectedCourse.days[day] ? styles.modalDayBtnTxtSelected : styles.modalDayBtnTxt}>{day}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>

                    <View style={{marginHorizontal: 30, marginVertical: 10}}>
                        <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Course Instructor</Text>
                        <CustomTextInput attribute='teacherName' value={selectedCourse.teacherName} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{marginHorizontal: 30, marginVertical: 10, width: '33%'}}>
                        <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Period</Text>
                        <CustomTextInput attribute='period' value={selectedCourse.period} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                    </View>
                    <View style={{marginHorizontal: 30, marginVertical: 10, width: '33%'}}>
                        <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Room Number</Text>
                        <CustomTextInput attribute='location' value={selectedCourse.location} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                    </View>
                    </View>

                    <TouchableOpacity style={{backgroundColor: '#5e4eb9', borderRadius: 10, alignSelf:'center', padding: 13, alignContent: 'center', justifyContent: 'center', marginVertical: 0}} onPress={()=> {
                        if (inEditMode || inNewMode) {
                            console.log(157)
                            restService.setCourses(props.userInfo.clientId, coursesList).then((resp) => {
                                console.log('resp')
                                console.log(resp)
                                restService.getSchedule(props.userInfo.clientId).then(response => {
                                    setModalVisible(false);
                                    setInEditMode(false);
                                    setInNewMode(false)
                                    setToastVisible(true)
                                    setCourseSchedule(response);
                                }).catch(err2 => {
                                    console.log(err2)
                                });
                            }).catch(err => {
                                console.log(err)
                            });
                        } else {
                            setInEditMode(true);
                        }
                    }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', alignSelf:'center'}}>{inEditMode || inNewMode ? 'Save Changes' : 'Edit Course Details'}</Text>
                    </TouchableOpacity>
                </View>
                </Modal>
            </Portal>
        );   
    }

    getSchedule = () => {
        restService.getSchedule(props.userInfo.clientId).then(response => {
            setCourseSchedule(response);
        });
    }

    useEffect(() => {
        getSchedule();
    }, []);
    
    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#5e4eb9', borderRadius: 30 }}>
            <Provider>
                <View style={styles.footer}>
                    <Text style={styles.header}>
                        Schedule
                    </Text>
                </View>

                
                <View style={styles.container}>
                    <View style={{marginTop: -25, marginHorizontal:15, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 10, flexDirection: 'row',  justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 6}}>
                            <TouchableOpacity style={selectedDay === 'M' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('M'); setSelectedDayIndex(0)}}><Text style={selectedDay === 'M' ? styles.dayBtnTextSelected : styles.dayBtnText}>M</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'T' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('T'); setSelectedDayIndex(1)}}><Text style={selectedDay === 'T' ? styles.dayBtnTextSelected : styles.dayBtnText}>T</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'W' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('W'); setSelectedDayIndex(2)}}><Text style={selectedDay === 'W' ? styles.dayBtnTextSelected : styles.dayBtnText}>W</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'Th' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('Th'); setSelectedDayIndex(3)}}><Text style={selectedDay === 'Th' ? styles.dayBtnTextSelected : styles.dayBtnText}>Th</Text></TouchableOpacity>
                            <TouchableOpacity style={selectedDay === 'F' ? styles.dayBtnSelected: styles.dayBtn} onPress={()=>{setSelectedDay('F'); setSelectedDayIndex(4)}}><Text style={selectedDay === 'F' ? styles.dayBtnTextSelected : styles.dayBtnText}>F</Text></TouchableOpacity>
                    </View>

                    
                    <ScrollView>
                        {courseSchedule[selectedDayIndex].length > 0 && <FlatList
                            data={courseSchedule[selectedDayIndex]}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ backgroundColor: '#FFFFFF', width: 350, height: 110, marginVertical: 10, borderRadius: 10, alignSelf: 'center', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 6 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flexDirection: 'column', borderRightWidth: 2, borderRightColor: '#F7C552', justifyContent: 'center', alignItems:'center', width: 95 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.startTime}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', marginTop: 10 }}>{item.endTime}</Text>
                                            </View>
                                            <View style={{}}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginVertical: 10 }}>{item.name}</Text>
                                                <IconText style={{ marginLeft: 20, marginVertical: 3 }} iconName='room' iconColor='#FE625F' iconSize={25} color='#5e6899' textStyle={{ marginHorizontal: 1, fontSize: 16 }} text={item.location}></IconText>
                                                <IconText style={{ marginLeft: 20, marginVertical: 3 }} iconName='person' iconColor='#FE625F' iconSize={25} color='#5e6899' textStyle={{ marginHorizontal: 1, fontSize: 16 }} text={item.teacherName}></IconText>
                                            </View>

                                            <View style={{ flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 10, position: 'absolute', right: 0, bottom: 0, margin: 10 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Period</Text>
                                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FE625F', marginTop: 3, alignSelf: 'center' }}>{item.period}</Text>

                                              

                                            </View>
                                        </View>
                                    </View>

                                )
                            }}
                            keyExtractor={period => period}
                            contentContainerStyle={{
                                flexGrow: 1,
                                marginTop: 20
                            }}
                        />}
                    </ScrollView>


                    {courseSchedule[selectedDayIndex].length === 0 && 
                        <View style={{width: '100%', height:'100%', alignContent: 'center', justifyContent: 'center'}}>
                            <Text style={{alignSelf: 'center', fontSize: 22, lineHeight: 30, fontWeight: 'bold'}}>No classes today!</Text>
                            <Text style={{alignSelf: 'center', fontSize: 18, lineHeight: 30, fontWeight: 'bold'}}> Click the pencil to edit your schedule</Text>
                        </View>
                    }

                    <FAB style={{width: 50, height: 50, textAlign: 'center', justifyContent: 'center', alignItems:'center', borderRadius: 60, backgroundColor: '#5e4eb9', position: 'absolute', right: 0, bottom: 0, marginRight: 10, marginBottom: 10}} animated={true} icon="pencil" onPress={() => {setModalVisible(true); getCourses();}}/>
                    <ScheduleModal></ScheduleModal>

                    
                </View>

                <Snackbar
				visible={toastVisible}
				onDismiss={() => setToastVisible(false)}
				duration={5000}
				style={styles.snackBar}>
				{'Changes Saved Successfully!'}
			</Snackbar>

                </Provider>

            </SafeAreaView>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
        </Fragment>
    );
}

const styles = StyleSheet.create({

    dayBtn: { 
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#5e4eb9',
        padding: 10,
        marginHorizontal: 9,
        width: 47,
        height: 47,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },

    dayBtnSelected: {
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#5e4eb9',
        padding: 10,
        marginHorizontal: 9,
        width: 47,
        height: 47,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5e4eb9'
    },

    dayBtnText: { 
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        color: '#5e4eb9'
    },

    dayBtnTextSelected: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        color: '#FFFFFF'
    },

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
    modal: {
        borderRadius: 10,
        backgroundColor: 'white',
        flex: 1,
        margin: 10,
        justifyContent: 'flex-start',
    },

    modalCourse: {
        marginTop: 10,
        marginVertical:5,
        marginHorizontal: 10,
        borderRadius: 20,
        width: 120, height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign:'center',
        padding: 10,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 2,
        elevation: 6
    },

    modalCourseSelected: {
        marginTop: 10,
        marginVertical:5,
        marginHorizontal: 10,
        borderRadius: 20,
        width: 180, height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign:'center',
        padding: 10,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 2,
        elevation: 6
    },

    snackBar: {
        backgroundColor: '#5e4eb9'
    },

    modalDayBtnSelected: {
        backgroundColor: '#5e4eb9',
        borderColor: '#5e4eb9',
        borderWidth: 2,
        width: 35, height: 35,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25
    },
    
    modalDayBtn: { 
        backgroundColor: '#FFFFFF',
        borderColor: '#5e4eb9',
        borderWidth: 2,
        width: 35,
        height: 35,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25
    },
    
    modalDayBtnTxt: {
        color: '#5e4eb9',
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold' 
    },

    modalDayBtnTxtSelected: { 
        color: '#FFFFFF',
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    }

});
