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
import _useEffect from '../../controllers/_initial';

let adminId

const AdminSocketIo = (p) => {

  const [typing, settyping] = useState('')
  const [videoUri, setvideoUri] = useState('')
  const [imageUrl, setimageUrl] = useState('')
  const [showVideo, setshowVideo] = useState(false)
  const [showImage, setshowImage] = useState(false)
  const [pvMessage, setpvMessage] = useState('')
  const [pvChatMessage, setPvChatMessage] = useState([])
  const [to, setto] = useState('')
  const [titleMessage, settitleMessage] = useState([])

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

  // const setNavigationColor = color => { changeNavigationBarColor(color); };
  // const hideNavigation = () => { hideNavigationBar(); };
  // const showNavigation = () => { showNavigationBar(); };
  // const testSetTranslucent = () => { changeNavigationBarColor('translucent', false); };
  // const testSetTransparent = () => { changeNavigationBarColor('transparent', true); };

  const [showChange, setshowChange] = useState(false)

  // _useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     p.navigation.getParent()?.setOptions({
  //       tabBarStyle: {
  //         display: (videoUri) ? "none" : "flex"
  //       }
  //     })
  //     if (showChange) {
  //       if (videoUri) p.navigation.setOptions({
  //         title: '',
  //         navigationBarColor: '#000e', headerStyle: { backgroundColor: '#000e' }, statusBarHidden: true,
  //         headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={23} onPress={() => setvideoUri('')} />
  //       })
  //       else p.navigation.setOptions({
  //         title: 'پرسش سوالات',
  //         navigationBarColor: '#fff', headerStyle: { backgroundColor: '#fff' }, navigationBarHidden: false, statusBarHidden: false,
  //         headerLeft: () => { }
  //       })
  //     }
  //     setshowChange(true)
  //   }
  //   else
  //     if (videoUri) p.navigation.setOptions({
  //       headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={23} onPress={() => setvideoUri('')} />
  //     })
  //     else p.navigation.setOptions({ headerLeft: () => { } })
  //   return () => {
  //     if (Platform.OS === 'android')
  //       p.navigation.setOptions({
  //         navigationBarColor: '#fff', headerStyle: { backgroundColor: '#fff' }, statusBarHidden: false,
  //       })
  //   }
  // }, [to, videoUri])


  useFocusEffect(useCallback(() => {

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
      messages && setPvChatMessage([...messages, { userId: tokenSocket.current, message: 'چطوری میتونم کمکتون کنم؟', _id: 'a1' }])
    })




    socket.current.on("pvChat", async (msg) => {
      setPvChatMessage(messages => [msg, ...messages])
      const socketTocken = await AsyncStorage.getItem('socketTocken')
      if (socketTocken === msg.to) { p.setsocketIoSeen(true) }
    });



    socket.current.on("typing", async (data) => {
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
    AsyncStorage.setItem('socketDate', JSON.stringify(new Date().getTime())).then(() => { })
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



  return (
    <Column f={1} >
      <SafeAreaView />
      <Animated.View style={{ position: 'absolute', alignSelf: 'center', top: 5, zIndex: 10000, opacity: opacityAnimated, height: 30 }} >
        <P fs={25} h={30} pos='absolute' color='#99f' z={11111111} >{typing}</P>
      </Animated.View>

      {(pvChatMessage.length || titleMessage.length) ?
        <View onLayout={() => { setto('1') }} style={{ flex: 1 }} >
          <FlatList
            ref={flatlistRef}
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


          <Column mt='auto' >
            <InputBottom onClick={() => flatlistRef.current.scrollToOffset({ offset: 0 })} flatlistRef={flatlistRef} handleKeypress={handleKeypress} handlePvChat={handlePvChat} setpvMessage={setpvMessage} pvMessage={pvMessage} socket={socket} tokenSocket={tokenSocket} tokenValue={tokenValue} to={to} ></InputBottom>
          </Column>


          {Platform.OS === 'android' && videoUri ?
            // <Modal show={showVideo} setshow={setshowVideo} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} >
            <Column style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} >
              {videoUri ? <Video source={{ uri: videoUri }} controls paused={false} muted={false} style={{ height: '100%', width: '100%', borderRadius: 4, alignSelf: 'center' }} /> : <></>}
            </Column>
            // </Modal>
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
        <Column mt={22} w='90%' maxw={400} bgcolor='#fff' p={10} br={8} >
          <P ta='right' p={3} >چطوری میتوانیم کمکتان کنیم؟</P>
          <Badge bgcolor={'#0d8'} right={2} />
        </Column>
      }
    </Column>
  )
}
export default AdminSocketIo



















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
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';

let adminId

const AdminSocketIo = (p) => {

  const [typing, settyping] = useState('')
  const [videoUri, setvideoUri] = useState('')
  const [imageUrl, setimageUrl] = useState('')
  const [showVideo, setshowVideo] = useState(false)
  const [showImage, setshowImage] = useState(false)
  const [pvMessage, setpvMessage] = useState('')
  const [pvChatMessage, setPvChatMessage] = useState([])
  const [to, setto] = useState('')
  const [titleMessage, settitleMessage] = useState([])

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

  const setNavigationColor = color => { changeNavigationBarColor(color); };
  const hideNavigation = () => { hideNavigationBar(); };
  const showNavigation = () => { showNavigationBar(); };
  const testSetTranslucent = () => { changeNavigationBarColor('translucent', false); };
  const testSetTransparent = () => { changeNavigationBarColor('transparent', true); };

  const [showChange, setshowChange] = useState(false)

  useEffect(() => {
    if (Platform.OS === 'android') {
      p.navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: (videoUri) ? "none" : "flex"
        }
      })

      if(showChange){ (videoUri) ? testSetTransparent('black') : testSetTransparent('white')}
    }
  }, [to, videoUri])



  
  useFocusEffect(useCallback(() => {
    if (Platform.OS === 'android') {
      p.navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: (videoUri) ? "none" : "flex"
        }
      })
      if (showChange) {
        if (videoUri) p.navigation.setOptions({
          title: '',
          /* navigationBarHidden:true, */ headerStyle: { backgroundColor: '#000e' }, statusBarHidden: true,
          headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={23} onPress={() => setvideoUri('')} />
        })
        else p.navigation.setOptions({
          title: 'پرسش سوالات',
          /* navigationBarHidden:false, */ headerStyle: { backgroundColor: '#fff' }, statusBarHidden: false,
          headerLeft: () => { }
        })
      }
      setshowChange(true)
    }
    else
      if (videoUri) p.navigation.setOptions({
        headerLeft: () => <Icon style={{ paddingRight: 10, color: '#555' }} name='arrow-left' size={23} onPress={() => setvideoUri('')} />
      })
      else p.navigation.setOptions({ headerLeft: () => { } })
    return () => {
      if (Platform.OS === 'android')
        p.navigation.setOptions({
         /* navigationBarHidden:false, */  headerStyle: { backgroundColor: '#fff' }, statusBarHidden: false,
        })
    }
  }, [to, videoUri]))





  // useFocusEffect(useCallback(() => {
  //   Platform.OS === 'android' &&
  //     BackHandler.addEventListener('hardwareBackPress', () => { if(videoUri){ setvideoUri(''); setTimeout(() => { return p.navigation.navigate('SocketIo') }, 0);} });
  // }, []))


  useFocusEffect(useCallback(() => {

    setTimeout(() => {setshowChange(true)}, 1000);

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
      messages && setPvChatMessage([...messages, { userId: tokenSocket.current, message: 'چطوری میتونم کمکتون کنم؟', _id: 'a1' }])
    })




    socket.current.on("pvChat", async (msg) => {
      setPvChatMessage(messages => [msg, ...messages])
      const socketTocken = await AsyncStorage.getItem('socketTocken')
      if (socketTocken === msg.to) { p.setsocketIoSeen(true) }
    });



    socket.current.on("typing", async (data) => {
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



  // useEffect(() => {
  //   AsyncStorage.setItem('socketDate', JSON.stringify(new Date().getTime())).then(() => { })
  //   return () => {
  //     setPvChatMessage([])
  //     settitleMessage([])
  //     socket.current.emit("delRemove")
  //   }
  // }, [])

  useFocusEffect(useCallback(() => {
    AsyncStorage.setItem('socketDate', JSON.stringify(new Date().getTime())).then(() => { })
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



  return (
    <Column f={1} >
      <SafeAreaView />
      <Animated.View style={{ position: 'absolute', alignSelf: 'center', top: 5, zIndex: 10000, opacity: opacityAnimated, height: 30 }} >
        <P fs={25} h={30} pos='absolute' color='#99f' z={11111111} >{typing}</P>
      </Animated.View>

      {(pvChatMessage.length || titleMessage.length) ?
        <View onLayout={() => { setto('1') }} style={{ flex: 1 }} >
          <FlatList
            ref={flatlistRef}
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


          <Column mt='auto' >
            <InputBottom onClick={() => flatlistRef.current.scrollToOffset({ offset: 0 })} flatlistRef={flatlistRef} handleKeypress={handleKeypress} handlePvChat={handlePvChat} setpvMessage={setpvMessage} pvMessage={pvMessage} socket={socket} tokenSocket={tokenSocket} tokenValue={tokenValue} to={to} ></InputBottom>
          </Column>


          {Platform.OS === 'android' && videoUri ?
            // <Modal show={showVideo} setshow={setshowVideo} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} >
            <Column style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} >
              {videoUri ? <Video source={{ uri: videoUri }} controls paused={false} muted={false} style={{ height: '100%', width: '100%', borderRadius: 4, alignSelf: 'center' }} /> : <></>}
            </Column>
            // </Modal>
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
        <Column mt={22} w='90%' maxw={400} bgcolor='#fff' p={10} br={8} >
          <P ta='right' p={3} >چطوری میتوانیم کمکتان کنیم؟</P>
          <Badge bgcolor={'#0d8'} right={2} />
        </Column>
      }
    </Column>
  )
}
export default AdminSocketIo