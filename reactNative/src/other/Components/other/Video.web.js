
import * as React from 'react';
export default function App(props) {
  return (
      <video style={{width:'100%', maxHeight:'100vh', objectFit:'cover'}} controls {...props} >
        <source src={props.source.uri} type='video/ogg' />
        <source src={props.source.uri} type='video/mp4' />
      </video>
  );
}