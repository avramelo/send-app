# Token Transfer dApp

Web3 application for managing and transferring tokens, with support for both EOA and Safe wallets.

## Features

- EOA wallet connection (via RainbowKit)
- View ETH and ERC20 token balances
- Send tokens from EOA wallet
- Safe Wallet integration:
  - Create new Safe wallet
  - Connect existing Safe wallet
  - View Safe wallet balances

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [RainbowKit](https://rainbowkit.com) - Wallet connection UI
- [wagmi](https://wagmi.sh) - React Hooks for Ethereum
- [Safe Protocol Kit](https://github.com/safe-global/safe-core-sdk) - Safe wallet integration
- [Material-UI](https://mui.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file with required environment variables:

```
NEXTAUTH_SECRET=6ecf9275c304c6e7bf5c491e84e53a3b21b9045dcbc6c167116edfb9dbfa3b26
NEXT_PUBLIC_PROJECT_ID=your_project_id
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Connect your EOA wallet using the "Connect Wallet" button
2. To create a Safe wallet:
   - Click "Create Safe"
   - Enter threshold and additional owners
   - Confirm transaction
3. To connect existing Safe wallet:
   - Click "Connect Safe"
   - Enter Safe wallet address
4. To send tokens:
   - Select token from the table
   - Enter recipient address and amount
   - Confirm transaction

## Networks

Currently supported networks:

- Sepolia testnet

## Learn More

To learn more about this stack, take a look at the following resources:

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.

You can check out [the RainbowKit GitHub repository](https://github.com/rainbow-me/rainbowkit) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
