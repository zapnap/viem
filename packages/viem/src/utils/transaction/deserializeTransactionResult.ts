import {
  TransactionResult as ProviderTransactionResult,
  TransactionResultBase,
  TransactionResultEIP1559,
  TransactionResultEIP2930,
  TransactionResultLegacy,
} from '../../types/ethereum-provider'

export const transactionType = {
  legacy: '0x0',
  eip2930: '0x1',
  eip1559: '0x2',
} as const

export type TransactionResult =
  | (Omit<TransactionResultLegacy<bigint>, 'type'> & {
      type: 'legacy'
    })
  | (Omit<TransactionResultEIP2930<bigint>, 'type'> & {
      type: 'eip2930'
    })
  | (Omit<TransactionResultEIP1559<bigint>, 'type'> & {
      type: 'eip1559'
    })

export function deserializeTransactionResult({
  accessList,
  blockHash,
  blockNumber,
  from,
  gas,
  gasPrice,
  hash,
  input,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  r,
  s,
  to,
  transactionIndex,
  type,
  v,
  value,
}: ProviderTransactionResult): TransactionResult {
  const result: TransactionResultBase<bigint> = {
    blockHash,
    blockNumber: BigInt(blockNumber),
    from,
    gas: BigInt(gas),
    hash,
    input,
    nonce: BigInt(nonce),
    r,
    s,
    to,
    transactionIndex: BigInt(transactionIndex),
    v: BigInt(v),
    value: BigInt(value),
  }
  if (type === transactionType.eip2930) {
    return {
      ...result,
      accessList,
      gasPrice: BigInt(gasPrice),
      type: 'eip2930',
    }
  }
  if (type === transactionType.eip1559) {
    return {
      ...result,
      accessList,
      maxFeePerGas: BigInt(maxFeePerGas),
      maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
      type: 'eip1559',
    }
  }
  return {
    ...result,
    accessList: undefined,
    gasPrice: BigInt(gasPrice),
    type: 'legacy',
  }
}