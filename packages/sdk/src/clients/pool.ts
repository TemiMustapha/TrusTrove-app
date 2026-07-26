import { Address, nativeToScVal } from "@stellar/stellar-sdk";
import { BaseClient } from "../base";

export type PoolAsset = string;

export interface PoolStats {
  totalDeposits: bigint;
  totalFunded: bigint;
  availableLiquidity: bigint;
  utilizationRateBps: number;
  totalYieldDistributed: bigint;
  activeInvoiceCount: number;
  totalShares: bigint;
}

export interface LPPosition {
  shares: bigint;
  usdcValue: bigint;
  yieldEarned: bigint;
  depositCount: number;
}

export class PoolClient extends BaseClient {
  async deposit(
    lp: string,
    asset: PoolAsset,
    amount: bigint,
    source?: string,
  ): Promise<string> {
    return this.invoke(
      "deposit",
      [
        new Address(lp).toScVal(),
        nativeToScVal(asset, { type: "symbol" }),
        nativeToScVal(amount, { type: "u128" }),
      ],
      source ?? lp,
    );
  }

  async withdraw(
    lp: string,
    shares: bigint,
    source?: string,
  ): Promise<string> {
    return this.invoke(
      "withdraw",
      [
        new Address(lp).toScVal(),
        nativeToScVal(shares, { type: "u128" }),
      ],
      source ?? lp,
    );
  }

  async getStats(): Promise<PoolStats> {
    return this.read("get_stats", []);
  }

  async getLPPosition(lp: string): Promise<LPPosition> {
    return this.read("get_lp_position", [new Address(lp).toScVal()]);
  }
}
