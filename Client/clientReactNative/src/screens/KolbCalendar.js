import React, { useState, Fragment, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Button, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import IconText from '../components/IconText';

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { set } from 'lodash';
import KolbCalendarModal from '../components/KolbCalendarModal';
import { Modal, Portal, Provider, Snackbar, FAB } from 'react-native-paper';
import * as restService from '../services/RestService';

export default function KolbCalendar() {
  const allMonths = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [month, setMonth] = useState(allMonths[1]);
  const [year, setYear] = useState(2021);
  const [selectedDate, setSelectedDate] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const eventColors = ['#FF3F71', '#f8b963', '#ec5bbf', '#5e4eb9'];
  const newEventTemplate = {
    "eventId": "",
    "name": "",
    "date":"",
    "categoryColor": "",
    "location": "",
    "startTime": "",
    "endTime": "",
    "organizer": "",
    "description": "",
    "link": ""
  }

  const [eventsList, setEventsList] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(newEventTemplate);
  const [modalVisible, setModalVisible] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [inNewMode, setInNewMode] = useState(false);

  const CustomTextInput = ({ value, style, editable, attribute }) => {
    const [currentValue, setCurrentValue] = useState(`${value}`);
    return (
        <TextInput
            style={style}
          value={currentValue}
          editable={editable}
          onChangeText={v => setCurrentValue(v)}
          onEndEditing={() => {

            if (inNewMode) {
              setSelectedEvent({ ...selectedEvent, [attribute]: currentValue });

            } else {
              tempEventsList = {...eventsList};
              for (let i=0; i<tempEventsList[selectedDate].length; i++) {
                  if (tempEventsList[selectedDate][i].eventId === selectedEvent.eventId) {
                      tempEventsList[selectedDate][i][attribute] = currentValue
                  }
              }
              setEventsList(tempEventsList)
            }




          }}
        />
    );
};










  function KolbCalendarModal() {
    return (
        <Portal>
            <Modal visible={modalVisible} onDismiss={setModalVisible} contentContainerStyle={styles.modal}>
                <TouchableOpacity style={{position: 'absolute', right: 0, top:0, marginRight: 12, marginTop: 12, borderRadius:10, borderWidth: 1, padding: 7, borderColor:'#FF0000', width: 140, alignItems: 'center', justifyContent: 'center'}} onPress={() => {setModalVisible(false); setInEditMode(false); setInNewMode(false); }}>
                    <Text style={{color: '#FF0000', alignSelf: 'center', fontWeight: 'bold', fontSize: 16}}>{inEditMode||inNewMode ? 'Discard Changes' : 'Close Window'}</Text>
                </TouchableOpacity>
                <Text style={{marginTop: '13%', fontSize: 28, fontWeight: 'bold', marginLeft: 20, maxWidth:300}}>{selectedEvent.name.length > 0 ? selectedEvent.name: 'New Event'}</Text>
            

            <View style={{marginTop: 10}}>


                <View style={{marginHorizontal: 30, marginVertical: 10}}>
                    <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Event Name</Text>
                    <CustomTextInput attribute='name' value={selectedEvent.name} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                </View>

                <View style={{marginHorizontal: 30, marginVertical: 10}}>
                    <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Organizer</Text>
                    <CustomTextInput attribute='organizer' value={selectedEvent.organizer} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                </View>

                <View style={{marginHorizontal: 30, marginVertical: 10}}>
                    <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Zoom Link</Text>
                    <CustomTextInput attribute='link' value={selectedEvent.link} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                </View>

                <View style={{marginHorizontal: 30, marginVertical: 10}}>
                    <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Location</Text>
                    <CustomTextInput attribute='location' value={selectedEvent.location} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{marginHorizontal: 30, marginVertical: 10, width: '33%'}}>
                    <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>Start Time</Text>
                    <CustomTextInput attribute='startTime' value={selectedEvent.startTime} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                </View>
                <View style={{marginHorizontal: 30, marginVertical: 10, width: '33%'}}>
                    <Text style={{fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold'}}>End Time</Text>
                    <CustomTextInput attribute='endTime' value={selectedEvent.endTime} style={{fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA'}} editable={inEditMode||inNewMode}/>
                </View>
                </View>

                <TouchableOpacity style={{backgroundColor: '#5e4eb9', borderRadius: 10, alignSelf:'center', padding: 13, alignContent: 'center', justifyContent: 'center', marginVertical: 10}} onPress={()=> {
                    if (inEditMode || inNewMode) {
                        if (inNewMode) {
                            let tempEventsList = Object.keys(eventsList).includes(selectedDate) ? {...eventsList, [selectedDate]: [...eventsList[selectedDate], selectedEvent]} : {...eventsList, [selectedDate]: [selectedEvent]}
                            setEventsList({...eventsList, [selectedDate]: [selectedEvent]});
                            console.log('MARk')
                            console.log({...eventsList, [selectedDate]: [selectedEvent]})
                            console.log(eventsList[selectedDate])
                        }
                        restService.insertEvents(eventsList).then((resp) => {
                            console.log('resp')
                            console.log(resp)
                            setModalVisible(false)
                            setToastVisible(true)
                            setInEditMode(false)
                            setInNewMode(false)
                        }).catch(err => {
                            console.log(err)
                        });
                    } else {
                        setInEditMode(true);
                    }
                }}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', alignSelf:'center'}}>{inEditMode || inNewMode ? 'Save Changes' : 'Edit Event Details'}</Text>
                </TouchableOpacity>
            </View>
            </Modal>
        </Portal>
    );   
}













































  getEvents = () => {
    restService.getEvents().then(response => {
        console.log(response)
        setEventsList(response);
        console.log(eventsList.length)
    });
  }

  useEffect(() => {
    getEvents();
  }, []);




  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Provider>
        <View style={styles.footer}>
          <Text style={styles.header}>
            Calendar
          </Text>
        </View>



        <View style={styles.container}>



          <View style={{ marginTop: -25, marginHorizontal: 15, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 6 }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, lineHeight: 40, color: '#5e4eb9' }}>{month} {year}</Text>


          </View>










          
            <Agenda style={{ borderRadius: 30 }}
              items={eventsList}
              // Callback that gets called when items for a certain month should be loaded (month became visible)
              loadItemsForMonth={(month) => {
                console.log(month)
                setSelectedDate(month.dateString)
                console.log('selectedDate is ' + selectedDate)
                setMonth(allMonths[month.month])
                setYear(month.year)
              }}
              // Initially selected day
              selected={"" + (new Date().getFullYear()) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()}
              minDate={'2000-01-01'}
              maxDate={'2031-12-31'}
              pastScrollRange={400}
              onDayChange={(day) => {console.log('day changed to ' + day)}}
              // Initially selected day
              futureScrollRange={400}
              // Specify how each item should be rendered in agenda
              renderItem={(item, firstItemInDay) => {
                return (
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40 }} onPress={() => { setSelectedEvent(item); setSelectedDate(item.date); console.log(Object.keys(eventsList).length === 0); setModalVisible(true); }}>
                    <View style={{ flexDirection: 'column', backgroundColor: item.categoryColor, padding: 10, borderRadius: 10, width: '85%', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 4 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16, lineHeight: 30 }}>{item.name}</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <IconText style={{ marginRight: 10 }} iconName='watch-later' iconSize={20} color='#5e6899' textStyle={{}} text={item.startTime + ' - ' + item.endTime}></IconText>
                        <IconText iconName='room' iconSize={20} color='#5e6899' textStyle={{}} text={item.location}></IconText>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
              renderEmptyData={() => {
                return (
                  <View style={{ alignContent: 'center', justifyContent: 'center', height: '100%' }}>
                    <Text style={{ fontSize: 20, lineHeight: 40, color: '#5e6899', alignSelf: 'center' }}>No Events Today!</Text>
                  </View>
                );
              }}
              showClosingKnob={true}
            />

            {Object.keys(eventsList).length > 0 && <KolbCalendarModal />}
          
         <Snackbar
				visible={toastVisible}
				onDismiss={() => setToastVisible(false)}
				duration={5000}
				style={styles.snackBar}>
				{'Changes Saved Successfully!'}
			</Snackbar>

      <FAB style={{width: 50, height: 50, textAlign: 'center', justifyContent: 'center', alignItems:'center', borderRadius: 60, backgroundColor: '#5e4eb9', position: 'absolute', right: 0, bottom: 0, marginRight: 10, marginBottom: 10}} animated={true} icon="plus" onPress={() => {setSelectedEvent({...newEventTemplate}); setInNewMode(true); setModalVisible(true)}}/>

        </View>
        </Provider>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
    </Fragment>
  );
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
    marginTop: -20
  },

  modal: {
    borderRadius: 10,
    backgroundColor: 'white',
    flex: 1,
    margin: 10,
    justifyContent: 'flex-start',
},
snackBar: {
  backgroundColor: '#5e4eb9'
}

});
