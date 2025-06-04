import { pgTable, text, serial, decimal, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull().unique(), // Base64 encoded device ID
  isActivated: boolean("is_activated").notNull().default(false),
  activationCode: text("activation_code"), // Decoded device ID (password)
  activatedAt: timestamp("activated_at"),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id),
  address: text("address").notNull().unique(),
  balance: decimal("balance", { precision: 18, scale: 8 }).notNull().default("0"),
  balanceUSD: decimal("balance_usd", { precision: 10, scale: 2 }).notNull().default("0"),
  isEligible: boolean("is_eligible").notNull().default(false),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const giveaways = pgTable("giveaways", {
  id: serial("id").primaryKey(),
  walletId: serial("wallet_id").references(() => wallets.id),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  amountUSD: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: serial("wallet_id").references(() => wallets.id),
  type: text("type").notNull(), // receive, send, giveaway
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  amountUSD: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeviceSchema = createInsertSchema(devices).pick({
  deviceId: true,
  isActivated: true,
  activationCode: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  deviceId: true,
  address: true,
  balance: true,
  balanceUSD: true,
  isEligible: true,
});

export const insertGiveawaySchema = createInsertSchema(giveaways).pick({
  walletId: true,
  amount: true,
  amountUSD: true,
  status: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  walletId: true,
  type: true,
  amount: true,
  amountUSD: true,
  txHash: true,
  status: true,
});

export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Giveaway = typeof giveaways.$inferSelect;
export type InsertGiveaway = z.infer<typeof insertGiveawaySchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
