import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { appConfig } from "./app-config";

class DAL {
    private db: mongoose.Connection;


    public async connect() {
        try {
            // Connect to MongoDB
            const db = await mongoose.connect(appConfig.mongodbConnectionString);
            this.db = db.connection;

            console.log(`We're connected to MongoDB, database: ${db.connections[0].name}`);
        } catch (err) {
            console.error(err);
        }
    }

}

export const dal = new DAL();
