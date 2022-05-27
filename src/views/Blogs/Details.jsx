import React, { useEffect, useState } from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useWideCardMediaStyles } from '@mui-treasury/styles/cardMedia/wide';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';
import API from 'utils/http';
import { Grid } from '@material-ui/core';
import { useParams, withRouter, useLocation } from "react-router-dom";
import LangAPI from "langapi/http";

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
  let { id } = useParams();
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const lang = query.get('lang');
  

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
    // API.get(`/blogs/${id}`).then(response => {
    //   if (response.status === 200) {
    //     setRoom(response.data?.data)
    //   }
    // })
    LangAPI.get(`/blogs/${id}?lang=${lang}`).then((response) => {
      if (response.status === 200) {
          let data = { ...response?.data?.data };
          console.log("response?.data?.data",response?.data?.data)
          setRoom(response.data?.data)
          // data.route = website_url + data.route;
          // if(response?.data?.data){
            
          // } else {
          //   setRoom({ ...initialObject });
          // }
      }
  });
  }, [])

  return (
    <Card elevation={0} className={styles.root}>
      <CardMedia
        classes={mediaStyles}
        image={
          room?.img
          // 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80'
        }
      />
      <CardContent className={cx(shadowStyles.root, styles.content)}>
        <h3 className={styles.title}>
          {
            room?.title
          }
        </h3>
        <h4>
          {
            room?.sub_title
          }
        </h4>
        <div dangerouslySetInnerHTML={{ __html: room?.short_description }}>
        </div>
        <Box
          mt={2}
        >
          <Typography color={'primary'} variant="h5">
            Details
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: room?.long_description }}></div>
        </Box>

        <Box
          mt={2}
        >
          <Typography color={'primary'} variant="h5">
            Author Details
          </Typography>
          <h4>
            Written By {
              room?.posted_by
            }
          </h4>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <img src={room?.author_img} alt={"img"} className={"img-fluid"} />
            </Grid>
            <Grid item xs={12} sm={9}>
              <p dangerouslySetInnerHTML={{ __html: room?.author_details }}>
              </p>
            </Grid>
          </Grid>
        </Box>

      </CardContent>
    </Card>
  );
});

export default RoomDetail