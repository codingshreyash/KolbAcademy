import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';
import IconTextInput from './IconTextInput';
import Icons from 'react-native-vector-icons/MaterialIcons';

export default function KolbCalendarModal(props) {
  console.log(props.selectedEvent)
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  // const [props.inReplyMode, props.setInReplyMode] = useState(false);


	return (
    <Portal>


      <Modal visible={props.visible} onDismiss={props.hideModal} contentContainerStyle={styles.modal}>
          <IconTextInput style={{marginBottom: 50}} iconName='dashboard' iconColor={props.selectedEvent.categoryColor} iconSize={25} color='#5e6899' textStyle={styles.title} defaultText={props.selectedEvent.name} text={name} setText={setName} editable={props.inEditMode}></IconTextInput>
          <IconTextInput style={{marginRight: 30}} iconName='watch-later' iconColor='black' iconSize={25} color='#5e6899' textStyle={{marginHorizontal: 5, fontSize: 16}} defaultText={props.selectedEvent.startTime + ' - ' + props.selectedEvent.endTime} text={time} setText={setTime} editable={props.inEditMode}></IconTextInput>
          <IconTextInput style={{marginTop: 30}} iconName='room' iconColor='black' iconSize={25} color='#5e6899' textStyle={{marginHorizontal: 5, fontSize: 16}} defaultText={props.selectedEvent.location} setText={setLocation} text={location} editable={props.inEditMode}></IconTextInput>
          <IconTextInput style={{marginTop: 30}} iconName='person' iconColor='black' iconSize={25} color='#5e6899' textStyle={{marginHorizontal: 5, fontSize: 16}} defaultText={props.selectedEvent.organizer} setText={setOrganizer} text={organizer} editable={props.inEditMode}></IconTextInput>
          <IconTextInput style={{marginTop: 30}} iconName='description' iconColor='black' iconSize={25} color='#5e6899' textStyle={{marginHorizontal: 10, fontSize: 16, lineHeight: 25}} defaultText={props.selectedEvent.description} text={description} setText={setDescription} editable={props.inEditMode}></IconTextInput>
          <IconTextInput style={{marginTop: 30}} iconName='videocam' iconColor='black' iconSize={25} color='#5e6899' textStyle={{marginHorizontal: 5, fontSize: 16}} defaultText={props.selectedEvent.link} setText={setLink} text={link} editable={props.inEditMode}></IconTextInput>
        <View style={{flexDirection: 'row', paddingTop: 45}}>
        <TouchableOpacity style={{borderWidth: 1, borderColor:'#007bff', width: '45%', borderRadius: 20, flexDirection: 'row', justifyContent: 'center', height: 40, marginRight: 15}} onPress={() => {props.setInEditMode(true)}} >
          <Icons style={{alignSelf: 'center'}} name={props.inEditMode ? 'save' : 'edit'} color='#007bff' size={30}/>
          <Text style={{fontSize: 16, fontWeight: 'bold', alignSelf: 'center'}}>{props.inEditMode ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{borderWidth: 1, borderColor:'#FF0000', width: '45%', borderRadius: 20, flexDirection: 'row', justifyContent: 'center', height: 40, right:0}} onPress={() => {
          if (props.inEditMode) {
            props.setInEditMode(false)
          }
        }} >
          <Icons style={{alignSelf: 'center', marginRight: 5}} name={props.inEditMode ? 'cancel' : 'delete'} color='#FF0000' size={27}/>
          <Text style={{fontSize: 16, fontWeight: 'bold', alignSelf: 'center'}}>{props.inEditMode ? 'Cancel' : 'Delete'}</Text>
        </TouchableOpacity>
        </View>



      </Modal>
    </Portal>		
	);
}


const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    backgroundColor: 'white',
    flex: 1,
    margin: 20,
    padding:20,
    justifyContent: 'flex-start',
  },
  title: {
		// textAlign: 'center',
    // marginBottom: 50,
		color: '#000000',
		fontSize: 24,
		fontWeight: 'bold',
    // marginLeft: 10,
    marginHorizontal: 10
		// flexDirection: 'row'
	},
});