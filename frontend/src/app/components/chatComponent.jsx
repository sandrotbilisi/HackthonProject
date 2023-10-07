import React, { useState } from 'react';
import { useWaku } from '../waku'; // Assuming you have the useWaku hook in a separate file

const ChatComponent = () => {
  const { messages, sendMessage } = useWaku();
  const [messageText, setMessageText] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSendMessage = async () => {
    if (!messageText || !recipient) {
      // You may want to add validation for empty message or recipient
      return;
    }

    // Call the sendMessage function from the useWaku hook
    await sendMessage(username, messageText, recipient);

    // Clear the message input field after sending
    setMessageText('');
  };

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
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.sender}:</strong> {message.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatComponent;
