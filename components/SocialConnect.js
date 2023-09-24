import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from '../styles/Home.module.css';
import { useAccount, useSignTypedData } from 'wagmi'
import { recoverMessageAddress } from 'viem'
import axios from 'axios';

export function SocialConnect({ platform, botId, name, url, isConnected }) {
    const recoveredAddress = React.useRef("")
    const { address } = useAccount()
    const message = {
        platform,
        bot_id: botId,
        timestamp: Date.now(),
      }
    const { data: signMessageData, error, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData({
      domain: {
        name: 'porta-app',
        version: '"0.1.0',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message,
      primaryType: 'Subscription',
      types: {
        Subscription: [
          { name: 'platform', type: 'string' },
          { name: 'bot_id', type: 'string' },
          { name: 'timestamp', type: 'string' },
        ],
      },
    })
    const [otp, setOTP] = useState('777261');

    useEffect(() => {
        (async () => {
        if (signMessageData) {
            const recoveredAddress = await recoverMessageAddress({
            message,
            signature: signMessageData,
            })
            setIsTelegramConnected(true)
            setIsSignedMessageVisible(false)
            const url = `http://localhost:1234/setChatId`;
            const data = {
                otp,
                address
              };
            const headers = {
            'Content-Type': 'application/json',
            };

            axios
              .post(url, data, { headers })
              .then((response) => {
                  console.log('Response:', response.data);
                  setIsTelegramConnected(true)
                  setIsSignedMessageVisible(false)
              })
              .catch((error) => {
                console.error('Error fetching data:', error);
              });
        }
        })()
    }, [signMessageData, otp, address])

    const [isTelegramConnected, setIsTelegramConnected] = useState(isConnected);
    // NOT_CONNECTED, VERIFING_OTP, REQUEST_USER_SIGNATURE, CONNECTED
    const [telegramConnectStatus, setTelegramConnectStatus] = useState("NOT_CONNECTED");
    const [isTelegramOPTValid, setIsTelegramOPTValid] = useState(false);
    const [isSignedMessageVisible, setIsSignedMessageVisible] = useState(false);
    const handleTelegramConnect = () => {
        window.open(`https://${url}`, '_blank');
        setIsSignedMessageVisible(true);
        setTelegramConnectStatus("VERIFING_OTP");
    };

    const handleSignTypedData = (otp) => {
        setOTP(otp)
        signTypedData()
    };

    const [isDiscordConnected, setIsDidcordSocialConnected] = useState(false);
    const handleDiscordConnect = () => {
        setIsDidcordSocialConnected(true);
    };

    return (
        <div className={styles.card}>
        {isTelegramConnected &&
            <div className={styles.social}>
                {name}
                <Button variant="primary" disabled>
                Subscribed
                </Button>
            </div>
        }
        {!isTelegramConnected &&
            <div className={styles.social}>
                {name}
                {!isSignedMessageVisible && (<Button variant="primary" onClick={handleTelegramConnect}>
                    Subscribe
                </Button>)}
                { (!isTelegramConnected && isSignedMessageVisible) &&
                    <form
                    className={styles.formContainer}
                    onSubmit={(event) => {
                    event.preventDefault()
                    event.message
                    signTypedData(event.message)
                    }}
                >
                    <input
                        id="message"
                        name="message"
                        className={`${styles.inputBox} form-control`}
                        placeholder="Enter OTP"
                    />
                    <button class={`btn btn-primary ${styles.submitButton}`} disabled={isLoading}>
                    {isLoading ? 'Check Wallet' : 'Sign Message'}
                    </button>

                    {signMessageData && (
                    <div>
                        <div>Recovered Address: {recoveredAddress.current}</div>
                        <div>Signature: {signMessageData}</div>
                    </div>
                    )}

                    {error && <div>{error.message}</div>}
                </form>
                }
            </div>
        }
        </div>
    );
}
