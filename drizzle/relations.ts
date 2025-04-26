import { relations } from "drizzle-orm/relations";
import { agentRegistration, agentNotifications, agentOrdersTask, approvedMerchant, orders, agentTasks, merchantRegistration, notifications, buyerRegistration, orderPayments, productSkus, registrationPayment, skuResources, verifiedMerchant } from "./schema";

export const agentNotificationsRelations = relations(agentNotifications, ({one}) => ({
	agentRegistration: one(agentRegistration, {
		fields: [agentNotifications.agentId],
		references: [agentRegistration.agentEmail]
	}),
}));

export const agentRegistrationRelations = relations(agentRegistration, ({many}) => ({
	agentNotifications: many(agentNotifications),
	agentOrdersTasks: many(agentOrdersTask),
	agentTasks: many(agentTasks),
	notifications: many(notifications),
	orders: many(orders),
	verifiedMerchants: many(verifiedMerchant),
}));

export const agentOrdersTaskRelations = relations(agentOrdersTask, ({one}) => ({
	agentRegistration: one(agentRegistration, {
		fields: [agentOrdersTask.agentEmail],
		references: [agentRegistration.agentEmail]
	}),
	approvedMerchant: one(approvedMerchant, {
		fields: [agentOrdersTask.merchantEmail],
		references: [approvedMerchant.merchantId]
	}),
	order: one(orders, {
		fields: [agentOrdersTask.orderId],
		references: [orders.orderId]
	}),
}));

export const approvedMerchantRelations = relations(approvedMerchant, ({one, many}) => ({
	agentOrdersTasks: many(agentOrdersTask),
	merchantRegistration: one(merchantRegistration, {
		fields: [approvedMerchant.merchantEmail],
		references: [merchantRegistration.email]
	}),
	notifications: many(notifications),
	orders: many(orders),
	productSkuses: many(productSkus),
	skuResources: many(skuResources),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	agentOrdersTasks: many(agentOrdersTask),
	buyerRegistration: one(buyerRegistration, {
		fields: [orders.buyerEmail],
		references: [buyerRegistration.contactEmail]
	}),
	approvedMerchant: one(approvedMerchant, {
		fields: [orders.merchantId],
		references: [approvedMerchant.merchantId]
	}),
	productSkus: one(productSkus, {
		fields: [orders.productId],
		references: [productSkus.productId]
	}),
	agentRegistration: one(agentRegistration, {
		fields: [orders.verificationAgentId],
		references: [agentRegistration.agentEmail]
	}),
}));

export const agentTasksRelations = relations(agentTasks, ({one}) => ({
	agentRegistration: one(agentRegistration, {
		fields: [agentTasks.agentEmail],
		references: [agentRegistration.agentEmail]
	}),
	merchantRegistration: one(merchantRegistration, {
		fields: [agentTasks.merchantEmail],
		references: [merchantRegistration.email]
	}),
}));

export const merchantRegistrationRelations = relations(merchantRegistration, ({many}) => ({
	agentTasks: many(agentTasks),
	approvedMerchants: many(approvedMerchant),
	registrationPayments: many(registrationPayment),
	verifiedMerchants: many(verifiedMerchant),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	agentRegistration: one(agentRegistration, {
		fields: [notifications.agentId],
		references: [agentRegistration.agentEmail]
	}),
	approvedMerchant: one(approvedMerchant, {
		fields: [notifications.merchantId],
		references: [approvedMerchant.merchantId]
	}),
}));

export const orderPaymentsRelations = relations(orderPayments, ({one}) => ({
	buyerRegistration: one(buyerRegistration, {
		fields: [orderPayments.buyerEmail],
		references: [buyerRegistration.contactEmail]
	}),
}));

export const buyerRegistrationRelations = relations(buyerRegistration, ({many}) => ({
	orderPayments: many(orderPayments),
	orders: many(orders),
}));

export const productSkusRelations = relations(productSkus, ({one, many}) => ({
	orders: many(orders),
	approvedMerchant: one(approvedMerchant, {
		fields: [productSkus.merchantId],
		references: [approvedMerchant.merchantId]
	}),
	skuResources: many(skuResources),
}));

export const registrationPaymentRelations = relations(registrationPayment, ({one}) => ({
	merchantRegistration: one(merchantRegistration, {
		fields: [registrationPayment.email],
		references: [merchantRegistration.email]
	}),
}));

export const skuResourcesRelations = relations(skuResources, ({one}) => ({
	approvedMerchant: one(approvedMerchant, {
		fields: [skuResources.merchantId],
		references: [approvedMerchant.merchantId]
	}),
	productSkus: one(productSkus, {
		fields: [skuResources.productId],
		references: [productSkus.productId]
	}),
}));

export const verifiedMerchantRelations = relations(verifiedMerchant, ({one}) => ({
	agentRegistration: one(agentRegistration, {
		fields: [verifiedMerchant.agentEmail],
		references: [agentRegistration.agentEmail]
	}),
	merchantRegistration: one(merchantRegistration, {
		fields: [verifiedMerchant.merchantEmail],
		references: [merchantRegistration.email]
	}),
}));