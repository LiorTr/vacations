import path from 'path';
import { UploadedFile } from 'express-fileupload';
import { VacationModel, IVacationModel } from '../3-models/vacation-model';
import { ResourceNotFoundError } from '../3-models/client-error';
import { VacationDto } from '../3-models/vacation-dto';

class VacationService {

    public async getVacationById(_id: string): Promise<VacationDto> {
        const vacation = await VacationModel.findById(_id).exec();
        if (!vacation) throw new ResourceNotFoundError('Vacation not found');

        const v = vacation.toObject();
        return {
            _id: v._id.toString(),
            destination: v.destination,
            description: v.description,
            startDate: v.startDate,
            endDate: v.endDate,
            price: v.price,
            image: v.image,
            likesCount: 0,
            likes: []
        };
    }

    public async getAllVacations(): Promise<VacationDto[]> {
        const vacations = await VacationModel.aggregate([
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'vacationId',
                    as: 'likes',
                },
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                },
            },
            {
                $project: {
                    destination: 1,
                    description: 1,
                    startDate: 1,
                    endDate: 1,
                    price: 1,
                    image: 1,
                    likes: 1,
                    likesCount: 1,
                },
            },
        ]).exec();

        return vacations.map((v: any) => ({
            _id: v._id.toString(),
            destination: v.destination,
            description: v.description,
            startDate: v.startDate,
            endDate: v.endDate,
            price: v.price,
            image: v.image,
            likes: v.likes || [],
            likesCount: v.likesCount || 0
        }));
    }

    public async createVacation(vacationData: Partial<IVacationModel>): Promise<VacationDto> {
        const vacation = new VacationModel(vacationData);
        const saved = await vacation.save();
        return {
            _id: saved._id.toString(),
            destination: saved.destination,
            description: saved.description,
            startDate: saved.startDate,
            endDate: saved.endDate,
            price: saved.price,
            image: saved.image,
            likes: [],
            likesCount: 0
        };
    }

    public async getVacationImage(imageName: string): Promise<string> {
        return path.join(__dirname, '..', 'uploads', imageName);
    }

    public async sortVacationsByDates(): Promise<VacationDto[]> {
        const vacations = await VacationModel.find().sort({ startDate: 1 }).exec();
        return vacations.map(v => ({
            _id: v._id.toString(),
            destination: v.destination,
            description: v.description,
            startDate: v.startDate,
            endDate: v.endDate,
            price: v.price,
            image: v.image,
            likes: [],
            likesCount: 0
        }));
    }

    public async getVacationsByLikes(): Promise<VacationDto[]> {
        const vacations = await VacationModel.aggregate([
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'vacationId',
                    as: 'likes',
                },
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                },
            },
            {
                $sort: { likesCount: -1 },
            },
        ]).exec();

        return vacations.map((v: any) => ({
            _id: v._id.toString(),
            destination: v.destination,
            description: v.description,
            startDate: v.startDate,
            endDate: v.endDate,
            price: v.price,
            image: v.image,
            likes: v.likes || [],
            likesCount: v.likesCount || 0
        }));
    }

    public async deleteVacation(_id: string): Promise<void> {
        await VacationModel.deleteOne({ _id }).exec();
    }
}

export const vacationService = new VacationService();
