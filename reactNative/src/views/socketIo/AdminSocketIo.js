import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Platform, Animated, SafeAreaView, BackHandler } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { A_icon, Badge, Column, Img, Modal, P, Press, Row } from '../../other/Components/Html';
import Video from '../../other/Components/other/Video';
import Audio from '../../other/Components/other/Audio';
import InputBottom from './components/InputBottom';
import SocketIOClient from 'socket.io-client';
import { localhost } from '../../other/utils/axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode'
import moment from 'moment-jalaali';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { Keyboard } from 'react-native';
import download from '../../other/utils/download';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
let adminId

const AdminSocketIo = (p) => {

  const [typing, settyping] = useState('')
  const [videoUri, setvideoUri] = useState('')
  const [imageUrl, setimageUrl] = useState('')
  const [showVideo, setshowVideo] = useState(false)
  const [showImage, setshowImage] = useState(false)
  const [userId, setuserId] = useState('')
  const [pvMessage, setpvMessage] = useState('')
  const [pvChatMessage, setPvChatMessage] = useState([])
  const [to, setto] = useState('')
  const [titleMessage, settitleMessage] = useState([])
  const [localstoragetrue, setlocalstoragetrue] = useState(false)

  const tokenValue = useRef({})
  const tokenSocket = useRef()
  const socketTocken = useRef()
  const flatlistRef = useRef()



  const opacityAnimated = useRef(new Animated.Value(0)).current;

  const hidden = () => {
    Animated.timing(opacityAnimated, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const shown = () => {
    Animated.timing(opacityAnimated, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false
    }).start();
  };



  const socket = useRef(SocketIOClient.connect(localhost, {
    transports: ["websocket"],
    auth: {
      token: tokenSocket.current
    }
  },))

  const [showChange, setshowChange] = useState(false)




  useFocusEffect(useCallback(() => {
    return()=>changeNavigationBarColor('white')
  }, []))


  useEffect(() => {
    p.navigation.setOptions({ headerShown: false })
  }, [])


  useEffect(() => {
    if (Platform.OS === 'android') {
      p.navigation.getParent()?.setOptions({ tabBarStyle: { display: (videoUri) ? "none" : "flex" } })
      if (showChange) {
        (videoUri) ? changeNavigationBarColor('black') : changeNavigationBarColor('white')
        if (videoUri) p.navigation.setOptions({ title: '', headerTransparent: true, statusBarHidden: true, statusBarColor: 'black', headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={21} onPress={() => setvideoUri('')} /> })
        else p.navigation.setOptions({ title: 'پرسش سوالات', headerTransparent: false, statusBarHidden: false, statusBarColor: '#d29', headerLeft: () => { } })
      }
       }
    else
      if (videoUri) p.navigation.setOptions({ headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={21} onPress={() => setvideoUri('')} /> })
      else p.navigation.setOptions({ headerLeft: () => { } })
  }, [to, videoUri])


  useEffect(() => {
    if (Platform.OS !== 'android') {
    if (tokenValue.current.isAdmin) {
      if (to)
        p.navigation.setOptions({ headerShown: true, headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={21} onPress={() => setto('')} /> })
      else
        p.navigation.setOptions({ headerShown: false })
    }
  }
  }, [to, videoUri])


  useEffect(() => {
    if (Platform.OS === 'android') {
    if (tokenValue.current.isAdmin) {
      if (to && !videoUri)
        p.navigation.setOptions({ headerShown: true, headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={21} onPress={() => setto('')} /> })
      
    }
  }
  }, [to, videoUri])



  // useFocusEffect(useCallback(() => {
  //   const backHandler = Platform.OS === 'android' && videoUri && BackHandler.addEventListener('hardwareBackPress', () => { setvideoUri(''); setTimeout(() => { return p.navigation.navigate('SocketIo') }, 100) });
  //   (Platform.OS === 'android' && backHandler && !videoUri) && backHandler.remove()
  //   return () => (Platform.OS === 'android' && backHandler) && backHandler.remove()
  // }, [videoUri]))


  useFocusEffect(useCallback(() => {
    setTimeout(() => {setshowChange(true)}, 2000); 

    AsyncStorage.getItem('socketTocken').then((_socketTocken) => {
      socketTocken.current = _socketTocken
    })


    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        tokenValue.current = jwt_decode(token)
      }
    })
  }, []))


  useEffect(() => {
    socket.current.on("online", (users) => {
      const user = users.find((user) => (user.user.isAdmin === 1))
      adminId = user?.socketId
    });



    socket.current.on("mongoMsg", async (messages) => {
      if (!localstoragetrue) {
        messages && setPvChatMessage([...messages, { userId: tokenSocket.current, message: 'چطوری میتونم کمکتون کنم؟', _id: 'a1' }])

        if (messages && tokenValue.current.isAdmin) {
          let titleMessage = []
          settitleMessage([])
          for (let i of messages) {
            let find = titleMessage.find((msg) => (msg.userId === i.userId))
            if (!find) {
              titleMessage.push(i)
              AsyncStorage.getItem(i.userId).then((localStorage) => {
                if (localStorage) {
                  let parse = JSON.parse(localStorage)
                  settitleMessage(titleMsg => titleMsg.concat({ badgeActive: i.getTime > parse.getTime, ...i }))
                }
                else {
                  settitleMessage(titleMsg => titleMsg.concat({ badgeActive: true, ...i }))
                }
                setlocalstoragetrue(true)
              })
            }
          }
        }
        else {
          //  AsyncStorage.setItem('socketDate', JSON.stringify(new Date().getTime())).then(() => { })
        }
      }
    })




    socket.current.on("pvChat", async (msg) => {
      setPvChatMessage(messages => [msg, ...messages])
      const messages = [...pvChatMessage, msg]

      if (messages && tokenValue.current.isAdmin) {
        let titleMessage = []
        for (let i of messages) {
          let find = titleMessage.find((msg) => (msg.userId === i.userId))
          if (!find) {
            titleMessage.push(i)
            AsyncStorage.getItem(i.userId).then((localStorage) => {
              if (localStorage) {
                let parse = JSON.parse(localStorage)
                settitleMessage(titleMsg => {
                  let ms = [...titleMsg]
                  let filter = ms.filter((m) => (m.userId !== i.userId))
                  filter.push({ badgeActive: i.getTime > parse.getTime, ...i })
                  return filter
                })
              }
              else {
                settitleMessage(titleMsg => {
                  let filter = titleMsg.filter((m) => (m.userId !== i.userId))
                  filter.push({ badgeActive: true, ...i })
                  return filter
                })
              }
              setlocalstoragetrue(true)
            })
          }
        }
      }
      else {
        const socketTocken = await AsyncStorage.getItem('socketTocken')
        //  AsyncStorage.setItem('socketDate', JSON.stringify(new Date().getTime())).then(() => { })
        if (socketTocken === msg.to) { p.setsocketIoSeen(true) }
      }
    });



    socket.current.on("typing", async (data) => {
      if (tokenValue.current.isAdmin) {
        AsyncStorage.getItem('room').then((room) => {
          if (((data.to === '1') && (tokenValue.current.isAdmin) && (room === data.socketTocken))) {
            if (data.etar) {
              settyping("•••")
              shown()
              setTimeout(() => { hidden() }, 300);
            }
            if (data.etar === "") { settyping('') }
          }
        })
      }
      else
        if ((data.to === socketTocken.current)) {
          if (data.etar) {
            settyping("•••")
            shown()
            setTimeout(() => { hidden() }, 300);
          }
          if (data.etar === "") { settyping('') }
        }
    });

  }, [])



  useFocusEffect(useCallback(() => {
    if (!tokenValue.current.isAdmin) AsyncStorage.setItem('socketDate', JSON.stringify(new Date().getTime())).then(() => { })
    return () => {
      AsyncStorage.setItem('socketDate', JSON.stringify(new Date().getTime())).then(() => { })
      p.setsocketIoSeen(false)
    }
  }, []));


  useEffect(() => {
    var socketTocken
    (async () => {
      socketTocken = await AsyncStorage.getItem('socketTocken')
      if (!socketTocken) {
        await AsyncStorage.setItem('socketTocken', JSON.stringify((new Date().getTime()) + (Math.random() + 100000)))
        socketTocken = await AsyncStorage.getItem('socketTocken')
        tokenSocket.current = socketTocken
        socket.current.emit("online", { user: tokenValue.current, userId: socketTocken });
      }
      else {
        tokenSocket.current = socketTocken
        socket.current.emit("online", { user: tokenValue.current, userId: socketTocken });
      }
    })()
  }, [])


  const handlePvChat = () => {
    socket.current.emit("pvChat", {
      pvMessage: pvMessage,
      userId: tokenSocket.current,
      to: to,
      isAdmin: tokenValue.current.isAdmin,
    });
  };


  const handleKeypress = async (e) => {
    socket.current.emit("typing", { to, socketTocken: socketTocken.current, etar: e.nativeEvent?.text })
  };


  useEffect(() => {
    try {
      Keyboard.addListener('keyboardDidShow', function () { p.setshownDropdown(false); });
      Keyboard.addListener('keyboardDidHide', function () { p.setshownDropdown(false); });
    } catch (error) { }
  }, [])



  
  const [audioChange, setaudioChange] = useState(false)

  useEffect(() => {
    if (Platform.OS === 'web') {

      const audios = document.getElementsByTagName('audio')
      const play = (e) => {
        for (let i = 0; i < audios.length; i++) {
          if (audios[i] !== e.target) audios[i]?.pause()
        }
      }
      if (audios)
        for (let i = 0; i < audios.length; i++) {
          audios[i]?.removeEventListener('playing', play)
          audios[i]?.addEventListener('playing', play)
        }



      const video_1 = document.getElementsByTagName('video')
      const play_video = (e) => {
        for (let i = 0; i < video_1.length; i++) {
          if (video_1[i] !== e.target) video_1[i]?.pause()
        }
      }
      if (video_1)
        for (let i = 0; i < video_1.length; i++) {
          video_1[i]?.removeEventListener('playing', play_video)
          video_1[i]?.addEventListener('playing', play_video)
        }



      const video = document.getElementsByTagName('video')
      const playVideo = () => {
        const _audio = document.getElementsByTagName('audio')
        for (let i = 0; i < video.length; i++) {
          _audio[i]?.pause()
        }
      }
      if (video)
        for (let i = 0; i < video.length; i++) {
          video[i]?.removeEventListener('playing', playVideo)
          video[i]?.addEventListener('playing', playVideo)
        }

        

      const audio = document.getElementsByTagName('audio')
      const playAudio = () => {
        const _video = document.getElementsByTagName('video')
        for (let i = 0; i < audio.length; i++) {
          _video[i]?.pause()
        }
      }
      if (audio)
        for (let i = 0; i < audio.length; i++) {
          audio[i]?.removeEventListener('playing', playAudio)
          audio[i]?.addEventListener('playing', playAudio)
        }
    }

  }, [audioChange])

  useEffect(() => { setTimeout(() => { setaudioChange(!audioChange) }, 2000);}, [pvChatMessage, to])
  useEffect(() => { setTimeout(() => { setaudioChange(!audioChange) }, 5000);}, [to])



  return (
    <Column f={1} >
      <SafeAreaView />
      <Animated.View style={{ position: 'absolute', alignSelf: 'center', top: 5, zIndex: 10000, opacity: opacityAnimated, height: 30 }} >
        <P fs={25} h={30} pos='absolute' color='#99f' z={11111111} >{typing}</P>
      </Animated.View>

      {(pvChatMessage.length || titleMessage.length) ?
        <View onLayout={() => { if (!tokenValue.current.isAdmin) { setto('1') } }} style={{ flex: 1 }} >
          {!tokenValue.current.isAdmin
            ?
            <FlatList ref={flatlistRef}
              inverted
              keyExtractor={(data, i) => data._id}
              data={pvChatMessage}
              renderItem={({ item, index }) => (
                ((item.userId == tokenSocket.current) || (adminId === socket.current.id) || (item.to === tokenSocket.current)) ?
                  <Column style={{ opacity: (pvChatMessage.find(pv => (pv._id !== 'a1') && (pv.userId == tokenSocket.current)) && item._id === 'a1') ? 0 : 1, marginVertical: 10, marginHorizontal: 2, width: '70%', minHeight: 45, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: item.to === to ? '#f8f8f8' : '#fff', borderWidth: 1, alignSelf: (item.to === to || item._id === 'a1') ? 'flex-start' : 'flex-end', borderRadius: 10, borderColor: '#ddd' }} >
                    <Row fd='row-reverse' jc='flex-end' pt={3}>
                      {(pvChatMessage.find(pv => (pv._id !== 'a1' && (pv.userId == tokenSocket.current))) && (item.userId === tokenSocket.current)) && <P ta='right' style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >شما</P>}
                      {(pvChatMessage.find(pv => (pv._id !== 'a1') && (pv.userId == tokenSocket.current))) && <P ta='right' mr={20} style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >{moment(item.date).format('jM/jD hh:mm')}</P>}
                    </Row>
                    {!item.type ?
                      <P ta='right' p={3} >{item.message}</P> :
                      item.type === 'video' ?
                        <Press onClick={() => {
                          setvideoUri(`${localhost}/upload/socket/${item.uri}`)
                          setshowVideo(true)
                        }}>
                          <Video source={{ uri: `${localhost}/upload/socket/${item.uri}` }} style={{ height: 200, width: '90%', borderRadius: 4, alignSelf: 'center' }} />
                        </Press>
                        :
                        item.type !== 'audio' ?
                          <Press onClick={() => {
                            setimageUrl(`${localhost}/upload/socket/${item.uri}`)
                            setshowImage(true)
                          }}>
                            <Img src={{ uri: `${localhost}/upload/socket/${item.uri}` }} w={'90%'} h={300} as='center' br={4} style={{ resizeMode: 'stretch' }} />
                          </Press>
                          :
                          <Column w='100%' h={100} ai='flex-end' jc='center' >
                            <Audio source={{ uri: `${localhost}/upload/socket/${item.uri}` }} style={{ width: '90%', alignItems: 'center' }} />
                          </Column>
                    }
                    {(pvChatMessage.length - 1 === index && item._id === 'a1') && <Badge bgcolor={'#0d8'} right={2} />}
                  </Column>
                  :
                  pvChatMessage.length - 1 === index ?
                    <Column w='90%' maxw={400} bgcolor='#fff' p={8} >
                      <P ta='right' p={3} >چطوری میتوانیم کمکتان کنیم؟</P>
                      <Badge bgcolor={'#0d8'} right={2} />
                    </Column>
                    :
                    <></>
              )}
            />
            :
            <>
              {!to ?
                <FlatList
                  keyExtractor={(data, i) => data._id}
                  data={titleMessage}
                  renderItem={({ item, index }) => (
                    (item.userId !== tokenSocket.current) ?
                      <Press fd='row'
                        onClick={() => {
                          if ((tokenValue.current.isAdmin) && (item.to === '1')) {
                            AsyncStorage.setItem('room', item.userId).then(() => { })
                            setto(item.userId); setuserId(item.userId);
                            AsyncStorage.setItem(item.userId, JSON.stringify(item)).then(() => {
                              settitleMessage(titleMsg => {
                                let filter = titleMsg.filter((m) => (m.userId !== item.userId))
                                filter.push({ ...item, badgeActive: false })
                                return filter
                              })
                            })
                          }
                        }}
                        key={index}
                        style={{ marginVertical: 10, marginRight: 'auto', marginLeft: 'auto', width: '70%', height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 4 }} >
                        <P>کاربر:  </P>
                        <P mt={2}
                          style={[{ fontSize: 12 }, Platform.OS === 'web' ? { cursor: ((tokenValue.current.isAdmin) && (item.to === '1')) ? 'pointer' : '' } : {}]}>{item.userId}</P>
                        {item.badgeActive ? <Badge right={0} color={'green'} /> : <></>}
                      </Press>
                      :
                      <></>
                  )}
                />
                :
                <View style={{ flex: 1, overflow: 'hidden' }} >
                  <FlatList ref={flatlistRef}
                    inverted
                    keyExtractor={(data) => data._id}
                    data={pvChatMessage}
                    renderItem={({ item, index }) => (
                      ((item.userId === userId) || (item.to === to)) ?
                        <Column key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', minHeight: 45, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: item.to === to ? '#f8f8f8' : '#fff', borderWidth: 1, alignSelf: item.to !== to ? 'flex-end' : 'flex-start', borderRadius: 10, borderColor: '#ddd' }} >
                          <Row fd='row-reverse' jc='flex-end' pt={3}>
                            <P mr={20} style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >{moment(item.date).format('jM/jD hh:mm')}</P>
                            {item.userId === tokenSocket.current ?
                              <P style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >شما</P>
                              :
                              <></>
                            }
                          </Row>
                          {!item.type ?
                            <P ta='right' p={3} >{item.message}</P> :
                            item.type === 'video' ?
                              <Press onClick={() => {
                                setvideoUri(`${localhost}/upload/socket/${item.uri}`)
                                setshowVideo(true)
                              }}>
                                <Video source={{ uri: `${localhost}/upload/socket/${item.uri}` }} style={{ height: 200, width: '90%', borderRadius: 4, alignSelf: 'center' }} />
                              </Press>
                              :
                              item.type !== 'audio' ?
                                <Press onClick={() => {
                                  setimageUrl(`${localhost}/upload/socket/${item.uri}`)
                                  setshowImage(true)
                                }}>
                                  <Img src={{ uri: `${localhost}/upload/socket/${item.uri}` }} w={'90%'} h={300} as='center' br={4} style={{ resizeMode: 'stretch' }} />
                                </Press>
                                :
                                <Column w='100%' h={100} ai='flex-end' jc='center' >
                                  <Audio source={{ uri: `${localhost}/upload/socket/${item.uri}` }} style={{ width: '90%', alignItems: 'center' }} />
                                </Column>
                          }
                        </Column>
                        :
                        <></>
                    )}
                  />
                  <Column mt='auto' >
                    <InputBottom onClick={() => flatlistRef.current.scrollToOffset({ offset: 0 })} flatlistRef={flatlistRef} handleKeypress={handleKeypress} handlePvChat={handlePvChat} setpvMessage={setpvMessage} pvMessage={pvMessage} socket={socket} tokenSocket={tokenSocket} tokenValue={tokenValue} to={to}  ></InputBottom>
                  </Column>
                </View>
              }
            </>
          }
          {(!tokenValue.current.isAdmin) ?
            <Column mt='auto' >
              <InputBottom onClick={() => flatlistRef.current.scrollToOffset({ offset: 0 })} flatlistRef={flatlistRef} handleKeypress={handleKeypress} handlePvChat={handlePvChat} setpvMessage={setpvMessage} pvMessage={pvMessage} socket={socket} tokenSocket={tokenSocket} tokenValue={tokenValue} to={to} ></InputBottom>
            </Column>
            :
            <></>
          }

          {Platform.OS === 'android' && videoUri ?
            <Column show={showVideo} setshow={setshowVideo} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} >
              {videoUri ? <Video source={{ uri: videoUri }} controls paused={false} muted={false} style={{ height: '100%', width: '100%', borderRadius: 4, alignSelf: 'center' }} /> : <></>}
            </Column>
            :
            <></>}

          <Modal show={showImage} setshow={setshowImage} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} >
            {imageUrl ?
              <>
                <Press pos='absolute' z={100} t={0} r={-2} bgcolor='#fffa' br={1} h={25} w={20} style={{ transform: [{ scaleX: .9 }, { scaleX: .9 }] }}  >
                  <A_icon name={'ellipsis1'} size={23} style={{ transform: [{ rotate: '90deg' }], position: 'absolute', zIndex: 99999 }}
                    onClick={() => { download(imageUrl) }}
                  />
                </Press>
                <Img src={{ uri: imageUrl }} style={{ height: '100%', width: '100%', borderRadius: 4, alignSelf: 'center', resizeMode: 'stretch' }} />
              </>
              : <></>}
          </Modal>

        </View>
        :
        !tokenValue.current.isAdmin ?
          <Column mt={22} w='90%' maxw={400} bgcolor='#fff' p={10} br={8} >
            <P ta='right' p={3} >چطوری میتوانیم کمکتان کنیم؟</P>
            <Badge bgcolor={'#0d8'} right={2} />
          </Column>
          :
          <></>
      }
    </Column>
  )
}
export default AdminSocketIo