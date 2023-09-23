import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from '../styles/Home.module.css';
import { useSignMessage } from 'wagmi'
import { recoverMessageAddress } from 'viem'

export function SocialConnect() {
    const recoveredAddress = React.useRef("")
    const { data: signMessageData, error, isLoading, signMessage, variables } = useSignMessage()

    useEffect(() => {
        (async () => {
        if (variables?.message && signMessageData) {
            const recoveredAddress = await recoverMessageAddress({
            message: variables?.message,
            signature: signMessageData,
            })
            setIsTelegramConnected(true)
        }
        })()
    }, [signMessageData, variables?.message])

    const [isTelegramConnected, setIsTelegramConnected] = useState(false);
    // NOT_CONNECTED, VERIFING_OTP, REQUEST_USER_SIGNATURE, CONNECTED
    const [telegramConnectStatus, setTelegramConnectStatus] = useState("NOT_CONNECTED");
    const [isTelegramOPTValid, setIsTelegramOPTValid] = useState(false);
    const [isSignedMessageVisible, setIsSignedMessageVisible] = useState(false);
    const handleTelegramConnect = () => {
        window.open('https://t.me/porta_eth_bot', '_blank');
        setIsSignedMessageVisible(true);
        setTelegramConnectStatus("VERIFING_OTP");
    };

    const [isDiscordConnected, setIsDidcordSocialConnected] = useState(false);
    const handleDiscordConnect = () => {
        setIsDidcordSocialConnected(true);
    };

    return (
        <div className={styles.socialcontainer}>
        <h1>Social Bot Connection</h1>
        {isDiscordConnected ? (
            <div className={styles.social}>
            <p>Discord</p>
            <Button variant="outline-secondary" disabled>
                Subscribed
            </Button>
            </div>
        ) : (
            <div className={styles.social}>
            <p>Discord</p>
            <Button variant="outline-primary" onClick={setIsDidcordSocialConnected}>
                Subscribe
            </Button>
            </div>
        )}
        {isTelegramConnected ? (
            <div className={styles.social}>
            <p>Telegram</p>
            <Button variant="outline-secondary" disabled>
            Subscribed
            </Button>
            </div>
        ) : (
            <div className={styles.social}>
            <p>Telegram</p>
            <Button variant="outline-primary" onClick={handleTelegramConnect}>
                Subscribe
            </Button>
            </div>
        )}
        { isSignedMessageVisible &&  
            <form
            onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.target)
            const message = formData.get('message')
            signMessage({ message })
            }}
        >
            <label htmlFor="message">Enter a message to sign</label>
            <textarea
            id="message"
            name="message"
            placeholder="The quick brown fox…"
            />
            <button disabled={isLoading}>
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
    );
}
