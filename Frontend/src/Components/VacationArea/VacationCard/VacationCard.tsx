import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Button,
  Collapse,
  Box
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import parseISO from "date-fns/parseISO"
import { likeService } from '../../../Services/LikeService';
import { useSelector } from 'react-redux';
import { AppState } from '../../../Redux/store';
import { UserModel } from '../../../Models/UserModel';

const Card = styled(MuiCard)(`
  max-width: 240px;
  margin: 16px;
  background-color: #252323;
  color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`);

const MediaContainer = styled('div')({
  position: 'relative',
  height: 140,
});

const TitleOverlay = styled(Typography)(({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  color: '#ffffff',
  background: 'rgba(0, 0, 0, 0.5)',
  padding: '8px',
  textAlign: 'center',
}));

type VacationCardProps = {
  _id: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  image: string;
  likes: string[]; // Array of userIds
  likesCount: number;
};

export function VacationCard(props: VacationCardProps) {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [likesCountState, setLikesCount] = useState<number>(props.likesCount);
  const [userLikes, setUserLikes] = useState<boolean>(false);

  const user = useSelector<AppState, UserModel>((store) => store.user);
  const userId = user?._id;
  const vacationId = props._id;

  useEffect(() => {
    if (userId && props.likes?.includes(userId)) {
      setUserLikes(true);
    } else {
      setUserLikes(false);
    }
    setLikesCount(props.likesCount); // Keep likes count synced when props change
  }, [userId, props.likes, props.likesCount]);

  async function toggleLikeHandler() {
    if (!userId) return;

    try {
      if (!userLikes) {
        await likeService.likeVacation(userId, vacationId);
      } else {
        await likeService.unlikeVacation(vacationId, userId);
      }

      // Fetch updated likes count from backend after toggling like
      const updatedLikesCount = await likeService.getLikesCount(vacationId);
      setLikesCount(updatedLikesCount);
      setUserLikes(!userLikes);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }

  const dateFormatter = (dateString: string): string => {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yy');
  };

  const handleExpandClick = () => {
    setExpandedDescription(!expandedDescription);
  };

  return (
    <div className="VacationCard">
      <Card>
        <MediaContainer>
          <CardMedia sx={{ height: 140 }} image={props.image} />
          <TitleOverlay variant="h6">{props.destination}</TitleOverlay>
        </MediaContainer>

        <CardContent>
          <Typography variant="body1" sx={{ fontSize: '0.7rem' }}>
            {dateFormatter(props.startDate)} - {dateFormatter(props.endDate)}
          </Typography>

          <Collapse in={expandedDescription}>
            <Typography variant="body2" sx={{ mt: 2, fontSize: '0.7rem' }}>
              {props.description}
            </Typography>
          </Collapse>

          <Button
            onClick={handleExpandClick}
            endIcon={<ExpandMoreIcon />}
            sx={{ mt: 1, color: '#9b77e6', fontSize: '0.7rem' }}
          >
            {expandedDescription ? 'Show Less' : 'Read More'}
          </Button>

          <Box
            sx={{
              mt: 2,
              fontSize: '0.7rem',
              backgroundColor: '#984caf',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            {props.price}$
          </Box>
        </CardContent>

        <CardActions disableSpacing sx={{ display: 'flex', alignItems: 'center' }}>
  <IconButton
    aria-label="like the vacation"
    onClick={toggleLikeHandler}
    sx={{ color: userLikes ? 'red' : 'gray' }}
  >
    <FavoriteIcon />
  </IconButton>

  <Button
    onClick={toggleLikeHandler}
    size="small"
    sx={{ fontSize: '0.7rem' }}
  >
    {userLikes ? 'Unlike' : 'Like'}
  </Button>

  {/* Likes count */}
  <Typography sx={{ fontSize: '0.7rem', ml: 1, color: '#ffffff' }}>
    {likesCountState}
  </Typography>
</CardActions>

      </Card>
    </div>
  );
}
