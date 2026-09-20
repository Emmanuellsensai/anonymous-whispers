# Preprod Users - Level 5

**Target:** 50 verified wallet addresses on Midnight Preprod
**Contract:** `0b24b5da3eaf66860c1b69a6d31f3e86089b5c4af48c2dc4be6f6c5b7f4b34f5`

## How To Verify These Users

Anonymous Whispers is a privacy dApp. By design, the on-chain state does not
link a wallet address to a report's content: every submission goes out under a
single-use ephemeral keypair, and the plaintext never leaves the reporter's
browser. So a judge cannot open the ledger and see "wallet X wrote report Y" -
that is the product working correctly.

What *can* be verified on Preprod:

1. **The wallet address exists on Preprod.** Any Midnight Preprod explorer
   accepts the address and shows its history.
2. **The wallet called our contract.** The `Tx Hash` column below is the
   transaction where that wallet invoked `submit_encrypted_report` (or
   `register_recipient`) on contract
   `0b24b5da3eaf66860c1b69a6d31f3e86089b5c4af48c2dc4be6f6c5b7f4b34f5`.
   Opening the tx hash on the explorer will show: caller address, contract
   address, and the circuit invoked.
3. **A random sample is enough.** Pick 5 rows at random and check the tx
   hash matches this contract. If a judge wants to verify every row, that
   also works, but the privacy model is the same across all of them.

What cannot be verified, on purpose:
- Which submission each wallet produced (ephemeral keys break the link)
- What any submission contained (encrypted end-to-end)

## User List

| #  | Wallet Address | Tx Hash | Date Added |
|----|----------------|---------|------------|
|    |                |         |            |

**Current count: 0 / 50**
