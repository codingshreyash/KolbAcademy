import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EmailMessage(props) {
    console.log(props.emailThread)
    const mostRecentEmail = props.emailThread.msgLst.length > 0 ? props.emailThread.msgLst[props.emailThread.msgLst.length - 1]: null
    return (
        <View>
            {props.emailThread.msgLst.length > 0 && <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, alignContent: 'center', justifyContent: 'center' }} onPress={() => props.showModal(props.emailThread)}>
                <Image
                    source={{ uri: mostRecentEmail.senderProfilePicture }}
                    style={{ width: 60, height: 60, borderRadius: 10 }}
                />
                {mostRecentEmail.messageUnread && <Icon style={{ marginLeft: -10, marginTop: 0 }} name='ellipse' type='ionicon' color='#007bff' size={15} />}

                <View style={{ flexDirection: 'column', paddingLeft: 10, width: '83%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 3, marginRight: 7 }}>
                            {mostRecentEmail.senderName}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'column', position: 'absolute', right:0}}>
                            <Text style={{ fontSize: 14, color: '#777777', textAlign: 'right' }}>{mostRecentEmail.timestamp.substring(0, mostRecentEmail.timestamp.indexOf('@')-1)}</Text>
                            <Text style={{ fontSize: 14, color: '#777777', textAlign: 'right' }}>{mostRecentEmail.timestamp.substring(mostRecentEmail.timestamp.indexOf('@') + 1)}</Text>
                        </View>
                    <Text style={{ fontSize: 14, color: '#000000', marginBottom: 3 }}>
                        {props.emailThread.subject}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#777777' }}>
                        {mostRecentEmail.messageSummary.replace("\n","") + '...'}
                    </Text>
                </View>
            </TouchableOpacity>}
        </View>

    );
}