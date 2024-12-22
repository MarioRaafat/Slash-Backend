import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import injectRoutes from './routes/index.js';
import cookieParser from "cookie-parser";
import {swaggerUiServe, swaggerUiSetup} from './utils/swagger.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT;
const origin = process.env.ORIGIN;
const corsOptions = {
    //origin: origin,
    credentials: true,
    methods: ['GET, POST, PUT, DELETE'],
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);
injectRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

