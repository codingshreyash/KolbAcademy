import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import * as restService from '../services/RestService'

var moment = require('moment');
import { v4 as uuidv4 } from 'uuid'

export default function EmailModal(props) {


  
  const msgLst = props.selectedEmailThread.msgLst
  const [newMessageText, setNewMessageText] = useState('');
  const [toText, setToText] = useState('');
  const [subjectText, setSubjectText] = useState('');

  clearFields = () => {
    setNewMessageText('');
    setToText('');
    setSubjectText('');
  }

  if (props.selectedEmailThread.isNewEmail) {

    return (
      <Portal>
        <Modal visible={props.visible} onDismiss={()=>{props.hideModal(); clearFields();}} contentContainerStyle={styles.modal}>
          
          <TouchableOpacity style={{position: 'absolute', left: 0, top:0, borderRadius:10, padding: 7, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{props.hideModal(); clearFields();}}>
            <Icon name={'close'} color="#FF0000" size={35} />
          </TouchableOpacity>

          <TouchableOpacity 
          style={{position: 'absolute', right: 0, top:0, padding: 7}}
          disabled={newMessageText.length === 0 || toText.length === 0 || subjectText.length === 0}
          onPress={() => {
            const newEmailInfo = {
              "recipientEmailAddress": toText,
              "senderEmailAddress": props.userInfo.emailAddress,
              "senderProfilePicture": props.userInfo.profilePicture,
              "senderName": props.userInfo.firstName + " " + props.userInfo.lastName,
              "senderTitle": props.userInfo.title,
              "subject": subjectText,
              "messageSummary": newMessageText.substring(0, 40),
              "message": newMessageText,
            }


            restService.sendEmail(props.userInfo.clientId, newEmailInfo).then(response => {
              console.log(newEmailInfo)
              console.log(response)
              restService.getEmails(props.userInfo.clientId).then(response => {
                props.setEmailThreadsList(response);
                props.setFilteredEmails(response);
                clearFields();
                props.hideModal()
              });
            })

            // props.hideModal();
          }
        }
        >
          <Icon
            style={{alignSelf:'center', flex: 1, marginLeft: 0, zIndex: 1}}
            name={'arrow-up-circle'}
            color={newMessageText.length == 0 ? "#666666" : "#3d8fef"}
            size={35}
          />
        </TouchableOpacity>

            <Text style={{...styles.title, marginTop: 40}}>{subjectText.length > 0 ? subjectText : "New Message"}</Text>

            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginTop: 15, marginBottom: 10 }}>
              <Text style={{ fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold' }}>To</Text>
              <TextInput value={toText} style={{ fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA' }} onChangeText={text => setToText(text)} />
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginVertical: 10 }}>
              <Text style={{ fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold' }}>Subject</Text>
              <TextInput value={subjectText} style={{ fontSize: 18, borderRadius: 10, backgroundColor: '#F7F8FA' }} onChangeText={text => setSubjectText(text)} />
            </View>

            <View style={{ flexDirection: 'column', marginVertical: 10 }}>
              <Text style={{ fontSize: 14, marginBottom: 5, color: '#555555', fontWeight: 'bold' }}>Message</Text>
              <TextInput value={newMessageText} style={{ textAlignVertical: 'top', fontSize: 16, borderRadius: 10, backgroundColor: '#F7F8FA', height: '73%'}} multiline={true} onChangeText={text => setNewMessageText(text)} />
            </View>

        </Modal>
      </Portal>
    )
  }

	return (
    <Portal>

      <Modal visible={props.visible} onDismiss={() => {props.hideModal(); clearFields();}} contentContainerStyle={styles.modal}>
        <TouchableOpacity style={{position: 'absolute', right: 0, top:0, marginRight: 0, marginTop: 0, borderRadius:10, padding: 7, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{props.hideModal(); clearFields();}}>
          <Icon name={'close'} color="#FF0000" size={35} />
        </TouchableOpacity>


          <Text style={styles.title}>{props.selectedEmailThread.subject}</Text>
          
          

          <FlatList
						data={msgLst}
						renderItem={({ item }) => { 
							return (
                <View>
                  <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <Image source={{uri:item.senderProfilePicture}} style={{ marginTop: 2, width: 40, height: 40, borderRadius: 10, marginRight: 10}} />
                    <Text style={{fontSize: 16, marginRight:5, lineHeight: 20}}>{item.senderName}</Text>
                    <Text style={{fontSize: 14, color: '#666666'}}>{item.timestamp}</Text>
                  </View>
                
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 50, marginTop: -15}}>
                    {props.inReplyMode && <View style={{borderLeftColor: '#E2918D', borderLeftWidth: 1, marginRight: 5, marginBottom: 10}}></View>}
                    <Text style={{fontSize: 16, lineHeight: 25, marginBottom: 20}}>{item.message}</Text>
                  </View>
                </View>
							)
						}}
						keyExtractor={emailID => emailID}
						contentContainerStyle={{
							flexGrow: 1,
						}}
			    />

      <View style={{flexDirection: 'row'}}>

        <TextInput 
          style={{borderTopWidth: 1, marginTop: 0, flex: 10, borderTopColor: '#DDDDDD', fontSize: 16, zIndex: 0}}
          multiline={true}
          textAlign="left"
          placeholder='Your reply'
          value={newMessageText}
          onChangeText={newMessageText => setNewMessageText(newMessageText)}
        />

        <TouchableOpacity 
          disabled={newMessageText.length == 0}
          onPress={() => {
            const newEmailInfo = {
              "threadId": props.selectedEmailThread.threadId,
              "recipientEmailAddress": props.selectedEmailThread.userLst[0] === props.userInfo.emailAddress ? props.selectedEmailThread.userLst[1] : props.selectedEmailThread.userLst[0],
              "senderEmailAddress": props.userInfo.emailAddress,
              "senderProfilePicture": props.userInfo.profilePicture,
              "senderName": props.userInfo.firstName + " " + props.userInfo.lastName,
              "senderTitle": props.userInfo.title,
              "messageSummary": newMessageText.substring(0, 40),
              "message": newMessageText,
            }


            restService.sendEmail(props.userInfo.clientId, newEmailInfo).then(response => {
              restService.getEmails(props.userInfo.clientId).then(response => {
                props.setEmailThreadsList(response);
                props.setFilteredEmails(response);
                props.hideModal();
                clearFields();
              });
            })

          }
        }
        >
          <Icon
            style={{alignSelf:'center', marginTop: 10, flex: 1, marginLeft: 0, zIndex: 1}}
            name={'arrow-up-circle'}
            color={newMessageText.length == 0 ? "#666666" : "#3d8fef"}
            size={35}
          />
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
    margin: 10,
    padding:15,
    justifyContent: 'flex-start',
  },
  title: {
		// textAlign: 'center',
		lineHeight: 30,
		color: '#000000',
		fontSize: 24,
		fontWeight: 'bold',
		flexDirection: 'row',
    marginTop: 20,
    marginBottom: 5
	},
});