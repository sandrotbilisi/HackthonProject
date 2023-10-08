"use client"

import React, { useState, useContext, useEffect } from 'react';
import Web3 from 'web3';
import EthCrypto from 'eth-crypto';
import axios from 'axios';



const styles = {
    container: {
      textAlign: 'center',
      padding: '20px',
    },
    button: {
      background: 'blue',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      outline: 'none',
    },
    connectedInfo: {
      marginTop: '10px',
    },
  };

export const ConnectButton = ({ onAddressChange }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    const [ethBalance, setEthBalance] = useState('');
    const buttonText = isConnected ? 'Disconnect' : 'Connect Wallet';


    const ConnectButtonHandler = async () => {
        
        if (!isConnected) {
            try {
                await window.ethereum.enable();
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                setUserAddress(account);
                onAddressChange(account)
                await switchToMainnet();
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [account, 'latest'],
                });
                const ethAmount = parseInt(balance, 16) / 10 ** 18;
                setEthBalance(ethAmount);
                setIsConnected(true, () => {
                    console.log(isConnected);
                })

                const publicKey = (await axios.get(`http://localhost:3001/database/getPublicKey?address=${encodeURIComponent(account)}`)).data.publicKey;
                console.log(publicKey)

                if (!publicKey) {
                try {
                    
                /*
                let secretMsgSignature = await window.ethereum.request({
                    "method": "personal_sign",
                    "params": [
                      EthCrypto.hash.keccak256("Sign the following message to prove you own this account."),
                      account
                    ]
                  });

                  let pubkey_ethcrypto = await EthCrypto.recoverPublicKey(
                    secretMsgSignature,
                    EthCrypto.hash.keccak256("Sign the following message to prove you own this account."));
                
                console.log(pubkey_ethcrypto)
                */
               let pubkey_ethcrypto = await window.ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [account],
                });

                await axios.post(`http://localhost:3001/database/insertPublicKey`, {address: account, publicKey: pubkey_ethcrypto})
                }
                catch (error) {
                    console.error('Error adding public key:', error);
                }
            }
                else{
                    console.log("Public key already exists for this address")
                }

            } catch (error) {
                console.error('Error connecting wallet:', error);
            }
        } else {
            try {
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                    params: [{eth_accounts: {}}]
                })
                setUserAddress('');
                setEthBalance('');
                setIsConnected(false, () => {
                    console.log(isConnected);
                });
            } catch (error) {
                console.error('Error disconnecting wallet:', error);
            }
        }
    }

    const switchToMainnet = async () => {
        try {
            if (window.ethereum.chainId === '0x1') {
                console.log('Already on Mainnet');
                return;
            }

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(1) }],
            });
        } catch (error) {
            console.error('Error switching to Mainnet:', error);
        }
    }

    useEffect(() => {
        
        if (window.ethereum.selectedAddress) {
            setIsConnected(true);
            setUserAddress(window.ethereum.selectedAddress);
            onAddressChange(window.ethereum.selectedAddress)

            const getEthBalance = async () => {
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [window.ethereum.selectedAddress, 'latest'],
                });
                const ethAmount = parseInt(balance, 16) / 10 ** 18;
                setEthBalance(ethAmount);
            };
            getEthBalance();
        } else {
            setIsConnected(false);
            setUserAddress('');
            setEthBalance('');
        }
    }, []);

    return (
        <div style={styles.container}>
          <button style={styles.button} onClick={ConnectButtonHandler}>
            {buttonText}
          </button>
          {isConnected && (
            <div style={styles.connectedInfo}>
              <p>Address: {userAddress}</p>
              <p>ETH Balance: {ethBalance} ETH</p>
            </div>
          )}
        </div>
      );
}