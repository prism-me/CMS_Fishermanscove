import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import MaterialButton from '@material-ui/core/Button';

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, Radio, RadioGroup, FormControlLabel, Avatar, Typography } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
// import ClassicEditor from "../../plugins/ckeditor.js";
// import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams, withRouter } from "react-router-dom";

// ClassicEditor.b


// import FormGroup from '@material-ui/core/FormGroup';
// import Checkbox from '@material-ui/core/Checkbox';
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@material-ui/icons/CheckBox';
// import Favorite from '@material-ui/icons/Favorite';
// import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import GalleryDialog from "views/Common/GalleryDialog";

const website_url = "https://fishermanscove-resort.com/rooms-inner/";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // width:'60%',
    // margin:'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


export default withRouter(function AddRoom(props) {
  const classes = useStyles();
  //check if edit or add request
  let { id } = useParams();

  const initialObject = {
    post_name: '',
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    room_type: -1,
    parent_id: -1,
    thumbnail: '',
    alt_text: '',
    meta_title: '',
    meta_description: '',
    schema_markup: '',
    post_url: '',
    route: website_url,
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "0,0",
    images_list: []
  };
  const [room, setRoom] = useState({ ...initialObject })

  const [roomImages, setRoomImages] = useState([]);
  const [maskedRoute, setMaskedRoute] = useState(website_url);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  const [imagesData, setImagesData] = useState([])
  const [uploadsPreview, setUploadsPreview] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(false)
  const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      setPostId(id);
      API.get(`/rooms/${id}/edit`).then(response => {
        if (response.status === 200) {
          setRoom({ ...room, ...response?.data?.content[0] })
          setUploadsPreview(response.data?.uploads)
        }
      })
    }
    getGalleryImages();
  }, [])

  const getGalleryImages = () => {
    API.get(`/uploads`).then(response => {
      if (response.status === 200) {
        setImagesData(response.data?.map(x => ({ ...x, isChecked: false })))
      }
    })
  }

  const handleInputChange = (e) => {
    let updatedRoom = { ...room };
    updatedRoom[e.target.name] = e.target.value;
    if (e.target.name === "post_name") {
      let updatedValue = e.target.value.replace(/\s+/g, '-')
      updatedValue = updatedValue.replace(/--/g, '-')
      updatedRoom["route"] = website_url + updatedValue.toLowerCase();
    }
    setRoom(updatedRoom);
  }

  const handleRouteChange = (e) => {
    let updatedRoom = { ...room };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
    updatedValue = updatedValue.replace(/--/g, '-')
    updatedRoom[e.target.name] = website_url + updatedValue.toLowerCase();
    setRoom(updatedRoom);
  }

  const handleFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    createImage(files[0]);
  }

  const createImage = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      setRoom({ ...room, thumbnail: e.target.result });
      if (isEdit) {
        API.patch(`update_upload/${post_id}/rooms-suites`, {
          thumbnail: e.target.result
        }).then(response => {
          console.log(response)
        })
      }
    };
    reader.readAsDataURL(file);
  }

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && thumbnailPreview !== "") {
        alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
        return;
      } else {
        if (isSingle) {
          setRoom({ ...room, thumbnail: imagesData[index].id })
          setThumbnailPreview(imagesData[index].avatar)
        } else {
          setSelectedImages([...selectedImages, imagesData[index].id]);
        }
        let imagesDataUpdated = imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: true
            }
          } else {
            return x
          }
        });
        setImagesData(imagesDataUpdated);
      }
    } else {
      if (isSingle) {
        setRoom({ ...room, thumbnail: "" })
        setThumbnailPreview("")
      } else {
        setSelectedImages(selectedImages.filter(x => x !== imagesData[index].id));
      }
      setImagesData(imagesData.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            isChecked: false
          }
        } else {
          return x
        }
      }));
    }
  }

  const handleSubmit = () => {
    let finalRoom = room;
    finalRoom.route = finalRoom.route.split(website_url)?.[1];
    finalRoom.images_list = JSON.stringify(selectedImages);
    finalRoom.is_indexed_or_is_followed = `${finalRoom.is_indexed},${finalRoom.is_followed}`;
    if (isEdit) {
      API.put(`/rooms/${id}`, finalRoom).then(response => {
        if (response.status === 200) {
          alert("Record Updated")
          setRoom({ ...initialObject }); //clear all fields
          props.history.push('/admin/room-suites');
        }
      })
    }
    else {
      API.post('/rooms', finalRoom).then(response => {
        if (response.status === 200) {
          setPostId(response.data?.post_id);
          alert('Record Updated');
          setRoom({ ...initialObject });
          props.history.push('/admin/room-suites');
        }
      })
    }
  }

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader color="primary">
          <h4 className="mb-0">Add Room/Suite</h4>
          {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
        </CardHeader>
        <CardBody>
          <h4 className="mt-3">General Information</h4>
          <Grid container spacing={2} style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sm={7} >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="post_name"
                    name="post_name"
                    label="Name"
                    value={room.post_name}
                    variant="outlined"
                    fullWidth
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl variant="outlined" size="small" fullWidth className={classes.formControl}>
                    <InputLabel id="room_type-label">Type</InputLabel>
                    <Select
                      labelId="room_type-label"
                      id="room_type"
                      name="room_type"
                      value={room.room_type}
                      onChange={handleInputChange}
                      label="Type"
                      fullWidth
                    >
                      <MenuItem value={-1}>
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={1}>Room</MenuItem>
                      <MenuItem value={2}>Suite</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="post_url"
                    name="post_url"
                    label="Synesis Link"
                    value={room.post_url}
                    variant="outlined"
                    fullWidth
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="alt_text"
                    name="alt_text"
                    label="Image Alt Text"
                    value={room.alt_text}
                    variant="outlined"
                    fullWidth
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>

              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <div className="thumbnail-preview-wrapper img-thumbnail">
                {
                  !isEdit ?
                    thumbnailPreview && thumbnailPreview !== "" ?
                      <img src={thumbnailPreview} alt={room.alt_text || ""} />
                      :
                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                    :
                    typeof (room.thumbnail) === typeof (0) ?
                      // room.thumbnail && room.thumbnail !== "" ?
                      <img src={thumbnailPreview} alt={room.alt_text || ""} />
                      :
                      <img src={room.thumbnail} alt={room.alt_text || ""} />
                }
              </div>
              <Fragment>
                <MaterialButton
                  variant="contained"
                  color="primary"
                  startIcon={<Image />}
                  className="mt-1"
                  fullWidth
                  onClick={() => {
                    setIsSingle(true);
                    setShowGallery(true);
                  }}
                >
                  {isEdit ? 'Change' : 'Upload'} Featured Image
                </MaterialButton>
              </Fragment>
            </Grid>
            <Grid item xs={12} sm={12}>
              <hr />
              <h4>Short Description</h4>
              <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={room.short_description} onChange={(e) => setRoom({ ...room, short_description: e.editor.getData() })} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <hr />
              <h4>Detailed Content</h4>

              <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={room.post_content} onChange={(e) => setRoom({ ...room, post_content: e.editor.getData() })} />

            </Grid>
          </Grid>
          <hr />

          <h4 className="mt-2">SEO Information</h4>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="meta_title"
                name="meta_title"
                label="Meta Title"
                value={room.meta_title}
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="route"
                name="route"
                label="Permalink"
                value={room.route}
                variant="outlined"
                fullWidth
                onChange={handleRouteChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="meta_description"
                name="meta_description"
                label="Meta Description"
                value={room.meta_description}
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="schema_markup"
                name="schema_markup"
                label="Schema Markup"
                value={room.schema_markup}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                rowsMax={4}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={room.is_followed} onChange={(e) => {
                  setRoom({ ...room, is_followed: !room.is_followed })
                }}>
                  <FormControlLabel value={true} control={<Radio />} label="Follow" />
                  <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={room.is_indexed} onChange={(e) => {
                  setRoom({ ...room, is_indexed: !room.is_indexed })
                }}>
                  <FormControlLabel value={true} control={<Radio />} label="Index" />
                  <FormControlLabel value={false} control={<Radio />} label="No Index" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <MaterialButton onClick={handleSubmit} style={{ float: 'right' }} variant="contained" color="primary" size="large">
                Submit
              </MaterialButton>
            </Grid> */}
          </Grid>
        </CardBody>
      </Card>
      {/* {isEdit && */}
      <Card>
        <CardBody>
          <h3>Room Images</h3>
          <p><em>Please select images from gallery.</em></p>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <MaterialButton variant="outlined" color="primary" onClick={() => { setRenderPreviews(false); setIsSingle(false); setShowGallery(true) }}>
                Select Gallery Images
              </MaterialButton>
            </Grid>
            {
              renderPreviews && imagesData?.filter(function (array_el) {
                return selectedImages.filter(function (menuItems_el) {
                  return menuItems_el == array_el.id;
                }).length !== 0
              })?.map(x => (
                <Grid item xs={12} sm={2}>
                  <div style={{ height: '120px' }}>
                    <img width="100%" src={x.avatar} className="img-thumbnail" alt="" style={{ height: '90%', objectFit: 'cover' }} />
                    <p style={{ fontSize: '12px' }} className="text-center">
                      {x.alt_tag}
                    </p>
                  </div>
                </Grid>
              ))
            }
            {
              uploadsPreview && uploadsPreview?.map(x => (
                <Grid item xs={12} sm={2}>
                  <div style={{ height: '120px' }}>
                    <img width="100%" src={x.avatar} className="img-thumbnail" alt="" style={{ height: '90%', objectFit: 'cover' }} />
                    <p style={{ fontSize: '12px' }} className="text-center">
                      {x.alt_tag}
                    </p>
                  </div>
                </Grid>
              ))
            }
            <div className="clearfix clear-fix"></div>
            {/* GALLERY DIALOG BOX START */}
            <GalleryDialog isSingle={isSingle} open={showGallery} handleImageSelect={handleImageSelect} handleClose={() => {
              setShowGallery(false);
              setRenderPreviews(true);
            }} refreshGallery={getGalleryImages} data={imagesData} />
            {/* GALLERY DIALOG BOX END */}
          </Grid>
        </CardBody>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <MaterialButton onClick={handleSubmit} style={{ float: 'right' }} variant="contained" color="primary" size="large">
            Submit
          </MaterialButton>
        </Grid>
      </Grid>
      {/* } */}
    </div>
  );
})
