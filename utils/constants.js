import dotenv from "dotenv";
import axios from "axios";
import {BlobServiceClient} from "@azure/storage-blob";

dotenv.config();
export const AI_HOST = process.env.AI_SERVER_URL;

// Initialize API Client for AI Server to send requests
export const apiClient = axios.create({
    baseURL: AI_HOST,
});

// Azure Blob Storage credentials
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
// Initialize Blob Service Client
export const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);


// Container names
export const Profile_Picture_Container_Name = process.env.AZURE_STORAGE_PROFILE_PICTURE_CONTAINER;
export const Product_Image_Container_Name = process.env.AZURE_STORAGE_PRODUCTS_CONTAINER;
export const Chat_Image_Container_Name = process.env.AZURE_STORAGE_MESSAGES_CONTAINER;
export const Review_Image_Container_Name = process.env.AZURE_STORAGE_REVIEWS_CONTAINER;
export const Brand_Image_Container_Name = process.env.AZURE_STORAGE_BRANDS_CONTAINER;
export const Offer_Image_Container_Name = process.env.AZURE_STORAGE_OFFERS_CONTAINER;


// Upload image to Azure Blob Storage
export const uploadImageToAzure = async (imageBuffer, imageName, containerClient) => {
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    await blockBlobClient.upload(imageBuffer, imageBuffer.length);
    return blockBlobClient.url; // Return URL of uploaded image
};



// ----------------------------------------- Routes -----------------------------------------


// ----------------- Chat -----------------

export const CHAT_ROUTE = "api/chat";

export const SEND_MESSAGE_ROUTE = `${CHAT_ROUTE}/message`;


// ----------------- AI -----------------
export const AI_ROUTE = "api/product";

export const ANALYSE_PRODUCT_IMAGE_ROUTE = `${AI_ROUTE}/analyse-image`;