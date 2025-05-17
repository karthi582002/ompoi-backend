import {
    agent_notifications,
    agent_orders_task,
    agent_registration,
    agent_tasks,
    merchant_registration,
    orders,
    verified_merchant
} from "../../db/schema.js";
import {eq} from "drizzle-orm";
import {db} from "../../config/db.js";
import {and} from "drizzle-orm/sql/expressions/conditions";

export const getAgentByEmail = async (email) => {
    return db.select().from(agent_registration).where(eq(agent_registration.agent_email,email))
}

export const registerAgent = async (agent) => {
    return db.insert(agent_registration).values([agent]);
}

export const approveMerchant = async (agent_email,merchant_email) => {
    return db.update(merchant_registration).
        set({isVerified: true})
        .where(eq(merchant_registration.email,merchant_email));
}


export const checkVerifiedMerchant = async (merchant_email) => {
    return db.select().from(verified_merchant).where(eq(verified_merchant.merchant_email,merchant_email));
}

export const insertVerifiedMerchant = async (agent_email,merchant_email) => {
    return db.insert(verified_merchant).values({agent_email,merchant_email});
}

export const selectData = async () =>{
    return db.select({
        agent_name: agent_registration.agent_name,
        merchant_name: merchant_registration.contactName,
    })
        .from(verified_merchant)
        .innerJoin(agent_registration, eq(verified_merchant.agent_email, agent_registration.agent_email))
        .innerJoin(merchant_registration, eq(verified_merchant.merchant_email, merchant_registration.email));
}

export const getAgent = async (email) => {
    return db.select({
            agent_name: agent_registration.agent_name,
            agent_email: agent_registration.agent_email,
            agent_phone:agent_registration.agent_number
        }
    ).from(agent_registration)
        .where(eq(agent_registration.agent_email,email))
}

export const checkValidVerify = async (merchant_email,agent_email) => {
    return db.select()
        .from(agent_tasks)
        .where(
            and(
                eq(agent_tasks.agentEmail,agent_email),
                eq(agent_tasks.merchantEmail,merchant_email)
            )
        );
}

export const updateMerchantTaskCompletion = async(agent_email,merchant_email,status) => {
    return db.update(agent_tasks).
    set({
        status: status,
    }).where(
            and(
                eq(agent_tasks.agentEmail,agent_email),
                eq(agent_tasks.merchantEmail,merchant_email)
            ),
    )
}

export const checkValidOrderVerify = async (agent_email,order_id) => {
    return db.select()
    .from(orders)
        .where(
            and(
                eq(orders.verificationAgentId,agent_email),
                eq(orders.orderId,order_id),
                eq(orders.isVerified, false)
            )
        );
}

export const addVerifiedStatusInOrder = async (order_id,agent_email) => {
    return db.update(orders)
        .set({
            isVerified: true,
            status: "verified"
        })
        .where(
            and(
                eq(orders.verificationAgentId,agent_email),
                eq(orders.orderId,order_id)
            )
        );
}

export const getAgentNotificationsFromDB = async(agentEmail) =>{
    return db.select().from(agent_notifications).where(
        eq(agent_notifications.agentId,agentEmail)
    )
}

export const markAsReadAgentNotifications = async(agentEmail) =>{
    return db.update(agent_notifications)
        .set({
            isRead:true,
        })
        .where(
        eq(agent_notifications.agentId,agentEmail)
    )
}

export const pendingTasks = async (agent_email) => {
    return db.select({
        agentEmail: agent_tasks.agentEmail,
        agentName: agent_tasks.agentName,
        createdAt: agent_tasks.createdAt,
        id: agent_tasks.id,
        merchantEmail: agent_tasks.merchantEmail,
        merchantName: agent_tasks.merchantName,
        status: agent_tasks.status,
        contactPerson: merchant_registration.contactName,
        location: merchant_registration.location, // optional, if you want more info
        sellerCategory: merchant_registration.sellerCategory,
    })
        .from(agent_tasks)
        .innerJoin(
            merchant_registration,
            eq(agent_tasks.merchantEmail, merchant_registration.email)
        )
        .where(
            and(
                eq(agent_tasks.agentEmail, agent_email),
                eq(agent_tasks.status, false)
            )
        );
};

export const completedMerchantVerification = async (agent_email) =>{
    return db.select().from(agent_tasks).where(
        and(
            eq(agent_tasks.agentEmail,agent_email),
            eq(agent_tasks.status,true)
        ))
}


export const pendingOrderTasks = async (agent_email) =>{
    return db.select().from(agent_orders_task).where(
        and(
            eq(agent_orders_task.agentEmail,agent_email),
            eq(agent_orders_task.status,"false")
        ))
}

export const completedOrderVerification = async (agent_email) =>{
    return db.select().from(agent_orders_task).where(
        and(
            eq(agent_orders_task.agentEmail,agent_email),
            eq(agent_orders_task.status,"true")
        ))
}

export const getTotalMergeTasks = async(agent_email) =>{
    const merchantTasks = await db.select().from(agent_tasks).where(
        eq(agent_tasks.agentEmail,agent_email),
    )
    const orderTask = await db.select().from(agent_orders_task).where(
        eq(agent_orders_task.agentEmail,agent_email),
    )
    return merchantTasks.length + orderTask.length;
}

export const getAllAgentsFromDatabase = async () => {
    return db.select({
        agent_name:agent_registration.agent_name,
        agent_email : agent_registration.agent_email
    }).from(agent_registration);
}
