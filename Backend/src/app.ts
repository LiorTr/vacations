import express from "express";
import { appConfig } from "./2-utils/app-config";
import { errorsMiddleware } from "./6-middleware/errors-middleware";
import { securityMiddleware } from "./6-middleware/security-middleware";
import { userController } from "./5-controllers/user-controller";
import expressFileUpload from "express-fileupload";
import { fileSaver } from "uploaded-file-saver";
import path from "path";
import cors from "cors";
import expressRateLimit from "express-rate-limit";
import { dal } from "./2-utils/dal";
import { vacationController } from "./5-controllers/vacation-controller";
import { likeController } from "./5-controllers/like-controller";

class App {
    // Configure fileSaver once: 
    private server = express();

    public async start() {
        this.server.use('/files', express.static(path.join(__dirname, 'uploads')));
        // Configure file saver

        // Apply rate limiting
        this.server.use(expressRateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // Limit each IP to 100 requests per windowMs
            message: "Too many requests, please try again later."
        }));

        // Enable CORS
        this.server.use(cors({
            origin: "http://localhost:3000", // Allow requests from this origin
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));

        // Parse JSON body
        this.server.use(express.json());

        // Handle file uploads
        this.server.use(expressFileUpload());

        // Apply security middleware
        this.server.use(securityMiddleware.preventXssAttack);

        // Register routes
        this.server.use("/api", userController.router);
        this.server.use("/api", vacationController.router);
        this.server.use("/api", likeController.router);

        // Middleware for handling 404 errors
        this.server.use("*", errorsMiddleware.routeNotFound);

        // Middleware for handling all errors
        this.server.use(errorsMiddleware.catchAll);

        // Connect to MongoDB
        await dal.connect();

        // Start the server
        this.server.listen(appConfig.port, () =>
            console.log(`Listening on http://localhost:${appConfig.port}`)
        );
    }
}

const app = new App();
app.start();
