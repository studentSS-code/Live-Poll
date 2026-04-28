<img width="1349" height="632" alt="Screenshot 2026-04-28 165048" src="https://github.com/user-attachments/assets/f51067e7-e9a3-4542-b7ce-87ed258742e5" />
# Stellar Live Poll

A decentralized Live Poll application built for the Stellar Journey to Mastery Level 2 (Yellow Belt) challenge.

## Challenge Details

- **Live Demo Link:** [Insert Live Demo Link Here]
- **Contract Address:** [Insert Contract Address Here]
- **Transaction Hash:** [Insert Transaction Hash Here]

## Project Structure

- `contracts/`: Soroban smart contract written in Rust.
- `frontend/`: Next.js web application with Stellar Wallets Kit integration.

## Smart Contract Deployment

### Prerequisites
- Install [Rust](https://rustup.rs/)
- Install `stellar-cli` by following the [official instructions](https://developers.stellar.org/docs/smart-contracts/getting-started/setup).

### Build & Deploy

1. **Build the contract:**
   ```bash
   cd contracts
   stellar contract build
   ```

2. **Generate Testnet Identity (if not already created):**
   ```bash
   stellar keys generate alice --network testnet
   ```

3. **Deploy the contract to Testnet:**
   ```bash
   stellar contract deploy \
     --wasm target/wasm32-unknown-unknown/release/contracts.wasm \
     --source alice \
     --network testnet
   ```
   *Note the Contract ID returned and paste it into the `README.md` and frontend `LivePoll.tsx`.*

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Contract ID:**
   Open `frontend/src/components/LivePoll.tsx` and update the `CONTRACT_ID` constant with your deployed contract address.
   Alternatively, add a `.env.local` file with `NEXT_PUBLIC_CONTRACT_ID=your_contract_address`.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Features

- **Multi-Wallet Integration:** Supports Freighter, Albedo, and Hana via `@creit.tech/stellar-wallets-kit`.
- **Smart Contract Interaction:** Reads and writes voting data to a Soroban smart contract on the Stellar Testnet.
- **Mandatory Error Handling:** Captures and displays alerts for:
  - Wallet not found/installed
  - Transaction rejected by user
  - Insufficient balance for fees
- **Real-Time Sync:** Automatically polls for transaction status (Pending, Success, Fail) and updates the UI.
