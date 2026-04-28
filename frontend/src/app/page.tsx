import { WalletProvider, WalletConnect } from "@/components/WalletConnect";
import { LivePoll } from "@/components/LivePoll";

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                S
              </div>
              StellarPoll
            </div>
            <WalletConnect />
          </div>
        </header>
        
        <main className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center gap-16">
          <div className="text-center space-y-6 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Vote with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Soroban</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
              A decentralized live poll application built for the Stellar Journey to Mastery challenge. Connect your wallet to cast your vote.
            </p>
          </div>
          
          <div className="w-full">
            <LivePoll />
          </div>
        </main>
      </div>
    </WalletProvider>
  );
}
