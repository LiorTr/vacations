import express, { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../3-models/enums';
import { securityMiddleware } from '../6-middleware/security-middleware';
import { vacationService } from '../4-services/vacation-service';
import { VacationModel } from '../3-models/vacation-model';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { appConfig } from '../2-utils/app-config';
import fs from 'fs';
class VacationController {
    public readonly router = express.Router();
    public constructor() {
        this.router.get(
            '/vacations',
            this.getAllVacations,
            securityMiddleware.validateLogin
        );
        this.router.get(
            '/vacations/:id',
            this.getOneVacation,
            securityMiddleware.validateLogin
        );
        this.router.post(
            '/vacations',
            // securityMiddleware.validateAdmin,
            this.addVacation
        );
        // this.router.put(
        //   '/vacations/:id([0-9]+)',
        //   securityMiddleware.validateAdmin,
        //   this.updateVacation
        // );
        this.router.delete(
            '/vacations/:id',
            securityMiddleware.validateAdmin,
            this.deleteVacation
        );
        this.router.get(
            '/vacations/images/:imageName',
            this.getVacationImage,
            securityMiddleware.validateLogin
        );
    }
    private async getAllVacations(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            console.log('Getting all vacations from the database...');
            const vacations = await vacationService.getAllVacations();
            response.json(vacations);
        } catch (err: any) {
            next(err);
        }
    }
    private async getOneVacation(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            const id = request.params.id;
            const vacation = await vacationService.getVacationById(id);
            response.json(vacation);
        } catch (err: any) {
            next(err);
        }
    }
    private async addVacation(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            if (!request.files || !request.files.image) {
                return response
                    .status(StatusCode.BadRequest)
                    .json({ message: 'Image is required' });
            }
            const imageFile = request.files.image as UploadedFile;
            const imagePath = path.join(__dirname, '..', 'uploads', imageFile.name);
            imageFile.mv(imagePath, (err) => {
                if (err) {
                    return next(err);
                }
            });
            const imageName =
                appConfig.baseImageUrl + imageFile.name.trim();
            const vacation = new VacationModel({
                ...request.body,
                image: imageName,
            });
            const addedVacation = await vacationService.createVacation(vacation);
            response.status(StatusCode.Created).json(addedVacation);
        } catch (err: any) {
            ``
            next(err);
        }
    }
    // public async updateVacation(
    //   request: Request,
    //   response: Response,
    //   next: NextFunction
    // ) {
    //   try {
    //     const id = request.params.id;
    //     const vacationData = request.body;

    //     const image = request.files?.image as UploadedFile | undefined;

    // const updatedVacation = await vacationService.updateVacation(
    //   id,
    //   vacationData,
    //   image
    // );

    //     response.json(updatedVacation);
    //   } catch (err: any) {
    //     if (err.name === 'ResourceNotFoundError') {
    //       response.status(404).json({message: err.message});
    //     } else {
    //       next(err);
    //     }
    //   }
    // }
    private async deleteVacation(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            const id = request.params.id;
            //remove image file from uploads
            const vacation = await vacationService.getVacationById(id);
            const imageName = vacation.image.split('/').pop();
            const imagePath = path.join(__dirname, '..', 'uploads', imageName);
            fs.unlinkSync(imagePath);
            await vacationService.deleteVacation(id);
            response.sendStatus(StatusCode.NoContent);
        } catch (err: any) {
            next(err);
        }
    }
    private async getVacationImage(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            const imageName = request.params.imageName;
            const imagePath = await vacationService.getVacationImage(imageName);
            response.sendFile(imagePath);
        } catch (err: any) {
            next(err);
        }
    }
}
export const vacationController = new VacationController();
