"use client"
import React, { useState } from 'react';
import { ConnectButton } from './components/connectButton';
import ChatComponent from './components/chatComponent';

const App = () => {

  const [address, setAddress] = useState("")
  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
};

    return (
        <><ConnectButton onAddressChange={handleAddressChange}>

      </ConnectButton>
      
      <ChatComponent address={address}>

        </ChatComponent></>
        
    )
};

export default App;
