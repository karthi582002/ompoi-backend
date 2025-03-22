import {
    agent_orders_task,
    agent_tasks,
    master_admin,
    merchant_registration, orders
} from "../../db/schema.js";
import {db} from "../../config/db.js";
import {eq} from "drizzle-orm";

export const addAdmin = async (adminEmail,adminPassword) => {
    return db.insert(master_admin).values({
        adminEmail:adminEmail,
        adminPassword:adminPassword
    });
}

export const getAdminByEmail = async (email) => {
    return db.select()
        .from(master_admin)
        .where(eq(master_admin.adminEmail,email))
}

export const assignTaskToAgent = async (data) => {
    return db.insert(agent_tasks).values([data])
}

export const checkMerchantInTaskTable = async (email) => {
    return db.select()
        .from(agent_tasks)
        .where(eq(agent_tasks.merchantEmail, email))
}

export const assignTaskToAgentOrders = async (data) => {
    return db.insert(agent_orders_task).values([data])
}

export const checkOrderInTaskTable = async (orderId) => {
    return db.select()
        .from(agent_orders_task)
        .where(eq(agent_orders_task.orderId,orderId))
}

export const addAgentNameToOrderTable = async (agentEmail,orderId) => {
    return db.update(orders).set({
        verificationAgentId:agentEmail,
    })
        .where(
            eq(orderId,orders.orderId),
        )
}