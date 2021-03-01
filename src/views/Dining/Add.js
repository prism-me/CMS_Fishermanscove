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
import { MenuItem, Select, FormControl, TextField, Radio, RadioGroup, FormControlLabel, Avatar } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams, withRouter } from "react-router-dom";
import GalleryDialog from "views/Common/GalleryDialog";

const website_url = "http://fishermanscove-resort.com/dining-inner/";

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

export default withRouter(function DiningAdd(props) {
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
    is_indexed_or_is_followed: '1,1',
    images_list: []
  }
  const [dining, setDining] = useState({ ...initialObject })

  const [diningImages, setDiningImages] = useState([]);
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
      API.get(`/dining/${id}/edit`).then(response => {
        if (response.status === 200) {
          setDining({ ...dining, ...response?.data?.category_details?.[0] });
          setUploadsPreview(response.data?.uploads)
        }
      })
    }
    getGalleryImages();
  }, [])

  const getGalleryImages = () => {
    API.get(`/uploads`).then(response => {
      debugger;
      if (response.status === 200) {
        setImagesData(response.data?.map(x => ({ ...x, isChecked: false })))
      }
    })
  }

  const handleInputChange = (e) => {
    let updatedDining = { ...dining };
    updatedDining[e.target.name] = e.target.value;
    setDining(updatedDining);
  }

  const handleRouteChange = (e) => {
    let updatedDining = { ...dining };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
    updatedValue = updatedValue.replace(/--/g, '-')
    updatedDining[e.target.name] = website_url + updatedValue;
    setDining(updatedDining);
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
      setDining({ ...dining, thumbnail: e.target.result });
      if (isEdit) {
        API.patch(`update_upload/${post_id}/dining`, {
          thumbnail: e.target.result
        }).then(response => {
          console.log(response)
        })
      }
    };
    reader.readAsDataURL(file);
  }

  const handleMultipleFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    let imagesObject = [];

    Object.entries(files).map((x, i) => {
      return imagesObject.push({
        avatar: x[1],
        post_id,
        alt_tag: '',
        is360: false
      });
    })
    setDiningImages([...diningImages, ...imagesObject])
  }

  const handleImageAltChange = (e, index) => {
    let updatedDiningImages = [...diningImages];
    updatedDiningImages[index].alt_tag = e.target.value;
    setDiningImages(updatedDiningImages)
  }

  const handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    diningImages.forEach(x => {
      imagesFormData.append("images", x)
    })
    API.post(`/multiple_upload`, imagesFormData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
      }
    }).then(response => {
      if (response.status === 200) {
        alert("Files Uploaded");
        setDiningImages([]);
        props.history.push('/admin/weddings');
      }
    }).catch(err => alert("Something went wrong"));

  }

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && thumbnailPreview !== "") {
        alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
        return;
      } else {
        if (isSingle) {
          setDining({ ...dining, thumbnail: imagesData[index].id })
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
        setDining({ ...dining, thumbnail: "" })
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
    let finalDining = dining;
    finalDining.images_list = JSON.stringify(selectedImages);
    finalDining.is_indexed_or_is_followed = `${finalDining.is_indexed},${finalDining.is_followed}`

    if (isEdit) {
      API.put(`/dining/${id}`, finalDining).then(response => {
        console.log(response);
        if (response.status === 200) {
          alert("Record Updated");
          setDining({ ...initialObject }); //clear all fields
          props.history.push('/admin/dining');
        }
      })
    } else {
      API.post('/dining', finalDining).then(response => {
        console.log(response);
        if (response.status === 200) {
          setPostId(response.data?.post_id);
          alert("Restaurant/Bar Added");
          setDining({ ...initialObject });
          props.history.push('/admin/dining');
        }
      })
    }
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add Dining/Suite</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <h4 className="mt-3">General Information</h4>
            <Grid container spacing={2} style={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={7} >
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="post_name"
                      name="post_name"
                      label="Name"
                      value={dining.post_name}
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
                      value={dining.alt_text}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className="thumbnail-preview-wrapper-small img-thumbnail">
                  {
                    !isEdit ?
                      thumbnailPreview && thumbnailPreview !== "" ?
                        <img src={thumbnailPreview} alt={dining.alt_text || ""} />
                        :
                        <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                      :
                      typeof (dining.thumbnail) === typeof (0) ?
                        // dining.thumbnail && dining.thumbnail !== "" ?
                        <img src={thumbnailPreview} alt={dining.alt_text || ""} />
                        :
                        <img src={dining.thumbnail} alt={dining.alt_text || ""} />
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
                <h4 className="mt-2">Short Description</h4>
                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={dining.short_description} onChange={(e) => setDining({ ...dining, short_description: e.editor.getData() })} />

              </Grid>
              <Grid item xs={12} sm={12}>
                <hr />
                <h4 className="mt-2">Detailed Content</h4>
                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={dining.post_content} onChange={(e) => setDining({ ...dining, post_content: e.editor.getData() })} />

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
                  value={dining.meta_title}
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
                  value={dining.route}
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
                  value={dining.meta_description}
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
                  value={dining.schema_markup}
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
                  <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={dining.is_followed} onChange={(e) => {
                    setDining({ ...dining, is_followed: !dining.is_followed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Follow" />
                    <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={dining.is_indexed} onChange={(e) => {
                    setDining({ ...dining, is_indexed: !dining.is_indexed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Index" />
                    <FormControlLabel value={false} control={<Radio />} label="No Index" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
        {/* {isEdit && */}
        <Card>
          <CardBody>
            <h3>Dining Images</h3>
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
    </div>
  );
}
)