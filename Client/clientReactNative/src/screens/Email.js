import React, { useState, Fragment, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Button, Image } from 'react-native';
import { Modal, Portal, Provider, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import EmailMessage from '../components/EmailMessage';
import EmailModal from '../components/EmailModal';
import * as restService from '../services/RestService'

_ = require('lodash')

export default function Email(props) {
	console.log('in email')
	console.log(props)

	// const userInfo = {
	// 	"clientId": "373673",
	// 	"firstName": "Shreyash",
	// 	"lastName": "Ranjan",
	// 	"title": "11th Grade Student",
	// 	"emailAddress": "ranjan@ka.edu",
	// 	"profilePicture": "https://yt3.ggpht.com/ytc/AKedOLT_w5trCKo9Z6pq05DK9DyYRXxT3nuGwsX4hxWlTho=s900-c-k-c0x00ffffff-no-rj"
	// }

	const [visible, setVisible] = useState(false);
	const emptyEmailTemplate = {
		"isNewEmail": true,
		"userLst": [props.userInfo.emailAddress],
		"subject": "",
		"msgLst": [
			{
				"emailID": "1",
				"senderEmailAddress": props.userInfo.emailAddress,
				"recipientEmailAddress": "",
				"senderProfilePicture": props.userInfo.profilePicture,
				"senderName": props.userInfo.firstName + " " + props.userInfo.lastName,
				"senderTitle": props.userInfo.title,
				"messageSummary": "",
				"message": "",
			},
		]
	}
	const [selectedEmailThread, setSelectedEmailThread] = useState({...emptyEmailTemplate});
	const showModal = (item) => {
		item.messageUnread = false;
		setVisible(true);
		setSelectedEmailThread(item)
	}
	const hideModal = () => {
		setVisible(false);
		setInReplyMode(false);
		setSelectedEmailThread({...emptyEmailTemplate})
	}

	const [inReplyMode, setInReplyMode] = useState(false);
	const [filterText, setFilterText] = useState('');
	const [emailThreadsList, setEmailThreadsList] = useState([])

	const [filteredEmails, setFilteredEmails] = useState([])

	filterFlatList = text => {
		if (text.length <= 2) {
			setFilteredEmails(emailThreadsList);
		} else {
			tempEmails = []
			for (let i = 0; i < emailThreadsList.length; i++) {
				for (let j = 0; j < emailThreadsList[i].msgLst.length; j++) {
					let email = emailThreadsList[i].msgLst[j]
					if (email.message.toLowerCase().includes(text.toLowerCase()) || emailThreadsList[i].subject.toLowerCase().includes(text.toLowerCase()) || email.senderName.toLowerCase().includes(text.toLowerCase())) {
						tempEmails.push(emailThreadsList[i]);
					}
				}
			}
			setFilteredEmails(tempEmails);
		}
	}


	getEmailThreads = () => {
		restService.getEmails(props.userInfo.clientId).then(response => {
			setEmailThreadsList(response);
			setFilteredEmails(response)
		});
	}

	useEffect(() => {
		getEmailThreads();
	}, []);

	return (
		<Fragment>
			<SafeAreaView style={{ flex: 1, backgroundColor: '#5e4eb9'}}>
				<Provider>
					<View style={styles.footer}>
						<Text style={styles.header}>
							Email
						</Text>
					</View>

					<View style={styles.container}>

						<TextInput
							autoCorrect={false}
							style={{ marginTop: -30, fontSize: 14, width: '85%', alignSelf: 'center', backgroundColor: 'white', borderBottomColor: 'transparent', borderTopColor: 'transparent', borderRadius: 30, textAlign: 'center', shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', shadowOpacity: 2, elevation: 6 }}
							placeholder="Filter Emails"

							onChangeText={(text) => {
								setFilterText(text);
								filterFlatList(text);
							}}
							value={filterText}
						/>

							{filteredEmails.length > 0 && <FlatList
								data={filteredEmails}
								renderItem={({ item }) => {
									return (<EmailMessage emailThread={item} showModal={showModal} />)
								}}
								keyExtractor={threadID => threadID}
								contentContainerStyle={{ flexGrow: 1 }}
							/>}
							{
								filteredEmails.length === 0 && <Text style={{fontWeight: 'bold', fontSize: 18, alignSelf: 'center', textAlignVertical: 'center', height: '100%'}}>No Emails Found</Text>
							}


						<EmailModal
							visible={visible}
							hideModal={hideModal}
							userInfo={props.userInfo}
							emailThreadsList={emailThreadsList}
							setEmailThreadsList={setEmailThreadsList}
							selectedEmailThread={selectedEmailThread}
							setFilteredEmails={setFilteredEmails}
							inReplyMode={inReplyMode}
							setInReplyMode={setInReplyMode}
						/>

						<FAB style={{width: 50, height: 50, textAlign: 'center', justifyContent: 'center', alignItems:'center', borderRadius: 60, backgroundColor: '#5e4eb9', position: 'absolute', right: 0, bottom: 0, marginRight: 10, marginBottom: 10}} animated={true} icon="plus" onPress={() => {setVisible(true);}}/>



					</View>
				</Provider>
			</SafeAreaView>
		</Fragment>
	);
}

const styles = StyleSheet.create({

	container: {
		flex: 8,
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0
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
