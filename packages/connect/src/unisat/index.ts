import { getAddressFormat } from "../address"
import { Network } from "../network"
import { UnisatMessageOptions } from "./types"
import { isUnisatInstalled, UnisatNetwork } from "./utils"

export async function connectUnisat(network: Network) {
  if (!isUnisatInstalled()) {
    throw new Error("Unisat not installed.")
  }

  if (!network) {
    throw new Error("Invalid options provided.")
  }

  let targetNetwork: UnisatNetwork = "livenet"
  const connectedNetwork = await window.unisat.getNetwork()

  if (network === "testnet") {
    targetNetwork = network
  }

  if (connectedNetwork !== targetNetwork) {
    await window.unisat.switchNetwork(targetNetwork)
  }

  const accounts = await window.unisat.requestAccounts()
  const publicKey = await window.unisat.getPublicKey()

  if (!accounts[0]) {
    return []
  }

  const formatObj = getAddressFormat(accounts[0], network)

  return [
    {
      pub: publicKey,
      address: formatObj.address,
      format: formatObj.format
    }
  ]
}

export async function signMessageUnisat(options: UnisatMessageOptions) {
  if (!isUnisatInstalled()) {
    throw new Error("Unisat not installed.")
  }

  const message = options.message
  const type = options.type ?? 'ecdsa'

  const signature = await window.unisat.signMessage(message, type)
  if (!signature) {
    throw new Error(`Failed to sign message`)
  }

  return signature
}

