import {
	mysqlTable,
	mysqlSchema,
	AnyMySqlColumn,
	foreignKey,
	primaryKey,
	unique,
	serial,
	varchar,
	timestamp,
	decimal,
	mysqlEnum,
	int,
	tinyint
} from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const agentNotifications = mysqlTable("agent_notifications", {
	id: serial().notNull(),
	agentId: varchar({ length: 255 }).references(() => agentRegistration.agentEmail, { onDelete: "cascade" } ),
	taskName: varchar({ length: 50 }).notNull(),
	message: varchar({ length: 255 }).notNull(),
	isRead: tinyint().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "agent_notifications_id"}),
	unique("id").on(table.id),
]);

export const agentOrdersTask = mysqlTable("agent_orders_task", {
	id: serial().notNull(),
	merchantEmail: varchar({ length: 255 }).notNull().references(() => approvedMerchant.merchantId, { onDelete: "cascade" } ),
	agentEmail: varchar({ length: 255 }).notNull().references(() => agentRegistration.agentEmail, { onDelete: "cascade" } ),
	orderId: varchar({ length: 50 }).notNull().references(() => orders.orderId, { onDelete: "cascade" } ),
	createdAt: timestamp({ mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "agent_orders_task_id"}),
	unique("id").on(table.id),
]);

export const agentRegistration = mysqlTable("agent_registration", {
	id: serial().notNull(),
	agentName: varchar("agent_name", { length: 50 }).notNull(),
	agentNumber: varchar("agent_number", { length: 12 }).notNull(),
	agentEmail: varchar("agent_email", { length: 255 }).notNull(),
	agentPassword: varchar("agent_password", { length: 255 }).notNull(),
	agentStatus: tinyint("agent_status").default(1),
},
(table) => [
	primaryKey({ columns: [table.agentEmail], name: "agent_registration_agent_email"}),
	unique("id").on(table.id),
	unique("agent_registration_agent_number_unique").on(table.agentNumber),
]);

export const agentTasks = mysqlTable("agent_tasks", {
	id: serial().notNull(),
	merchantName: varchar({ length: 255 }).notNull(),
	merchantEmail: varchar({ length: 255 }).notNull().references(() => merchantRegistration.email, { onDelete: "cascade" } ),
	agentName: varchar({ length: 255 }).notNull(),
	agentEmail: varchar({ length: 255 }).notNull().references(() => agentRegistration.agentEmail, { onDelete: "cascade" } ),
	status: tinyint().default(0),
	createdAt: timestamp({ mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "agent_tasks_id"}),
	unique("id").on(table.id),
]);

export const approvedMerchant = mysqlTable("approved_merchant", {
	merchantId: varchar({ length: 8 }).notNull(),
	merchantEmail: varchar({ length: 255 }).notNull().references(() => merchantRegistration.email, { onDelete: "cascade" } ),
	password: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.merchantId], name: "approved_merchant_merchantId"}),
]);

export const buyerRegistration = mysqlTable("buyer_registration", {
	id: serial().notNull(),
	companyName: varchar({ length: 255 }).notNull(),
	contactName: varchar({ length: 255 }).notNull(),
	contactEmail: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	contactPhone: varchar({ length: 13 }).notNull(),
	billingAddress: varchar({ length: 255 }).notNull(),
	shippingAddress: varchar({ length: 255 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.contactEmail], name: "buyer_registration_contactEmail"}),
	unique("id").on(table.id),
	unique("buyer_registration_contactPhone_unique").on(table.contactPhone),
]);

export const masterAdmin = mysqlTable("master_admin", {
	id: serial().notNull(),
	adminEmail: varchar({ length: 255 }).notNull(),
	adminPassword: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.adminEmail], name: "master_admin_adminEmail"}),
	unique("id").on(table.id),
]);

export const merchantRegistration = mysqlTable("merchant_registration", {
	companyName: varchar({ length: 50 }).notNull(),
	contactName: varchar({ length: 50 }).notNull(),
	sellerCategory: varchar({ length: 30 }).notNull(),
	contactPhone: varchar({ length: 13 }).notNull(),
	contactAltPhone: varchar({ length: 10 }),
	gstNumber: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	location: varchar({ length: 50 }).default('TamilNadu').notNull(),
	address: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	sellerDocuments: varchar({ length: 255 }).notNull(),
	isVerified: tinyint().default(0),
	isPaid: tinyint().default(0),
},
(table) => [
	primaryKey({ columns: [table.email], name: "merchant_registration_email"}),
	unique("merchant_registration_contactPhone_unique").on(table.contactPhone),
	unique("merchant_registration_gstNumber_unique").on(table.gstNumber),
]);

