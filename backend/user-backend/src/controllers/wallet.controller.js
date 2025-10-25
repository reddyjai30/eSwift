import { ok } from '../utils/ApiResponse.js'
import { Wallet, WalletTxn } from '../models/Wallet.js'

export async function getWallet(req, res) {
  const w = await Wallet.findOne({ userId: req.user.sub })
  res.json(ok({ balance: w?.balance || 0 }))
}

export async function listTxns(req, res) {
  const txns = await WalletTxn.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(200)
  res.json(ok(txns))
}

