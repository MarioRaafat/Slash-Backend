import { APIError, errorResponse } from '../middlewares/error.js';
import authRouter from "./authRouter.js";
import productRouter from "./productRouter.js";
import userRouter from "./userRouter.js";
import wishlistRouter from "./wishlistRouter.js";
import brandRouter from"./brandRouter.js"
import orderRouter from './orderRouter.js';
import cartRouter from './cartRouter.js'
import chatRouter from "./chatRouter.js";
import reviewRouter from "./reviewRouter.js";
import constantsRouter from "./constantsRouter.js";
import adminRouter from "./adminRouter.js";
import AIRouter from "./AIRouter.js";


const injectRoutes = (api) => {
    /**
     * @swagger
     * tags:
     *   - name: Auth
     *     description: Endpoints for authentication
     *   - name: Products
     *     description: Endpoints related to products
     *   - name: User
     *     description: Endpoints related to users
     *   - name: Brand
     *     description: Endpoints related to Brands
     *   - name: Admin
     *     description: Endpoints for admin users
     *   - name: Chat
     *     description: Endpoints related to chats
     *   - name: Message
     *     description: Endpoints related to messages
     *   - name: Wishlist
     *     description: Endpoints related to wishlists
     *   - name: Order
     *     description: Endpoints related to Orders
     *   - name: Cart
     *     description: Endpoints related to Cart
     *   - name: Reviews
     *     description: Endpoints related to Reviews
     *   - name: Constants
     *     description: Endpoints related to database constants (e.g. colours, categories)
     *   - name: Analyses
     *     description: Endpoints related to any analysis (e.g. image analysis, statistics)
     */

    api.use('/api/auth', authRouter);
    api.use('/api/product', productRouter);
    api.use('/api/user', userRouter);
    api.use('/api/wishlist', wishlistRouter);
    api.use('/api/brand', brandRouter);
    api.use('/api/order', orderRouter);
    api.use('/api/cart', cartRouter);
    api.use('/api/chat', chatRouter);
    api.use('/api/review', reviewRouter);
    api.use('/api/constants', constantsRouter);
    api.use('/api/admin', adminRouter);
    api.use('/api/analysis', AIRouter);

    api.all('*', (req, res, next) => {
        errorResponse(new APIError(404, `Cannot ${req.method} ${req.url}`), req, res, next);
    });
    api.use(errorResponse);
};

export default injectRoutes;