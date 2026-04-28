"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  ALBEDO_ID,
  HANA_ID,
  IWalletInfo
} from "@creit.tech/stellar-wallets-kit";
import { Wallet, AlertCircle } from "lucide-react";

interface WalletContextType {
  address: string | null;
  kit: StellarWalletsKit | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
  setError: (err: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the kit only on the client side
    const initKit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
    setKit(initKit);
  }, []);

  const connect = async () => {
    setError(null);
    if (!kit) return;
    try {
      await kit.openModal({
        onWalletSelected: async (option: IWalletInfo) => {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          setAddress(address);
        },
        modalTitle: "Connect your Stellar Wallet",
      });
    } catch (err: any) {
      if (err?.message?.includes("not found") || err?.message?.includes("installed")) {
        setError("Wallet not found/installed. Please install a supported Stellar wallet.");
      } else {
        setError(err.message || "Failed to connect wallet.");
      }
    }
  };

  const disconnect = () => {
    setAddress(null);
    // In a real app, you might want to call kit.disconnect() if supported
  };

  return (
    <WalletContext.Provider value={{ address, kit, connect, disconnect, error, setError }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export function WalletConnect() {
  const { address, connect, disconnect, error } = useWallet();

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm max-w-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {address ? (
        <div className="flex items-center gap-4">
          <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full font-mono text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={disconnect}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          <Wallet size={18} />
          Connect Wallet
        </button>
      )}
    </div>
  );
}
