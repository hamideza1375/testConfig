import React from 'react'
import moment from 'moment-jalaali';
import { Column, FlatList, Button, P } from '../../other/Components/Html';
import spacePrice from '../../other/utils/spacePrice';
import linking from '../../other/utils/linking';


const arr = [{
  _id:'1111',
  fullname: 'fullname' ,
  phone: 'phone' ,
  price: 'price' ,
  titles: 'titles' ,
  unit: 'unit' ,
  plaque: 'plaque' ,
  postalCode: 'postalCode' ,
  address: 'address' ,
  date: 'date' ,
  checkSend: 0 ,
  queueSend: 0 ,
  send: 1 ,
}]


const Address = (p) => {
  // p._admin.getAllAddress()

  return (
    <Column f={1} >
      <FlatList
        cacheId={'flatlistAddress'}
        data={arr}
        contentContainerStyle={{ paddingBottom: 55, }}
        renderItem={({ item, index }) => (
          <Column
            key={item._id} style={{
              alignSelf: 'center',
              borderWidth: .3,
              borderColor: 'silver',
              width: '95%',
              marginVertical: 10,
              padding: 15,
              backgroundColor: '#fff',
              borderRadius: 4
            }}>
            <CardAddress {...p} item={item} />
          </Column>
        )} />
    </Column>
  )
}
export default Address



function CardAddress(p){
  const postedOrder = (_id) => {}
  const postQueue = (_id) => {}

  const lineStyle = { textDecorationLine: p.item.queueSend ? 'line-through' : 'none', textDecorationStyle: 'solid', color: p.item.queueSend ? '#aaa' : 'black' }
  const lineStyle2 = { textDecorationLine: p.item.queueSend ? 'line-through' : 'none', textDecorationStyle: 'solid', color: p.item.queueSend ? '#aaa' : 'black', fontWeight: 'bold', textAlign: 'left' }
  const containerColumn = { borderBottomWidth: .2, borderColor: 'silver', paddingVertical: 15, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, }


  return (
    <>
      <Column style={[containerColumn, { paddingVertical: 0, paddingBottom: 20, paddingTop:4 }]} >
        <P mb={-4} style={lineStyle}><P fw='bold' ta='left' >نام: </P>{p.item.fullname}</P>
        <Column mb={-4} fd='row'>
          <P style={lineStyle2} >شماره تلفن: </P><P onClick={() => linking('tel:p.item.phone')} style={lineStyle} >{p.item.phone}</P></Column>
      </Column>
      <Column bbw={1} p={15} w='100%' style={{borderColor: 'silver' }} >
        <P style={lineStyle}  ><P style={lineStyle2} >آدرس: </P >{p.item.address}</P>
      </Column>
      <Column style={containerColumn} >
        <P style={lineStyle} ><P fw='bold' >پلاک: </P>{p.item.plaque}</P>
        <P style={lineStyle} ><P fw='bold' >طبقه: </P>{p.item.unit}</P>
        {p.item.postalCode?<P style={lineStyle} ><P fw='bold' >کد پستی: </P>{p.item.postalCode}</P>:<></>}
      </Column>

      <Column bbw={1} p={15} w='100%' style={{borderColor: 'silver' }} >
        <P style={lineStyle}  ><P style={lineStyle2} >اسامی سفارش: </P >{p.item.titles}</P>
      </Column>

      {p.item.description && <Column bbw={1} p={15} w='100%' style={{borderColor: 'silver' }} >
        <P style={lineStyle}  ><P style={lineStyle2} >توضیحات سفارش: </P >{p.item.description}</P>
      </Column>}

      <Column style={containerColumn} >
        <P style={lineStyle} ><P fw='bold' >قیمت: </P>{spacePrice(p.item.price)} تومان</P>
        <P color='#ababab' >{moment(p.item.date).format('jM/jD hh:mm')}</P>
      </Column>
      <Column pt={15} w='100%' fd='row' jc='space-around' >
        <Button outline bgcolor={!p.item.queueSend ? 'orange' : 'red'} h={35} fs={12} p={0} onClick={() => { postQueue(p.item._id); }} > {!p.item.queueSend ? 'در صف ارسال ' : 'خروج از صف'}</Button>
        <Button outline bgcolor='green' h={35} fs={12} p={0} onClick={() => { postedOrder(p.item._id) }} >ارسال شد</Button>
        {p.item.latlng?.lat ? <Button outline bgcolor='blue' h={35} fs={12} p={0} onClick={() => { p.navigation.navigate('ShowLatLngOnMap', { latlng: JSON.stringify(p.item.latlng) }) }} >نمایش</Button> : <></>}
      </Column>
    </>
  )
}



