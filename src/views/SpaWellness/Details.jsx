import React, { useEffect, useState } from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { useWideCardMediaStyles } from '@mui-treasury/styles/cardMedia/wide';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';
import API from 'utils/http';
import { Chip } from '@material-ui/core';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    overflow: 'initial',
    maxWidth: '75%',
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
}));

export const SpaWellnessDetail = React.memo(function ReviewCard() {
  let params = useParams();
  const styles = useStyles();
  const mediaStyles = useWideCardMediaStyles();
  const shadowStyles = useFadedShadowStyles();
  const gutterStyles = usePushingGutterStyles({ firstExcluded: true });

  const [room, setRoom] = useState(null);

  useEffect(() => {
    API.get(`/single_dining/${params.id}`).then(response => {
      if (response.status === 200) {
        setRoom(response.data[0])
      }
    })
  }, [])

  return (
    <Card elevation={0} className={styles.root}>
      <CardMedia
        classes={mediaStyles}
        image={
          room?.avatar
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
            label={room?.room_type === 0 ? 'Room' : 'Suite'}
            clickable={false}
            size="small"
            color="primary"
          />
        </Box>
        {/* <Box color={'grey.500'} display={'flex'} alignItems={'center'} mb={1}>
          <Chip
            // icon={<FaceOutlined />}
            label={room?.post_category?.category_name}
            clickable={false}
            size="small"
          // color="primary"
          />
        </Box> */}
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
        <div dangerouslySetInnerHTML={{__html: room?.short_description}}>

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
          <div dangerouslySetInnerHTML={{__html: room?.post_content}}></div>
        </Box>
      </CardContent>
    </Card>
  );
});

export default SpaWellnessDetail