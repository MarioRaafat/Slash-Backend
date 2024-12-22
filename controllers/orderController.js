import prisma from "../utils/prismaClient.js";
import {
    GET_ORDER_BY_ID_WITH_ITEMS,
    CREATE_ORDER,
    ADD_PRODUCT_TO_ORDER,
    GET_ALL_USER_ORDERS_WITH_ITEMS,
    GET_ORDER_BY_ID,
    FIND_PRODUCT_VARIANT_BY_ID_WITH_PRODUCT,
    UPDATE_ORDER_STATUS,
    UPDATE_ORDER_TOTAL_COST
} from "../queries/orderQueries.js";

export const getAllOrders = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if(role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }


        const orders = await prisma.order.findMany({where: { user_id: userId, order_status:{not: "CANCELLED"} }, include: {items: true}});
        //const orders = await prisma.$queryRawUnsafe(GET_ALL_USER_ORDERS_WITH_ITEMS, userId);
        if(!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        return res.status(200).json({ orders: orders });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await prisma.order.findUnique({where: {id: orderId}, include: {items: true}});
        //const order = await prisma.$queryRawUnsafe(GET_ORDER_BY_ID_WITH_ITEMS, orderId);
        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }
      
        return res.status(200).json({ order: order });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const createOrder = async (req, res) => {
    const userId = req.userId;
    const { longitude, latitude } = req.body;
    try {
        if(!latitude||!longitude)
        {
            return res.status(400).json({ message: "Missing longitude or latitude" });
        }
        const order = await prisma.order.create({
            data: {
                order_status: "PENDING",
                longitude,
                latitude,
                user_id: userId
            },
        });
        //const order = await prisma.$queryRawUnsafe(CREATE_ORDER, longitude, latitude, userId);

        return res.status(201).json({ order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error});
    }
}

export const addProductToOrder = async (req, res) => {
    const { orderId, ProductVariantId, quantity } = req.body;
    try {
        if(!orderId || !ProductVariantId || !quantity) {
            return res.status(400).json({ message: "Missing order id, product id, or quantity" });
        }

        const productVariant = await prisma.productVariant.findFirst({ where: { id: ProductVariantId }, include: {product: true} });
        if(!productVariant){
            return res.status(404).json({ message: "Product not found" });
        }
        const item = await prisma.orderItem.create({
            data: {
                order_id: orderId,
                product_id: ProductVariantId,
                quantity,
            }
        });
        const product = await prisma.product.findFirst({where: {id: productVariant.product_id}});
        const price = product.price;
        
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                total_cost: {increment: price * quantity * (1 - parseFloat(product.discount / 100))},
            },
            include: { items: true }
        });
        return res.status(200).json({ order: order });
    } catch (error) {
         return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try {
        if (!orderId ||!status) {
                return res.status(400).json({ message: "Missing order id or status" });
        }
            
        const validStatuses = ["PENDING", "CONFIRMED", "DELIVERING", "CANCELLED", "COMPLETED"];
        if(!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        let order = await prisma.order.findFirst({where: {id: orderId}});
        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order = await prisma.order.update({
            where: { id: orderId },
            data: {
                order_status: status
            }
        });
        return res.status(200).json({ order });
    } catch(error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}