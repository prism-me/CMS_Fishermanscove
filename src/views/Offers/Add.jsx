import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MaterialButton from '@material-ui/core/Button';

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, RadioGroup, Radio, FormControlLabel, Avatar } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams } from "react-router-dom";

const website_url = "http://fishermanscove-resort.com/";

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


export default function AddOffer(props) {
  const classes = useStyles();
  //check if edit or add request
  let { id } = useParams();

  const initialObject = {
    post_name: '',
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    room_type: -1,
    thumbnail: '',
    alt_text: '',
    meta_title: '',
    meta_description: '',
    schema_markup: '',
    post_url: '',
    route: website_url,
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "1,1",
    img_directory: "offers"
  }
  const [offer, setOffer] = useState({ ...initialObject })
  const [offerImages, setOfferImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      setPostId(id);
      API.get(`/offers/${id}/edit`).then(response => {
        if (response.status === 200) {
          setOffer({ ...offer, ...response?.data?.category_details[0] })
        }
      });
    }
    API.get('/offer_categories/offers').then(response => {
      if (response?.status === 200) {
        setCategories(response.data)
      }
    });
  }, [])

  const handleInputChange = (e) => {
    let updatedOffer = { ...offer };
    updatedOffer[e.target.name] = e.target.value;
    setOffer(updatedOffer);
  }

  const handleRouteChange = (e) => {
    let updatedOffer = { ...offer };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
    updatedValue = updatedValue.replace(/--/g, '-')
    updatedOffer[e.target.name] = website_url + updatedValue;
    setOffer(updatedOffer);
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
      setOffer({ ...offer, thumbnail: e.target.result });
      if (isEdit) {
        API.patch(`update_upload/${post_id}/offers`, {
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
    setOfferImages([...offerImages, ...imagesObject])
  }

  const handleImageAltChange = (e, index) => {
    let updatedOfferImages = [...offerImages];
    updatedOfferImages[index].alt_tag = e.target.value;
    setOfferImages(updatedOfferImages)
  }

  const handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    offerImages.forEach(x => {
      imagesFormData.append("images", x)
    })
    API.post(`/multiple_upload`, imagesFormData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
      }
    }).then(response => {
      if (response.status === 200) {
        alert("Files Uploaded");
        setOfferImages([]);
        props.history.push('/admin/weddings');
      }
    }).catch(err => alert("Something went wrong"));

  }

  const handleSubmit = () => {
    let finalOffer = offer;
    finalOffer.is_indexed_or_is_followed = `${finalOffer.is_indexed},${finalOffer.is_followed}`;

    if (isEdit) {
      API.put(`/offers/${id}`, finalOffer).then(response => {
        if (response.status === 200) {
          alert("Record Added");
          // setOffer({ ...initialObject }); //resetting the form
          props.history.push('/admin/offers');
        }
      }).catch(err => alert("Something went wrong"));
    } else {
      API.post('/offers', finalOffer).then(response => {
        if (response.status === 200) {
          alert("Record Updated");
          setPostId(response.data?.post_id);
          // setOffer({ ...initialObject });
          props.history.push('/admin/offers');
        }
      }).catch(err => alert("Something went wrong."))
    }
  }


  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add an Offer</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <h4 className="mt-1">General Information</h4>
            <Grid container spacing={2} style={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={7}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="post_name"
                      name="post_name"
                      label="Name"
                      value={offer.post_name}
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
                      value={offer.alt_text}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  {/* <Grid item xs={6} sm={5}>
                    <Fragment>
                      <input
                        color="primary"
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                        fullWidth
                        id="thumbnail"
                        name="thumbnail"
                        style={{ display: 'none', width: '100%' }}
                      />
                      <label htmlFor="thumbnail" style={{ width: '100%', height: '100%', margin: 0 }}>
                        <Button
                          variant="contained"
                          component="span"
                          className={classes.button}
                          size="sm"
                          fullWidth
                          disableElevation={true}
                          color="primary"
                          style={{ margin: 0, height: '100%', width: '100%' }}
                        >
                          <Image className={classes.extendedIcon} /> {isEdit ? 'Change' : 'Upload'} Featured Image
                        </Button>
                      </label>
                    </Fragment>
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <FormControl variant="outlined"
                      size="small" fullWidth className={classes.formControl}>
                      <InputLabel id="category_id-label">Category</InputLabel>
                      <Select
                        labelId="category_id-label"
                        id="category_id"
                        name="category_id"
                        value={offer.category_id}
                        onChange={handleInputChange}
                        label="Category"
                        fullWidth
                      >
                        <MenuItem value={-1}>
                          <em>Select</em>
                        </MenuItem>
                        {
                          categories?.map(x => (
                            <MenuItem value={x.id}>{x.category_name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className="thumbnail-preview-wrapper-small img-thumbnail">
                  {
                    offer.thumbnail && offer.thumbnail !== "" ?
                      <img src={offer.thumbnail} alt={offer.alt_text || ""} />
                      :
                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                  }
                </div>
                <Fragment>
                  <input
                    color="primary"
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                    id="thumbnail"
                    name="thumbnail"
                    style={{ display: 'none', width: '100%', }}
                  />
                  <label htmlFor="thumbnail" style={{ width: '100%', height: '100%', margin: 0, marginTop: '.15rem' }}>
                    <Button
                      variant="contained"
                      component="span"
                      className={classes.button}
                      // size="sm"
                      fullWidth
                      disableElevation={true}
                      color="primary"
                      style={{ margin: 0, height: '100%', width: '100%' }}
                    >
                      <Image className={classes.extendedIcon} /> {isEdit ? 'Change' : 'Upload'} Featured Image
                    </Button>
                  </label>
                </Fragment>
              </Grid>

              <Grid item xs={12} sm={12}>
                <hr />
                <h4>Short Description</h4>
                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={offer.short_description} onChange={(e) => setOffer({ ...offer, short_description: e.editor.getData() })} />

              </Grid>
              <Grid item xs={12} sm={12}>
                <hr />
                <h4>Detailed Content</h4>
                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={offer.post_content} onChange={(e) => setOffer({ ...offer, post_content: e.editor.getData() })} />

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
                  value={offer.meta_title}
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
                  value={offer.route}
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
                  value={offer.meta_description}
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
                  value={offer.schema_markup}
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
                  <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={offer.is_followed} onChange={(e) => {
                    setOffer({ ...offer, is_followed: !offer.is_followed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Follow" />
                    <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={offer.is_indexed} onChange={(e) => {
                    setOffer({ ...offer, is_indexed: !offer.is_indexed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Index" />
                    <FormControlLabel value={false} control={<Radio />} label="No Index" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <MaterialButton onClick={handleSubmit} style={{ float: 'right' }} variant="contained" color="primary" size="large">
                  Submit
                </MaterialButton>
              </Grid>
            </Grid>
          </CardBody>
        </Card>

        {/* MULTIPLE IMAGES UPLOAD SECTION START */}
        {isEdit &&
          <Card>
            <CardBody>
              <form type="post" encType="multipart/form-data">

                <h3>Offer Images</h3>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    {offerImages.length < 1 &&

                      <Fragment>
                        <input
                          color="primary"
                          accept="image/*"
                          type="file"
                          multiple
                          onChange={handleMultipleFileChange}
                          id="thumbnailMultiple"
                          name="thumbnailMultiple"
                          disabled={post_id > 0 ? false : true}
                          style={{ display: 'none', }}
                        />
                        <label htmlFor="thumbnailMultiple">
                          <Button
                            variant="contained"
                            component="span"
                            className={classes.button}
                            size="large"
                            color="primary"
                            disabled={post_id > 0 ? false : true}
                            style={{ margin: 0, height: '100%', }}
                          >
                            <Image className={classes.extendedIcon} /> Select Multiple Images
                    </Button>
                        </label>
                      </Fragment>
                    }
                  </Grid>
                  {
                    offerImages?.map((x, i) => (
                      <>
                        <Grid item xs={12} sm={2}>
                          <Avatar src={URL.createObjectURL(x.avatar)} alt={x.alt_tag} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            required
                            id={`alt_tag${i}`}
                            name="alt_tag"
                            label="Image Alt Text"
                            value={x.alt_tag}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => handleImageAltChange(e, i)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl component="fieldset">
                            <RadioGroup aria-label="is360" row defaultChecked name="is360" value={x.is360} onChange={(e) => {
                              setOfferImages(offerImages.map((y, ind) => {
                                if (ind === i) {
                                  return { ...y, is360: !y.is360 }
                                } else {
                                  return y
                                }
                              }))
                            }}>
                              <FormControlLabel value={false} control={<Radio />} label="Regular/Slider" />
                              <FormControlLabel value={true} control={<Radio />} label={<span>360<sup>o</sup> View</span>} />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <MaterialButton variant="outlined" color="secondary" onClick={() => setOfferImages([...offerImages.filter((z, index) => index !== i)])}>
                            <DeleteOutlined />
                          </MaterialButton>
                        </Grid>
                      </>
                    ))
                  }
                  {
                    offerImages.length > 0 &&
                    <Grid item xs={12} sm={12}>
                      <MaterialButton variant="contained" size="large" color="primary" style={{ float: 'right' }} onClick={handleMultipleSubmit}>
                        Upload/Update Images
                  </MaterialButton>
                    </Grid>
                  }
                </Grid>
              </form>
            </CardBody>
          </Card>
        }
        {/* MULTIPLE IMAGES UPLOAD SECTION END */}

      </div>
    </div>
  );
}
