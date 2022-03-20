import "./App.css";
import { Connection } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { useEffect, useState } from "react";
import { StakeSOL } from "./utils/stakeSOL";

const NETWORK = web3.clusterApiUrl("devnet");
const connection = new Connection(NETWORK);

export default function App() {
  const [provider, setProvider] = useState();
  const [providerPubKey, setProviderPubKey] = useState();
  const [stakeSOLDetails, setStakeSOLDetails] = useState(null);

  const stakeSOLHandler = async () => {
    try {
      const totalSolToTake = 1 * web3.LAMPORTS_PER_SOL;
      const result = await StakeSOL(totalSolToTake, provider, connection);
      console.log(result);
      setStakeSOLDetails(result);
    } catch (err) {
      console.log(err);
    }
  };
  const connectToWallet = async () => {
    if (!provider && window.solana) {
      setProvider(provider);
    }
    if (!provider) {
      console.log("No provider found");
      return;
    }
    if (provider && !provider.isConnected) {
      provider.connect();
    }
  };
  useEffect(() => {
    if ("solana" in window && !provider) {
      console.log("Phantom wallet present");
      setProvider(window.solana);
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectToWallet}>
          {providerPubKey ? "Connected" : "Connect"} to wallet{" "}
          {providerPubKey ? providerPubKey.toBase58() : ""}
        </button>
        <button onClick={stakeSOLHandler}>
          {console.log(stakeSOLDetails)}
          {stakeSOLDetails && stakeSOLDetails.newStakingAccountPubkey
            ? `Staked SOL account : ${stakeSOLDetails.newStakingAccountPubkey.toBase58()}`
            : "Stake SOL"}
        </button>
      </header>
    </div>
  );
}
