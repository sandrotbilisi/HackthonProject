import React, { useState } from 'react';
import { useWaku } from '../waku'; // Assuming you have the useWaku hook in a separate file
import { ethers } from 'ethers';
import axios from 'axios';
import EthCrypto from 'eth-crypto';
import * as esu from '@metamask/eth-sig-util';

const ChatComponent = ({address}) => {
  const { messages, sendMessage } = useWaku();
  const [messageText, setMessageText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [decryptedMessages, setDecryptedMessages] = useState([]);


const encryptMessage = async (message, publicKey) => {
    const encryptedMessage = await esu.encrypt(
      {publicKey: publicKey, data: message, version: 'x25519-xsalsa20-poly1305'}
    )
    return encryptedMessage;
}

  const handleSendMessage = async () => {
    if (!messageText || !recipient) {
      return;
    }

    const publicKey = await axios.get(`http://localhost:3001/database/getPublicKey?address=${encodeURIComponent(recipient)}`)

    if (!!publicKey) {
      const encryptedMessage = await encryptMessage(messageText, publicKey.data.publicKey);
      console.log(encryptedMessage);
      await sendMessage(address, JSON.stringify(encryptedMessage), recipient);
      setMessageText('');
      } else {
      console.log("No public key found for recipient");

  };
}

const handleDecryptMessage = async (message) => {
    const decrypted = await window.ethereum.request({
      "method": "eth_decrypt",
      "params": [
        message.message,
        address
      ]
    });
    console.log(decrypted);
    setDecryptedMessages([...decryptedMessages, decrypted]);
  }

return (
  <div>
    <div>
      <label>Recipient:</label>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
    </div>
    <div>
      <label>Message:</label>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
    <div>
      <h2>Messages:</h2>
      <ul>
        {messages
          .filter((message) => message.recipient === address || message.sender === address) // Filter messages by recipient
          .map((message, index) => (
            <li key={index}>
              <strong>{message.sender}:</strong> {message.message}
              <button onClick={() => handleDecryptMessage(message)} style={{backgroundColor: 'blue', color: 'white'}}>Decrypt</button>
            </li>
          ))}
      </ul>
    </div>
    <div>
          <h2>Decrypted Messages:</h2>
          <ul>
            {decryptedMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
  </div>
);
          }

export default ChatComponent;
