import React, { useEffect, useState } from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
// import IconButton from '@material-ui/core/IconButton';
// import LocationOn from '@material-ui/icons/LocationOn';
// import MoreHoriz from '@material-ui/icons/MoreHoriz';
// import Favorite from '@material-ui/icons/Favorite';
// import FaceGroup from '@mui-treasury/components/group/face';
import { useWideCardMediaStyles } from '@mui-treasury/styles/cardMedia/wide';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';
import API from 'utils/http';
import { Chip } from '@material-ui/core';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

// import { FaceOutlined } from '@material-ui/icons';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'initial',
    maxWidth: '85%',
    margin: 'auto',
    backgroundColor: 'transparent',
  },
  title: {
    marginBottom: 0,
  },
  rateValue: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  content: {
    position: 'relative',
    padding: 24,
    margin: '-24% 16px 0',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  favorite: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  locationIcon: {
    marginRight: 4,
    fontSize: 18,
  },
  imagesWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

export const RoomDetail = React.memo(function ReviewCard() {
  let params = useParams();
  const styles = useStyles();
  const classes = useStyles();
  const mediaStyles = useWideCardMediaStyles();
  const shadowStyles = useFadedShadowStyles();
  const gutterStyles = usePushingGutterStyles({ firstExcluded: true });

  const [room, setRoom] = useState(null);
  const [tileData, setTileData] = useState([
    {
      img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      title: 'Junior suite',
      author: ''
    },
    {
      img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      title: 'Deluxe suite',
      author: ''
    },
    {
      img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      title: 'Luxury Room',
      author: ''
    },
  ]);

  useEffect(() => {
    API.get(`/rooms/${params.id}`).then(response => {
      if (response.status === 200) {
        setRoom(response.data)
      }
    })
  }, [])

  return (
    <Card elevation={0} className={styles.root}>
      <CardMedia
        classes={mediaStyles}
        image={
          room?.thumbnail
          // 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80'
        }
      />
      <CardContent className={cx(shadowStyles.root, styles.content)}>
        <h3 className={styles.title}>
          {
            room?.post_name
          }
        </h3>
        <Box color={'grey.500'} display={'flex'} alignItems={'center'} mb={1}>
          <Chip
            // icon={<FaceOutlined />}
            label={room?.room_type === 1 ? 'Room' : 'Suite'}
            clickable={false}
            size="small"
            color="primary"
          />
        </Box>
        <Box color={'grey.500'} display={'flex'} alignItems={'center'} mb={1}>
          <Chip
            // icon={<FaceOutlined />}
            label={room?.post_category?.[0]?.category_name}
            clickable={false}
            size="small"
          // color="primary"
          />
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          mb={1}
          className={gutterStyles.parent}
        >
          <Rating name={'rating'} value={2} size={'small'} />
          <Typography variant={'body2'} className={styles.rateValue}>
            4.0
          </Typography>
        </Box>
        {/* <Typography color={'textSecondary'} variant={'body2'}>
          {
            room?.short_description
          }
        </Typography> */}
        <div dangerouslySetInnerHTML={{ __html: room?.short_description }}>

        </div>
        <Box
          mt={2}
        // display={'flex'}
        // justifyContent={'space-between'}
        // alignItems={'center'}
        >
          <Typography color={'primary'} variant="h5">
            Details
        </Typography>
          <div dangerouslySetInnerHTML={{ __html: room?.post_content }}></div>
        </Box>

        <Box mt={4}>
          <div className={classes.imagesWrapper}>
            <GridList className={classes.gridList} cols={2.5}>
              {room?.uploads?.map((tile) => (
                <GridListTile key={tile.alt_tag}>
                  <img src={tile.avatar} alt={tile.alt_tag} />
                  <GridListTileBar
                    title={tile.alt_tag}
                    // subtitle={<span>by: {tile.author}</span>}
                    actionIcon={
                      <IconButton aria-label={`info about ${tile.alt_tag}`} className={classes.icon}>
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
});

export default RoomDetail