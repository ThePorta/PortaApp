import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount, useSendTransaction } from 'wagmi'
import { parseEther } from 'ethers'
import { Button } from 'react-bootstrap';
import styles from '../styles/Home.module.css';

function SubmitTx() {
  const router = useRouter();
  const { uuid } = router.query;
  const { address } = useAccount()

  const [inputData, setInputData] = useState(undefined);
  const [targetContract, setTargetContract] = useState(undefined);
  const [error, setError] = useState("");

  const { data, sendTransaction, isLoading, isSuccess  } =
  useSendTransaction({
    account: address,
    to: targetContract,
    data: inputData,
    value: parseEther('0'),
  })

  useEffect(() => {

    const url = `http://localhost:1234/getInputData?uuid=${uuid}`;

    axios
      .get(url)
      .then((response) => {
        const { targetContract, inputData, chainId, chainName } = response.data;
        setTargetContract(targetContract);
        setInputData(inputData);
        setError("")
      })
      .catch((error) => {
        setError(`url: ${url} ${error}`)
        console.error('Error fetching data:', error);
      });
  }, [uuid]);

  const confirm = () => {
    console.log(`sendTransaction = ${sendTransaction}`)
    sendTransaction?.()
  };

  return (
    <div className={styles.main}>
    <Link href="/">
        <Image
            src="/porta-logo.png"
            alt="Porta Logo"
            width={213}
            height={87.5}
            />
    </Link>
    <ConnectButton />
      <div className={styles.card}>
        <div className={styles.boldTitle}>UUID:</div>
        <div>{uuid || ""}</div>
        <div className={styles.boldTitle}>Data:</div>
        <div>{inputData}</div>
        <div className={styles.boldTitle}>Target:</div>
        <div>{targetContract}</div>
        {/* <div className={styles.boldTitle}>Address:</div> */}
        {/* <div>{address}</div> */}
      </div>
      <Button variant="outline-primary" disabled={isLoading || !sendTransaction} onClick={confirm}>
        {isLoading ? 'Sending...' : 'Confirm Transaction'}
      </Button>

      {isSuccess && (
        <div>
          Transaction Successfully sent to {targetContract}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
      {error && (
        <div>
          {error}
        </div>
      )}
    </div>
  );
}

export default SubmitTx;