export const notifications = mysqlTable("notifications", {
	id: serial().notNull(),
	merchantId: varchar({ length: 255 }).notNull().references(() => approvedMerchant.merchantId, { onDelete: "cascade" } ),
	agentId: varchar({ length: 255 }).notNull().references(() => agentRegistration.agentEmail, { onDelete: "cascade" } ),
	messageFrom: varchar({ length: 255 }).notNull(),
	message: varchar({ length: 255 }).notNull(),
	isRead: tinyint().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "notifications_id"}),
	unique("id").on(table.id),
]);

export const orderPayments = mysqlTable("order_payments", {
	id: serial().notNull(),
	orderId: varchar("order_id", { length: 255 }).notNull(),
	paymentId: varchar("payment_id", { length: 255 }).notNull(),
	buyerEmail: varchar("buyer_email", { length: 255 }).notNull().references(() => buyerRegistration.contactEmail, { onDelete: "cascade" } ),
	amount: decimal({ precision: 10, scale: 2 }).notNull(),
	status: varchar({ length: 255 }).default('PENDING'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.orderId], name: "order_payments_order_id"}),
	unique("id").on(table.id),
]);

export const orders = mysqlTable("orders", {
	orderId: varchar({ length: 50 }).notNull(),
	merchantId: varchar({ length: 8 }).references(() => approvedMerchant.merchantId, { onDelete: "cascade" } ),
	buyerEmail: varchar({ length: 255 }).references(() => buyerRegistration.contactEmail, { onDelete: "cascade" } ),
	productId: varchar({ length: 50 }).references(() => productSkus.productId, { onDelete: "cascade" } ),
	quantity: varchar({ length: 8 }).notNull(),
	totalAmount: decimal({ precision: 10, scale: 2 }).notNull(),
	status: mysqlEnum(['pending','verified','processing','shipped','delivered']).default('pending').notNull(),
	verificationAgentId: varchar({ length: 255 }).references(() => agentRegistration.agentEmail, { onDelete: "cascade" } ),
	isPaid: tinyint().default(0),
	isVerified: tinyint().default(0),
	remarks: varchar({ length: 225 }),
	orderTime: timestamp("order-time", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.orderId], name: "orders_orderID"}),
]);

export const productSkus = mysqlTable("product_skus", {
	id: serial().notNull(),
	merchantId: varchar("merchant_id", { length: 8 }).notNull().references(() => approvedMerchant.merchantId, { onDelete: "cascade" } ),
	productId: varchar({ length: 50 }).notNull(),
	grade: varchar({ length: 50 }).notNull(),
	subGrade: varchar("sub_grade", { length: 50 }).notNull(),
	origin: varchar({ length: 50 }).notNull(),
	quality: varchar({ length: 20 }).notNull(),
	color: varchar({ length: 50 }),
	packing: varchar({ length: 100 }).notNull(),
	quantity: int().notNull(),
	unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
	moisture: varchar({ length: 3 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.productId], name: "product_skus_productId"}),
	unique("id").on(table.id),
]);

export const registrationPayment = mysqlTable("registration_payment", {
	id: serial().notNull(),
	orderId: varchar("order_id", { length: 255 }).notNull(),
	paymentId: varchar("payment_id", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull().references(() => merchantRegistration.email, { onDelete: "cascade" } ),
	amount: decimal({ precision: 10, scale: 2 }).notNull(),
	status: varchar({ length: 255 }).default('PENDING'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "registration_payment_id"}),
	unique("id").on(table.id),
]);

export const skuResources = mysqlTable("sku_resources", {
	id: serial().notNull(),
	merchantId: varchar("merchant_id", { length: 8 }).notNull().references(() => approvedMerchant.merchantId, { onDelete: "cascade" } ),
	productId: varchar({ length: 50 }).notNull().references(() => productSkus.productId, { onDelete: "cascade" } ),
	photoUrl: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "sku_resources_id"}),
	unique("id").on(table.id),
]);

export const verifiedMerchant = mysqlTable("verified_merchant", {
	id: serial().notNull(),
	agentEmail: varchar("agent_email", { length: 255 }).notNull().references(() => agentRegistration.agentEmail, { onDelete: "cascade" } ),
	merchantEmail: varchar("merchant_email", { length: 255 }).notNull().references(() => merchantRegistration.email, { onDelete: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "verified_merchant_id"}),
	unique("id").on(table.id),
]);
