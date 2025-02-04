import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import {boolean, decimal, integer, timestamp} from "drizzle-orm/pg-core";

export const users = mysqlTable("data", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).unique(),
});

export const merchant_registration = mysqlTable("merchant_registration", {
    id: serial("id").autoincrement(),
    companyName: varchar("companyName",{length : 50}).notNull(),
    contactName: varchar("contactName",{length : 50}).notNull(),
    sellerCategory: varchar("sellerCategory",{length : 30}).notNull(),
    contactPhone: varchar("contactPhone",{length : 13}).unique().notNull(),
    contactAltPhone: varchar("contactAltPhone",{length : 10}),
    gstNumber: varchar("gstNumber",{length : 255}).unique().notNull(),
    email: varchar("email",{length : 100}).primaryKey().notNull(),
    location:varchar("location",{length : 50}).notNull().default("TamilNadu"),
    address: varchar("address",{length : 255}).notNull(),
    password: varchar("password",{length : 255}).notNull(),
    sellerDocuments: varchar("sellerDocument",{length : 255}).notNull(),
    isVerified: boolean("isVerified").default(false),
    isPaid: boolean("isPaid").default(false),
});

export const agent_registration = mysqlTable("agent_registration", {
    id: serial("id").autoincrement(),
    agent_name : varchar("agent_name",{length : 50}).notNull(),
    agent_number : varchar("agent_number",{length : 12}).notNull().unique(),
    agent_email : varchar("agent_email",{length : 255}).notNull().primaryKey().notNull(),
    agent_password: varchar("agent_password",{length : 255}).notNull(),
    agent_status : boolean("agent_status").default(true),
})

export const verified_merchant = mysqlTable("verified_merchant", {
    id: serial("id").autoincrement(),
    agent_email : varchar("agent_email",{length : 255}).notNull().references(()=> agent_registration.agent_email,{onDelete : "cascade"}),
    merchant_email : varchar("merchant_email",{length : 255}).notNull().references(()=> merchant_registration.email,{onDelete : "cascade"}),
})

export const registration_payment = mysqlTable("registration_payment",{
    id: serial("id").primaryKey().autoincrement(),
    orderId: varchar("order_id", {length: 255}).notNull(),
    paymentId: varchar("payment_id",{length: 255}).notNull(),
    email: varchar("email",{length: 255}).notNull().references(()=> merchant_registration.email,{onDelete : "cascade"}),
    amount: decimal("amount").notNull(),
    status: varchar("status",{length: 255}).default("PENDING"),
    createdAt: timestamp("created_at").defaultNow(),
})

export const approved_merchant = mysqlTable("approved_merchant", {
    merchantId: varchar("merchantId", {length: 8}).primaryKey(),
    merchantEmail : varchar("merchantEmail",{length : 255}).notNull().references(()=> merchant_registration.email,{onDelete : "cascade"}),
    password: varchar("password",{length : 255}).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})

