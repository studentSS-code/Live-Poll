<img width="1349" height="632" alt="Screenshot 2026-04-28 165048" src="https://github.com/user-attachments/assets/f51067e7-e9a3-4542-b7ce-87ed258742e5" />
# Stellar Live Poll

A decentralized Live Poll application built for the **Stellar Journey to Mastery Level 2 (Yellow Belt)** challenge. This project leverages the Stellar network and Soroban smart contracts to provide a secure, real-time voting experience.

## 🎯 Purpose

The primary purpose of the Stellar Live Poll is to demonstrate the integration of modern frontend technologies (Next.js) with the Stellar blockchain via Soroban smart contracts. It serves as an educational milestone in the Journey to Mastery, showcasing how to interact with smart contracts, manage wallet connections, and handle on-chain transactions efficiently.

## 🚀 Features

- **Multi-Wallet Integration:** Seamlessly connect using Freighter, Albedo, and Hana wallets via `@creit.tech/stellar-wallets-kit`.
- **Soroban Smart Contract:** A robust Rust-based smart contract deployed on the Stellar Testnet to securely manage poll states and tabulate votes.
- **Real-Time Sync:** Automatic polling for transaction statuses (Pending, Success, Fail), ensuring the UI is always up-to-date with the blockchain state.
- **Robust Error Handling:** Comprehensive alerts and fallback mechanisms for:
  - Wallet not found or not installed
  - Transactions rejected by the user
  - Insufficient balances for transaction fees
- **Modern User Interface:** Built with Next.js, providing a responsive and intuitive user experience.

## 🗺️ Milestones

- [x] Initial project setup and repository creation.
- [x] Soroban smart contract development for voting logic.
- [x] Smart contract deployment to Stellar Testnet.
- [x] Next.js frontend setup and UI design.
- [x] Stellar Wallets Kit integration (Freighter, Albedo, Hana).
- [x] Implement vote reading and writing to the smart contract.
- [x] Real-time transaction status polling.
- [x] Comprehensive error handling and user feedback.
- [x] Detailed project documentation and README.

## 🔗 Challenge Details

- **Live Demo Link:** [Insert Live Demo Link Here]
- **Contract Address:** [Insert Contract Address Here]
- **Transaction Hash:** [Insert Transaction Hash Here]

## 📂 Project Structure

- `contracts/`: Contains the Soroban smart contract written in Rust.
- `frontend/`: Contains the Next.js web application with Stellar Wallets Kit integration.

## 🛠️ Smart Contract Setup & Deployment

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
   *Note the Contract ID returned and paste it into the frontend `LivePoll.tsx`.*

## 💻 Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Contract ID:**
   Open `frontend/src/components/LivePoll.tsx` (or your relevant configuration file) and update the `CONTRACT_ID` constant with your deployed contract address.
   Alternatively, add a `.env.local` file with:
   ```env
   NEXT_PUBLIC_CONTRACT_ID=your_contract_address
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
