"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "./WalletConnect";
import { 
  rpc, 
  TransactionBuilder, 
  Networks, 
  Contract, 
  xdr, 
  scValToNative, 
  nativeToScVal,
  Account
} from "@stellar/stellar-sdk";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "C_PLACEHOLDER_CONTRACT_ADDRESS_HERE";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new rpc.Server(RPC_URL);

interface PollResult {
  option: string;
  votes: number;
}

const OPTIONS = ["A", "B", "C"]; // Example options

export function LivePoll() {
  const { address, kit, setError } = useWallet();
  const [results, setResults] = useState<PollResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [txStatus, setTxStatus] = useState<"Pending" | "Success" | "Fail" | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      if (CONTRACT_ID === "C_PLACEHOLDER_CONTRACT_ADDRESS_HERE") {
        setIsLoading(false);
        return;
      }
      
      const contract = new Contract(CONTRACT_ID);
      
      // We simulate a read to 'get_votes' using simulateTransaction
      // Since get_votes doesn't require signature, we can use a dummy source account
      const source = new Account("GA7YDROP4M3GMC5A6IWYQAL5K6V6XFF4Y2GZ5UUC2CJJ24JEX2SDRDQA", "0");
      const tx = new TransactionBuilder(source, { fee: "100", networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(contract.call("get_votes"))
        .setTimeout(30)
        .build();

      const response = await server.simulateTransaction(tx);
      
      if (rpc.Api.isSimulationSuccess(response)) {
        // response.result.retval is an xdr.ScVal
        const mapVal = scValToNative(response.result.retval);
        
        // Parse mapVal into an array of PollResult
        const newResults: PollResult[] = [];
        if (mapVal) {
          Object.keys(mapVal).forEach(key => {
             newResults.push({ option: key, votes: mapVal[key] });
          });
        }
        
        // Fill in missing options with 0
        const finalResults = OPTIONS.map(opt => ({
          option: opt,
          votes: newResults.find(r => r.option === opt)?.votes || 0
        }));
        
        setResults(finalResults);
      }
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    // Real-time sync: poll every 5 seconds
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  const handleVote = async (option: string) => {
    if (!address || !kit) {
      setError("Wallet not found/installed. Please connect your wallet first.");
      return;
    }

    try {
      setTxStatus("Pending");
      setError(null);
      
      const sourceAccount = await server.getAccount(address);
      const contract = new Contract(CONTRACT_ID);
      
      const tx = new TransactionBuilder(sourceAccount, { 
        fee: "1000", // Will be simulated
        networkPassphrase: NETWORK_PASSPHRASE 
      })
      .addOperation(contract.call("vote", nativeToScVal(option, { type: "symbol" })))
      .setTimeout(30)
      .build();

      // Simulate first to get real fee and footprint
      const simResponse = await server.simulateTransaction(tx);
      
      if (rpc.Api.isSimulationError(simResponse)) {
         throw new Error("Simulation failed. Check contract and arguments.");
      }

      // Assemble the transaction with the footprint and proper fee
      const readyTx = rpc.assembleTransaction(tx, NETWORK_PASSPHRASE, simResponse).build();

      // Request signature from user
      const signedXdr = await kit.signTransaction(readyTx.toXDR(), { 
        networkPassphrase: NETWORK_PASSPHRASE 
      });

      const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      
      // Submit transaction
      const sendResponse = await server.sendTransaction(signedTx);
      
      if (sendResponse.status === "PENDING") {
        // Poll for status
        let getTxResponse = await server.getTransaction(sendResponse.hash);
        while (getTxResponse.status === "NOT_FOUND") {
          await new Promise(resolve => setTimeout(resolve, 1000));
          getTxResponse = await server.getTransaction(sendResponse.hash);
        }
        
        if (getTxResponse.status === "SUCCESS") {
          setTxStatus("Success");
          fetchResults(); // Immediate sync
        } else {
          setTxStatus("Fail");
          throw new Error("Transaction failed on-chain.");
        }
      }
    } catch (err: any) {
      setTxStatus("Fail");
      
      const errMsg = err.message || "";
      if (errMsg.includes("User declined") || errMsg.includes("rejected")) {
        setError("Transaction rejected by user.");
      } else if (errMsg.includes("tx_insufficient_balance") || errMsg.includes("op_underfunded")) {
        setError("Insufficient balance for fees.");
      } else {
        setError(`Voting failed: ${errMsg}`);
      }
    }
  };

  const totalVotes = results.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Live Poll</h2>
          {txStatus === "Pending" && (
            <span className="flex items-center gap-2 text-blue-500 font-medium text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
              <Loader2 size={16} className="animate-spin" /> Pending
            </span>
          )}
          {txStatus === "Success" && (
            <span className="flex items-center gap-2 text-emerald-500 font-medium text-sm bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
              <CheckCircle size={16} /> Success
            </span>
          )}
          {txStatus === "Fail" && (
            <span className="flex items-center gap-2 text-red-500 font-medium text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
              <XCircle size={16} /> Fail
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {results.length > 0 ? results.map((result) => {
              const percentage = totalVotes > 0 ? Math.round((result.votes / totalVotes) * 100) : 0;
              
              return (
                <div key={result.option} className="relative">
                  <button
                    onClick={() => handleVote(result.option)}
                    disabled={txStatus === "Pending"}
                    className="w-full relative z-10 flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors bg-white/50 dark:bg-black/50 backdrop-blur-sm group"
                  >
                    <span className="font-semibold text-lg text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white">
                      Option {result.option}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">
                      {result.votes} votes ({percentage}%)
                    </span>
                  </button>
                  <div 
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-all duration-1000 ease-out z-0"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              );
            }) : (
              <div className="text-center text-zinc-500 py-8">
                Please deploy your contract and update CONTRACT_ID in the code to see the poll.
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-950 p-4 text-center text-sm text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
        Results auto-sync every 5 seconds
      </div>
    </div>
  );
}
