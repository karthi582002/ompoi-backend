import {
    agent_notifications,
    agent_orders_task, agent_registration,
    agent_tasks,
    master_admin,
    merchant_registration, order_payments, orders, verified_merchant
} from "../../db/schema.js";
import {db} from "../../config/db.js";
import {eq, ne, sql} from "drizzle-orm";
import {and, or} from "drizzle-orm/sql/expressions/conditions";

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

export const addAgentNotification = async (agentEmail,taskName,message) => {
    return db.insert(agent_notifications).values({
        agentId:agentEmail,
        taskName:taskName,
        message:message,
    })
}

export const getAllUnverifiedMerchantsFromDatabase = async () => {
    return db.select({
        companyName: merchant_registration.companyName,
        email: merchant_registration.email,
    }).from(merchant_registration).where(
        ne(merchant_registration.isVerified, false)
    );
};


export const getAllUnverifiedOrdersFromDataBase = async() => {
    return db.select().from(orders).where(eq(
        orders.isVerified,false
    ))
}

export const getMerchantVerifyTableDataFromDatabase = async () =>{
    return db.select({
        id:agent_tasks.id,
        agent_name: agent_tasks.agentName,
        seller_name:agent_tasks.merchantName,
        seller_contact:agent_tasks.merchantEmail,
        status: agent_tasks.status,
    }).from(agent_tasks)
}


export const getOrdersVerifyTableDataFromDatabase = async () => {
    return db.select().from(agent_orders_task)
}


// analytics part

export const getTotalAgents = async() => {
    return db.$count(agent_registration)
}

export const getTotalOrders = async() => {
    return db.$count(orders)
}

export const getTotalSellers = async() => {
    return db.$count(verified_merchant)
}

export const getTotalRevenue = async () => {
    const result = await db.select({
        totalRevenue: sql`SUM(${order_payments.amount})`
    }).from(order_payments);
    return result[0].totalRevenue || 0; // fallback if no orders
};

export const getTotalRegistration = async () => {
    return db.$count(merchant_registration)
}

export const getOrdersSummary = async () => {
    const totalOrders = await db.select().from(orders);
    const totalVerifiedOrders = await db.select().from(orders).where(
        eq(orders.isVerified, true) // assuming isVerified is a string "True" / "False"
    );

    return {
        totalOrders: totalOrders.length,
        totalVerifiedOrders: totalVerifiedOrders.length,
    };
};