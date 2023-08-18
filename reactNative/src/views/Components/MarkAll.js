import React, { useEffect, useState } from 'react'
import { P, Icon, M_icon, Column, FlatList } from '../../other/Components/Html'


const mapId = new Map()
const MarkAll = (p) => {

  const [proposal, setproposal] = useState([])
  
  useEffect(() => {
    setproposal([
      { _id: '1', title: '1', imageUrl: 'p1.png' },
      { _id: '2', title: '2', imageUrl: 'e.png' },
      { _id: '3', title: '3', imageUrl: '7.png' },
      { _id: '4', title: '4', imageUrl: 'e.png' },
    ])
  }, [])

  const [proposalId, setproposalId] = useState([])

  
  return (
    <Column f={1} >
      <GetProposalNavbar proposal={proposal} proposalId={proposalId} setproposalId={setproposalId} {...p} mapId={mapId} />
      <FlatList
        data={proposal}
        bgcolor='#fff'
        ccStyle={{ width: '100%', minWidth: '60%', alignSelf: 'center', paddingBottom: 15 }}
        renderItem={({ item, index }) => (
          <GetProposalCard proposalId={proposalId} setproposalId={setproposalId} proposal={proposal} setproposal={setproposal} {...p} item={item} mapId={mapId} />
        )}
      />
    </Column>
  )
}
export default MarkAll



function GetProposalCard(p) {
  return (
    <Column p={9} bgcolor='#ddd' border={[1, 'silver']} br={2} mt={15} as='center' w={300} >
      <P w={14} h={14} mt={-7} mb={3} nativeStyle={{ marginHorizontal: 10 }} border={[1, '#aaa']} id={p.item._id} onClick={() => {
        p.mapId.set(p.item._id, !p.mapId.get(p.item._id))
        p.$?.id(p.item._id).$({ backgroundColor: p.mapId.get(p.item._id) ? '#1d6' : '#ddd' })
        if (p.mapId.get(p.item._id)) p.setproposalId(proposalId => proposalId.concat(p.item._id))
        else p.setproposalId(proposalId => proposalId.filter((ps) => ps !== p.item._id))
      }} />
      <Column p={12} nativeStyle={{ marginHorizontal: 10 }} mb={7} bgcolor='#fff' ><P ta='right' fs={12} fm='IRANSansWeb-light' >{p.item.message}</P></Column>
    </Column>)
}



function GetProposalNavbar(p) {
  const [show, setshow] = useState(true)
  return (
    <Column fd='row-reverse' mv={4} >
      <Icon name='trash' size={22} style={{ marginHorizontal: 14 }} />
      <M_icon name='select-all' size={22} style={{ marginHorizontal: 14 }}
        onClick={() => {
          for (let item of p.proposal) {
            setshow(!show)
            p.mapId.set(item._id, show)
            p.$?.id(item._id).$({ backgroundColor: show ? '#1d6' : '#ddd' })
            if (show) p.setproposalId(proposalId => proposalId.concat(item._id))
            else p.setproposalId(proposalId => proposalId.filter((ps) => ps !== item._id))
          }
        }} />
    </Column>)
}

