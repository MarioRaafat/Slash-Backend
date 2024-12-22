import { prisma } from "../seed.js";
import faker from "faker";

export const ItemsSeed = async () => {
    try {
        const users = await prisma.shopper.findMany({});
        const reviews = await prisma.review.findMany({});
        const brands = await prisma.brand.findMany({});
        const productsVar = await prisma.productVariant.findMany({});
        const products = await prisma.product.findMany({});

        for (const user of users) {
            const wishlist = await prisma.wishlist.create({
                data: {
                    user_id: user.id,
                }
            });

            console.log(`Added wishlist for user ${user.firstName} ${user.lastName}`);

            const wishlistItems = faker.helpers.shuffle(products).slice(0, faker.datatype.number({min: 4, max: 7}));
            for (const product of wishlistItems) {
                await prisma.wishlistItem.create({
                    data: {
                        wishlist_id: wishlist.id,
                        product_id: product.id,
                    }
                });

                console.log(`Added product ${product.id} to wishlist ${wishlist.id}`);
            }

            const ordersCount = faker.datatype.number({min: 2, max: 4});
            for (let i = 0; i < ordersCount; i++) {
                let totalCost = 0;
                const order = await prisma.order.create({
                    data: {
                        user_id: user.id,
                        order_status: "PENDING",
                    }
                });
                console.log(`Added order ${order.id} for user ${user.firstName} ${user.lastName}`);

                const orderItems = faker.helpers.shuffle(productsVar).slice(0, faker.datatype.number({min: 2, max: 6}));
                for (const product of orderItems) {
                    const quantity = faker.datatype.number({min: 1, max: 3});
                    let price = await prisma.product.findFirst({where: {id: product.product_id}});
                    price = price.price;
                    if (product.quantity >= quantity) {
                        await prisma.orderItem.create({
                            data: {
                                order_id: order.id,
                                product_id: product.id,
                                quantity: quantity,
                            }
                        });
                        totalCost += price * quantity;
                        console.log(`Added product ${product.id} to order ${order.id}`);
                    }
                }
                console.log(`Total cost for order ${order.id} is ${totalCost}`);
                await prisma.order.update({
                    where: { id: order.id },
                    data: { total_cost: totalCost }
                });
            }

            let cartTotalCost = 0;
            const cart = await prisma.cart.create({
                data: {
                    user_id: user.id,
                }
            });

            console.log(`Added cart for user ${user.firstName} ${user.lastName}`);

            const cartItems = faker.helpers.shuffle(productsVar).slice(0, faker.datatype.number({min: 3, max: 5}));
            for (const product of cartItems) {
                let price = await prisma.product.findFirst({where: {id: product.product_id}});
                price = price.price;
                const quantity = faker.datatype.number({min: 1, max: 3});
                if (product.quantity >= quantity) {
                    await prisma.cartItem.create({
                        data: {
                            cart_id: cart.id,
                            product_id: product.id,
                            quantity: quantity,
                        }
                    });
                    cartTotalCost += price * quantity;
                    console.log(`Added product ${product.id} to cart ${cart.id}`);
                }
            }
            console.log(`Total cost for cart ${cart.id} is ${cartTotalCost}`);
            await prisma.cart.update({
                where: { id: cart.id },
                data: { total_cost: cartTotalCost }
            });

            // Create Reviews
            const orders = await prisma.order.findMany({
                where: { user_id: user.id },
                include: { items: true }
            });
            const productIds = [];
            for (const order of orders) {
                const orderItems = order.items;
                for (const orderItem of orderItems) {
                    const product = await prisma.productVariant.findFirst({where: {id: orderItem.product_id}});
                    productIds.push(product.product_id);
                }
            }
            const reviewItems = faker.helpers.shuffle(productIds).slice(0, faker.datatype.number({min: 2, max: 5}));

            for (const productId of reviewItems) {
                    await prisma.review.create({
                        data: {
                            user_id: user.id,
                            product_id: productId,
                            rating: parseFloat(faker.datatype.number({ min: 1, max: 5, precision: 0.5 }).toFixed(1)),
                            valueForMoney_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                            quality_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                            shipping_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                            accuracy_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                            comment: faker.lorem.sentence(),
                        }
                    });

                    console.log(`Added review for product ${productId} by user ${user.firstName} ${user.lastName}`);
            }

            // Like Reviews and Follow Brands
            const randomReviews = faker.helpers.shuffle(reviews).slice(0, faker.datatype.number({min: 2, max: 5}));
            for (const review of randomReviews) {
                await prisma.review_Shopper.create({
                    data: {
                        user_id: user.id,
                        review_id: review.id,
                    }
                });
                console.log(`User ${user.id} liked review ${review.id}`);
            }

            const randomBrands = faker.helpers.shuffle(brands).slice(0, faker.datatype.number({min: 2, max: 5}));
            for (const brand of randomBrands) {
                await prisma.brand_Shopper.create({
                    data: {
                        user_id: user.id,
                        brand_id: brand.id,
                    }
                });
                console.log(`User ${user.id} followed brand ${brand.id}`);
            }
        }
    } catch (error) {
        console.error(error);
    }
}