import express, { Request, Response, NextFunction } from 'express';
import { likeService } from '../4-services/like-service';

class LikeController {
    public readonly router = express.Router();

    public constructor() {
        this.router.post('/likes', this.like);
        this.router.delete('/likes/:id', this.unlike);
        this.router.post('/likes/toggle', this.toggleLike);

        // Added routes to fix 404 errors:
        this.router.get('/likes/:id/count', this.getLikesCount);
        this.router.get('/likes', this.getAllLikes);
    }

    private async like(request: Request, response: Response, next: NextFunction) {
        try {
            const { vacationId, userId } = request.body;
            if (!vacationId || !userId) {
                return response.status(400).json({ message: 'vacationId and userId are required' });
            }
            await likeService.likeVacation(userId, vacationId);
            response.status(201).json({ message: 'Liked successfully' });
        } catch (err: any) {
            next(err);
        }
    }

    private async unlike(request: Request, response: Response, next: NextFunction) {
        try {
            const vacationId = request.params.id;
            const userId = request.query.userId as string;
            if (!userId) {
                return response.status(400).json({ message: 'userId is required' });
            }
            await likeService.unlikeVacation(vacationId, userId);
            response.json({ message: 'Unliked successfully' });
        } catch (err: any) {
            next(err);
        }
    }

    private async toggleLike(request: Request, response: Response, next: NextFunction) {
        try {
            const { vacationId, userId } = request.body;

            if (!vacationId || !userId) {
                return response.status(400).json({ message: 'vacationId and userId are required' });
            }

            const userHasLiked = await likeService.isUserLikedVacation(vacationId, userId);

            if (userHasLiked) {
                await likeService.unlikeVacation(vacationId, userId);
            } else {
                await likeService.likeVacation(userId, vacationId);
            }

            const likesCount = await likeService.getLikesCount(vacationId);

            response.json({
                liked: !userHasLiked,
                likesCount,
            });
        } catch (err: any) {
            next(err);
        }
    }

    // New method to get likes count for a vacation
    private async getLikesCount(request: Request, response: Response, next: NextFunction) {
        try {
            const vacationId = request.params.id;
            const likesCount = await likeService.getLikesCount(vacationId);
            response.json({ likesCount });
        } catch (err: any) {
            next(err);
        }
    }

    // Optional: get all likes (remove if not needed)
    private async getAllLikes(request: Request, response: Response, next: NextFunction) {
        try {
            const likes = await likeService.getAllLikes(); // We'll add this service method next
            response.json(likes);
        } catch (err: any) {
            next(err);
        }
    }
}

export const likeController = new LikeController();
