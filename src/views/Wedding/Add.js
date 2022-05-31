import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Grid from '@material-ui/core/Grid';
import InputLabel from "@material-ui/core/InputLabel";
import MaterialButton from '@material-ui/core/Button';
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

import { Image } from "@material-ui/icons";
import API from "utils/http";
import LangAPI from "langapi/http";
import { useParams, withRouter, useLocation } from "react-router-dom";
import { ckEditorConfig } from "utils/data";
import GalleryDialog from "views/Common/GalleryDialog";

const website_url = "https://fishermanscove-resort.com/";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


export default withRouter(function WeddingAdd(props) {
  const classes = useStyles();
  //check if edit or add request
  let { id } = useParams();
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const lang = query.get('lang');

  const initialObject = {
    name: '',
    short_description: "",
    detailed_content:"",
    slug:"",
    img_directory: "wedding",
    images_list: '',
    thumbnailPreview:"",
    thumbnail:""

  }
  const [wedding, setWedding] = useState({ ...initialObject });
  const [weddingImages, setWeddingImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  const [imagesData, setImagesData] = useState([])
  const [uploadsPreview, setUploadsPreview] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(false)
  const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [selectedLang, setSelectedLang] = useState(lang ||"en");


  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      // setPostId(id);
      // LangAPI.get(`/weddings/${id}/edit`).then(response => {
      LangAPI.get(`/weddings/${id}?lang=${selectedLang}`).then(response => {
        if (response?.data?.status === '200') {
          // console.log(response?.data,"response?.data")
          // return false;
          // let data = { ...response?.data?.wedding_details };
          // data.route = website_url + data.route;
          if(response?.data?.data){
            setWedding(response?.data?.data);
            setThumbnailPreview(response?.data?.data.thumbnailPreview)
          } else {
            setWedding(initialObject);
            setThumbnailPreview(null)
          }
          // setUploadsPreview(response.data?.uploads);
        }
      })
    }

    if(!imagesData.length > 0){
      getGalleryImages();
    }
  }, [selectedLang])

  const getGalleryImages = () => {
    API.get(`/uploads`).then(response => {
      if (response.status === 200) {
        setImagesData(response.data?.map(x => ({ ...x, isChecked: false })))
      }
    })
  }

  const handleInputChange = (e) => {
    let updatedWedding = { ...wedding };
    updatedWedding[e.target.name] = e.target.value;
    setWedding(updatedWedding);
  }


  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
        if (isSingle) {
          setWedding({ ...wedding, thumbnail: imagesData[index].avatar })
          setThumbnailPreview(imagesData[index].avatar)
          setSelectedImages(imagesData[index]);
          setTimeout(() => {
            setShowGallery(false);
        }, 500);
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
    } else {
      if (isSingle) {
        setWedding({ ...wedding, thumbnail: "" })
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
    let finalWedding = wedding;
    finalWedding.route = "wedding";
    finalWedding.images_list = JSON.stringify(selectedImages);
    finalWedding.thumbnailPreview = thumbnailPreview;
    // finalWedding.is_indexed_or_is_followed = `${finalWedding.is_indexed},${finalWedding.is_followed}`;
    if(!finalWedding.name || finalWedding.name == ""){
      alert("Please Enter Name before Submiting")
      return false;
    }
    if(!finalWedding.slug || finalWedding.slug == ""){
      alert("Please Enter Slug before Submiting")
      return false;
    }
    if(!finalWedding.thumbnailPreview || finalWedding.thumbnailPreview == ""){
      alert("Please Select Image before Submiting")
      return false;
    }
    if(!finalWedding.short_description || finalWedding.short_description == ""){
      alert("Please Enter Short Description before Submiting")
      return false;
    }
    
    if (isEdit) {
      LangAPI.post(`/weddings?lang=${selectedLang}`, finalWedding).then(response => {
        console.log(response);
        if (response.status === 200) {
          alert("Record Updated");
          // setWedding({ ...initialObject }); //resetting the form
          props.history.push('/admin/weddings');
        }
      }).catch(err => alert("Something went wrong"));
    } else {
      LangAPI.post(`/weddings?lang=${selectedLang}`, finalWedding).then(response => {
        console.log(response);
        if (response.status === 200) {
          alert("Record Updated");
          setPostId(response.data?.post_id);
          // setWedding({ ...initialObject });
          props.history.push('/admin/weddings');
        }
      }).catch(err => alert("Something went wrong."))
    }
  }

  const handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != selectedLang) {
        setSelectedLang(event.target.value)
    }
};


  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary" className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Add Wedding Place</h4>
            <FormControl
                variant="outlined"
                size="small"
                style={{ width: "20%", color: "white" }}
            // fullWidth
            >
                <InputLabel id="language"
                    style={{ color: "white" }}
                >Select Language</InputLabel>
                <Select
                    labelId="language"
                    id="language"
                    name="language"
                    value={selectedLang}
                    label="Select Language"
                    fullWidth
                    style={{ color: "white" }}
                    onChange={handleChange}
                >
                    <MenuItem value={'en'}>En</MenuItem>
                    <MenuItem value={'fr'}>FR</MenuItem>
                    <MenuItem value={'de'}>DE</MenuItem>

                </Select>
            </FormControl>
          </CardHeader>
          <CardBody>
            <h4 className="mt-1">General Information</h4>
            <Grid container spacing={2} style={{ display: 'flex' }}>
              <Grid item xs={12} sm={7} >
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="name"
                      name="name"
                      label="Name"
                      value={wedding?.name}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="slug"
                      name="slug"
                      label="Slug"
                      value={wedding?.slug}
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
                        <img src={thumbnailPreview} alt={wedding?.alt_text || ""} />
                        :
                        <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                      :
                      typeof (wedding?.thumbnail) === typeof (0) ?
                        <img src={thumbnailPreview} alt={wedding?.alt_text || ""} />
                        :
                        <img src={wedding?.thumbnail} alt={wedding?.alt_text || ""} />
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
                <CKEditor config={ckEditorConfig} onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={wedding?.short_description} onChange={(e) => setWedding({ ...wedding, short_description: e.editor.getData() })}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <hr />
                <h4>Detailed Content</h4>

                <CKEditor config={ckEditorConfig} onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={wedding?.detailed_content} type="classic"  onChange={(e) => setWedding({ ...wedding, detailed_content: e.editor.getData() })} />

              </Grid>
              <Grid item xs={12} sm={12}>
                <MaterialButton onClick={handleSubmit} style={{ float: 'right' }} variant="contained" color="primary" size="large">
                  Submit
                </MaterialButton>
              </Grid>
            </Grid>
            <GalleryDialog isSingle={isSingle} open={showGallery} handleImageSelect={handleImageSelect} handleClose={() => {
              setShowGallery(false);
              setRenderPreviews(true);
            }} refreshGallery={getGalleryImages} data={imagesData} />
          </CardBody>
        </Card>

        {/* MULTIPLE IMAGES UPLOAD SECTION START */}
        {/* <Card>
          <CardBody>
            <form type="post" encType="multipart/form-data">

              <h3>Wedding Images</h3>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  {weddingImages.length < 1 &&

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
                  weddingImages?.map((x, i) => (
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
                            setWeddingImages(weddingImages.map((y, ind) => {
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
                        <MaterialButton variant="outlined" color="secondary" onClick={() => setWeddingImages([...weddingImages.filter((z, index) => index !== i)])}>
                          <DeleteOutlined />
                        </MaterialButton>
                      </Grid>
                    </>
                  ))
                }
                {
                  weddingImages.length > 0 &&
                  <Grid item xs={12} sm={12}>
                    <MaterialButton variant="contained" size="large" color="primary" style={{ float: 'right' }} onClick={handleMultipleSubmit}>
                      Upload/Update Images
                  </MaterialButton>
                  </Grid>
                }
              </Grid>
            </form>
          </CardBody>
        </Card> */}
        {/* MULTIPLE IMAGES UPLOAD SECTION END */}
      </div>
    </div>
  );
}
)
