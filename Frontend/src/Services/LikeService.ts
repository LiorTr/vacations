import axios from 'axios';
import { appConfig } from '../Utils/AppConfig';
import { notify } from '../Utils/notify';

interface LikesCountResponse {
    likesCount: number;
}

class LikeService {
    public async likeVacation(userId: string, vacationId: string): Promise<void> {
        try {
            await axios.post(appConfig.likesUrl, {
                vacationId,
                userId,
            });
            notify.success('Vacation liked');
        } catch (err) {
            notify.error('Failed to like vacation');
        }
    }

public async unlikeVacation(vacationId: string, userId: string): Promise<void> {
  try {
    await axios.delete(`${appConfig.likesUrl}${vacationId}`, {
      params: { userId }
    });
    notify.success('Vacation unLiked');
  } catch (err) {
    notify.error('Failed to unlike vacation');
  }
}


    public async getLikesCount(vacationId: string): Promise<number> {
        try {
            const response = await axios.get<LikesCountResponse>(`${appConfig.likesUrl}${vacationId}/count`);
            return response.data.likesCount;
        } catch (err) {
            notify.error('Failed to fetch likes count');
            return 0;
        }
    }
}

export const likeService = new LikeService();
