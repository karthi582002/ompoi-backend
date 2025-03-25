import { mysqlTable, serial, varchar,boolean,decimal,int,timestamp } from "drizzle-orm/mysql-core";
import {mysqlEnum} from "drizzle-orm/mysql-core/columns/enum";


export const merchant_registration = mysqlTable("merchant_registration", {
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
    sellerDocuments: varchar("sellerDocuments",{length : 255}).notNull(),
    isVerified: boolean("isVerified").default(false),
    isPaid: boolean("isPaid").default(false),
});

export const agent_registration = mysqlTable("agent_registration", {
    id: serial("id"),
    agent_name : varchar("agent_name",{length : 50}).notNull(),
    agent_number : varchar("agent_number",{length : 12}).notNull().unique(),
    agent_email : varchar("agent_email",{length : 255}).notNull().primaryKey().notNull(),
    agent_password: varchar("agent_password",{length : 255}).notNull(),
    agent_status : boolean("agent_status").default(true),
})

export const verified_merchant = mysqlTable("verified_merchant", {
    id: serial("id"),
    agent_email : varchar("agent_email",{length : 255}).notNull().references(()=> agent_registration.agent_email,{onDelete : "cascade"}),
    merchant_email : varchar("merchant_email",{length : 255}).notNull().references(()=> merchant_registration.email,{onDelete : "cascade"}),
})

export const registration_payment = mysqlTable("registration_payment",{
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", {length: 255}).notNull(),
    paymentId: varchar("payment_id",{length: 255}).notNull(),
    email: varchar("email",{length: 255}).notNull().references(()=> merchant_registration.email,{onDelete : "cascade"}),
    amount: decimal("amount",{precision:10,scale:2}).notNull(),
    status: varchar("status",{length: 255}).default("PENDING"),
    createdAt: timestamp("created_at").defaultNow(),
})

export const approved_merchant = mysqlTable("approved_merchant", {
    merchantId: varchar("merchantId", {length: 8}).primaryKey(),
    merchantEmail : varchar("merchantEmail",{length : 255}).notNull().references(()=> merchant_registration.email,{onDelete : "cascade"}),
    password: varchar("password",{length : 255}).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})

export const product_skus = mysqlTable("product_skus", {
    id: serial("id"),
    merchantId: varchar("merchant_id", {length:8}).notNull().references(()=>approved_merchant.merchantId,{onDelete:"cascade"}),
    productId: varchar("productId", { length: 50 }).primaryKey(),
    grade: varchar("grade", {length:50}).notNull(),
    subGrade: varchar("sub_grade",{length:50}).notNull(),
    origin: varchar("origin",{length:50}).notNull(),
    quality: varchar("quality",{length:20}).notNull(),
    color: varchar("color",{length:50}),
    packing: varchar("packing",{length:100}).notNull(),
    quantity: int("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    moisture: varchar("moisture",{length:3}).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const sku_resources = mysqlTable("sku_resources", {
    id: serial("id").primaryKey().autoincrement(),
    merchantId: varchar("merchant_id", { length: 8 }).notNull().references(() => approved_merchant.merchantId, { onDelete: "cascade" }),
    productId: varchar("productId", { length: 50 }).notNull().references(() => product_skus.productId, { onDelete: "cascade" }),
    photoUrl: varchar("photoUrl",{length: 255}).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const master_admin = mysqlTable("master_admin", {
    id: serial("id"),
    adminEmail : varchar("adminEmail",{length : 255}).notNull().primaryKey(),
    adminPassword : varchar("adminPassword",{length : 255}).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const agent_tasks = mysqlTable("agent_tasks", {
    id: serial("id").primaryKey(),
    merchantName: varchar("merchantName",{length : 255}).notNull(),
    merchantEmail : varchar("merchantEmail",{length : 255}).notNull().references(()=> merchant_registration.email,{onDelete: "cascade"}),
    agentName: varchar("agentName",{length : 255}).notNull(),
    agentEmail : varchar("agentEmail",{length : 255}).notNull().references(()=> agent_registration.agent_email,{onDelete: "cascade"}),
    status: boolean("status").default(false),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const buyer_registration = mysqlTable("buyer_registration", {
    id: serial("id"),
    companyName: varchar("companyName",{length : 255}).notNull(),
    contactName: varchar("contactName",{length : 255}).notNull(),
    contactEmail : varchar("contactEmail",{length : 255}).primaryKey(),
    password: varchar("password",{length : 255}).notNull(),
    contactPhone : varchar("contactPhone",{length : 13}).notNull().unique(),
    billingAddress: varchar("billingAddress",{length : 255}).notNull(),
    shippingAddress: varchar("shippingAddress",{length : 255}).notNull(),
})

export const notifications = mysqlTable("notifications", {
    id: serial("id").primaryKey(),
    merchantId : varchar("merchantId",{length : 255}).notNull().references(()=>approved_merchant.merchantId,{onDelete: "cascade"}),
    agentEmail : varchar("agentId",{length : 255}).notNull().references(()=> agent_registration.agent_email,{onDelete: "cascade"}),
    messageFrom : varchar("messageFrom",{length : 255}).notNull().notNull(),
    message : varchar("message",{length : 255}).notNull(),
    isRead : boolean("isRead").default(false).notNull(),
    createdAt : timestamp("created_at").defaultNow(),
})

export const orders = mysqlTable("orders", {
    orderId: varchar("orderID",{length:50}).primaryKey(),
    merchantId : varchar("merchantId",{length:8}).references(()=> approved_merchant.merchantId,{onDelete: "cascade"}),
    buyerEmail : varchar("buyerEmail",{length : 255}).references(()=> buyer_registration.contactEmail,{onDelete: "cascade"}),
    productId : varchar("productId",{length : 50}).references(()=> product_skus.productId,{onDelete: "cascade"}),
    quantity : varchar("quantity",{length : 8}).notNull(),
    totalAmount :decimal("totalAmount",{precision:10,scale:2}).notNull(),
    status : mysqlEnum("status",["pending","verified","processing","shipped","delivered"]).notNull().default("pending"),
    verificationAgentId : varchar("verificationAgentId",{length : 255}).references(()=>agent_registration.agent_email,{onDelete: "cascade"}),
    isPaid: boolean("isPaid").default(false),
    isVerified: boolean("isVerified").default(false),
    remarks: varchar("remarks",{length:225}),
    orderTimestamp : timestamp("order-time").defaultNow(),
})

export const agent_orders_task = mysqlTable("agent_orders_task", {
    id: serial("id").primaryKey(),
    merchantId : varchar("merchantEmail",{length : 255}).notNull().references(()=> approved_merchant.merchantId,{onDelete: "cascade"}),
    agentEmail : varchar("agentEmail",{length : 255}).notNull().references(()=> agent_registration.agent_email,{onDelete: "cascade"}),
    orderId :   varchar("orderId", {length:50}).notNull().references(()=> orders.orderId,{onDelete: "cascade"}),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const order_payments = mysqlTable("order_payments", {
    id: serial("id"),
    orderId: varchar("order_id", {length: 255}).notNull().primaryKey(),
    paymentId: varchar("payment_id",{length: 255}).notNull(),
    buyerEmail: varchar("buyer_email",{length: 255}).notNull().references(()=> buyer_registration.contactEmail,{onDelete : "cascade"}),
    amount: decimal("amount",{precision:10,scale:2}).notNull(),
    status: varchar("status",{length: 255}).default("PENDING"),
    createdAt: timestamp("created_at").defaultNow(),
})