import prisma from "../utils/prismaClient.js";

export const getCart = async (req, res)=>{
    const userId = req.userId;
    const role = req.role;
    try {
        if(role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        let cart = await prisma.cart.findUnique({
            where: {
                user_id: userId
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json({cart});
    } catch(error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addProductToCart = async (req, res)=>{
    const userId = req.userId;
    const role = req.role;
    const {productId, quantity} = req.body;
    try{
        if(role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        let cart = await prisma.cart.findUnique({ where: { user_id: userId }, include: {items: true}});

        const productVariant = await prisma.productVariant.findFirst({ where: { id: productId }, include: {product: true}});
        if(!productVariant) {
            return res.status(404).json({ message: "Product variant not found" });
        }

        const price = productVariant.product.price;
        await prisma.cartItem.create({
            data: {
                product: { connect: { id: productId } },
                cart: { connect: { id: cart.id } },
                quantity,
            },
        });

        cart = await prisma.cart.update({
            where: {
                user_id: userId
            },
            data: {
                total_cost: {increment: price * quantity}
            },
            include: {items: true}
        });

        return res.status(201).json({cart});
        
    } catch(error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProductInCart = async (req, res)=> {
    const userId = req.userId;
    const role = req.role;
    const {quantity, cartItemId} = req.body;
    try {
        if (role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: cartItemId
            },
            include: {
                product: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const price = cartItem.product.product.price;
        const oldQuantity = cartItem.quantity;

        const cart = await prisma.cart.update({
            where:{
                user_id: userId
            },
            data:{
                total_cost: {increment: price * (quantity - oldQuantity)}
            },
        });

        await prisma.cartItem.update({
            where: {
                id: cartItemId
            },
            data: {
                quantity
            }
        });

        return res.status(204).json({ message: "the product is updated successfully", cartItem: cartItem });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const removeProductFromCart = async (req, res)=> {
    const userId = req.userId;
    const role = req.role;
    const cartItemId = req.params.cartItemId;
    try {
        if (role !== "USER" && role !== "ADMIN") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const cartItem = await prisma.cartItem.findFirst({where: { id: cartItemId }, include: {cart: true}});
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        if (cartItem.cart.user_id !== userId && role === "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        const productVariant = await prisma.productVariant.findFirst({where: {id: cartItem.product_id}, include: {product: true}});
        const price = productVariant.product.price;
        const quantity = cartItem.quantity;

        const cart = await prisma.cart.update({
            where:{
                user_id: cartItem.cart.user_id
            },
            data:{
                total_cost: {decrement: price * quantity}
            },
        });

        await prisma.cartItem.deleteMany({
            where: {
                id: cartItemId
            },
        });

        return res.status(204).json({ message: "the product is removed successfully" });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const clearCart = async (req, res)=>{
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const cart = await prisma.cart.findUnique({where: {user_id: userId}, include: {items: true}});
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        } else if (cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is already empty" });
        }

        await prisma.cartItem.deleteMany({
            where: {
                cart_id: cart.id
            },
        });

        await prisma.cart.update({
            where: {
                user_id: userId
            },
            data: {
                total_cost: 0
            }
        });

        return res.status(204).json({ message: "Cart cleared successfully" });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkoutCart = async (req, res)=> {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const cart = await prisma.cart.findUnique({
            where: {
                user_id: userId
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if (cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const order = await prisma.order.create({
            data: {
                order_status: "PENDING",
                user_id: userId,
                total_cost: cart.items.reduce((total, item) => {
                    return total + item.product.product.price * item.quantity * parseFloat(1 - item.product.product.discount / 100);
                }, 0),
                items: {
                    create: cart.items.map((item) => {
                        return {
                            product: {
                                connect: { id: item.product_id }
                            },
                            quantity: item.quantity
                        };
                    })
                }
            }
        });

        await prisma.cartItem.deleteMany({
            where: {
                cart_id: cart.id
            },
        });

        await prisma.cart.update({
            where: {
                user_id: userId
            },
            data: {
                total_cost: 0
            }
        });

        return res.status(201).json({ order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkoutCartItem = async (req, res)=> {
    const userId = req.userId;
    const role = req.role;
    const {cartItemId} = req.body;
    try {
        if (role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const cart = await prisma.cart.findUnique({where: {user_id: userId}});
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: cartItemId
            },
            include: {
                product: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        } else if (cartItem.cart_id !== cart.id) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const order = await prisma.order.create({
            data: {
                order_status: "PENDING",
                user_id: userId,
                total_cost: cartItem.product.product.price * cartItem.quantity * (1 - parseFloat(cartItem.product.product.discount / 100)),
                items: {
                    create: [
                        {
                            product: {
                                connect: { id: cartItem.product_id }
                            },
                            quantity: cartItem.quantity
                        }
                    ]
                }
            }
        });

        await prisma.cartItem.delete({
            where: {
                id: cartItemId
            }
        });

        await prisma.cart.update({
            where: {
                user_id: userId
            },
            data: {
                total_cost: { decrement: cartItem.product.product.price * cartItem.quantity }
            }
        });

        return res.status(201).json({ order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
