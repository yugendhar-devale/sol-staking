import {
  Authorized,
  Keypair,
  PublicKey,
  StakeProgram,
  Transaction,
} from "@solana/web3.js";

export const StakeSOL = async (totalSolToTake, provider, connection) => {
  totalSolToTake = totalSolToTake || 1 * 1000000000;
  if (!provider || (provider && !provider.isConnected)) {
    return "Wallet is not connected, please connect the wallet.";
  }
  const votingAccountToDelegate = new PublicKey(
    "9GzUpELW7KQDcvsz5nqxtrA2ganjsNgQSvHRRV3ffVYq"
  );

  const newStakingAccount = Keypair.generate();
  const staker = provider.publicKey;
  const withdrawer = staker;

  const authorizedStakerInstance = new Authorized(staker, withdrawer);

  const transaction = new Transaction().add(
    StakeProgram.createAccount({
      fromPubkey: provider.publicKey,
      stakePubkey: newStakingAccount.publicKey,
      authorized: authorizedStakerInstance,
      lamports: totalSolToTake,
    })
  );
  const temp = await connection.getRecentBlockhash();
  console.log(temp);
  transaction.recentBlockhash = temp.blockhash;
  transaction.feePayer = provider.publicKey;
  const instruction = StakeProgram.delegate({
    stakePubkey: newStakingAccount.publicKey,
    authorizedPubkey: staker,
    votePubkey: votingAccountToDelegate,
  });
  transaction.add(instruction);
  transaction.partialSign(newStakingAccount);
  console.log("WTF");
  try {
    let signed = await provider.signTransaction(transaction);
    console.log("Got signature, submitting transaction", signed);
    let signature = await connection.sendRawTransaction(signed.serialize());
    console.log("Transaction " + signature + " confirmed");
    return {
      newStakingAccountPubkey: newStakingAccount.publicKey,
      transactionId: signature,
    };
  } catch (err) {
    console.log(err);
  }
};
