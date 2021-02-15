import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

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

import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams, withRouter } from "react-router-dom";
import { ckEditorConfig } from "utils/data";
import axios from "axios";

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


export default withRouter(function WeddingAdd(props) {
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
    category_id: -1,
    meta_description: '',
    schema_markup: '',
    permalink: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: 1
  }
  const [wedding, setWedding] = useState({ ...initialObject });
  const [weddingImages, setWeddingImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      API.get(`/wedding/${id}/edit`).then(response => {
        if (response.status === 200) {
          setWedding({ ...wedding, ...response?.data?.category_details[0] })
        }
      })
    }
  }, [])

  const handleInputChange = (e) => {
    let updatedWedding = { ...wedding };
    updatedWedding[e.target.name] = e.target.value;
    setWedding(updatedWedding);
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
      setWedding({ ...wedding, thumbnail: e.target.result })
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
    setWeddingImages([...weddingImages, ...imagesObject])
  }

  const handleImageAltChange = (e, index) => {
    let updatedWeddingImages = [...weddingImages];
    updatedWeddingImages[index].alt_tag = e.target.value;
    setWeddingImages(updatedWeddingImages)
  }

  const handleSubmit = () => {
    if (isEdit) {
      API.put(`/wedding/${id}`, wedding).then(response => {
        console.log(response);
        if (response.status === 200) {
          alert("Record Updated");
          setWedding({ ...initialObject }); //resetting the form
          props.history.push('/admin/weddings');
        }
      }).catch(err => alert("Something went wrong"));
    } else {
      API.post('/wedding', wedding).then(response => {
        console.log(response);
        if (response.status === 200) {
          alert("Record Updated");
          setPostId(response.data?.post_id);
          setWedding({ ...initialObject });
        }
      }).catch(err => alert("Something went wrong."))
    }
  }

  const handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    weddingImages.forEach(x => {
      console.log(x);
      imagesFormData.append("images[]", x.avatar);
      imagesFormData.append("data[]", JSON.stringify(x))
    });

    axios.post(`https://fishermanscove-resort.com/fmcr/public/api/multiple_upload`, imagesFormData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
      },
      onUploadProgress: (progressEvent) => {
        console.log('progress', Math.round((progressEvent.loaded * 100) / progressEvent.total))
      }
    }).then(response => {
      if (response.status === 200) {
        alert("Files Uploaded");
        setWeddingImages([]);
        props.history.push('/admin/weddings');
      }
    }).catch(err => alert("Something went wrong"));

  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add Wedding Place</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <h4 className="mt-1">General Information</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="post_name"
                  name="post_name"
                  label="Name"
                  value={wedding.post_name}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="alt_text"
                  name="alt_text"
                  label="Image Alt Text"
                  value={wedding.alt_text}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Fragment>
                  <input
                    color="primary"
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                    size="small"
                    id="thumbnail"
                    name="thumbnail"
                    style={{ display: 'none', }}
                  />
                  <label htmlFor="thumbnail">
                    <Button
                      variant="contained"
                      component="span"
                      className={classes.button}
                      size="large"
                      color="primary"
                      style={{ margin: 0, height: '100%', }}
                    >
                      <Image className={classes.extendedIcon} /> Upload Featured Image
                    </Button>
                  </label>
                </Fragment>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined"
                  size="small" fullWidth className={classes.formControl}>
                  <InputLabel id="room_type-label">Type</InputLabel>
                  <Select
                    labelId="room_type-label"
                    id="room_type"
                    name="room_type"
                    value={wedding.room_type}
                    onChange={handleInputChange}
                    label="Type"
                    fullWidth
                  >
                    <MenuItem value={-1}>
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Wedding</MenuItem>
                    <MenuItem value={2}>Suite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined"
                  size="small" fullWidth className={classes.formControl}>
                  <InputLabel id="category_id-label">Category</InputLabel>
                  <Select
                    labelId="category_id-label"
                    id="category_id"
                    name="category_id"
                    value={wedding.category_id}
                    onChange={handleInputChange}
                    label="Category"
                    fullWidth
                  >
                    <MenuItem value={-1}>
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Family</MenuItem>
                    <MenuItem value={2}>Deluxe</MenuItem>
                    <MenuItem value={3}>Partial Ocean View</MenuItem>
                    <MenuItem value={4}>Full Ocean View</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <p>Short Description</p>
                <CKEditor config={ckEditorConfig} onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} type="classic" data={wedding.short_description} onChange={(e) => setWedding({ ...wedding, short_description: e.editor.getData() })}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <p>Detailed Content</p>

                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={wedding.post_content} onChange={(e) => setWedding({ ...wedding, post_content: e.editor.getData() })} />

              </Grid>
            </Grid>
            <h4 className="mt-2">SEO Information</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="meta_title"
                  name="meta_title"
                  label="Meta Title"
                  value={wedding.meta_title}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="permalink"
                  name="permalink"
                  label="Permalink"
                  value={wedding.permalink}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="meta_description"
                  name="meta_description"
                  label="Meta Description"
                  value={wedding.meta_description}
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
                  value={wedding.schema_markup}
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
                  <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={wedding.is_followed} onChange={(e) => {
                    setWedding({ ...wedding, is_followed: !wedding.is_followed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Follow" />
                    <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={wedding.is_indexed} onChange={(e) => {
                    setWedding({ ...wedding, is_indexed: !wedding.is_indexed })
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
        <Card>
          <CardBody>
            <form type="post" encType="multipart/form-data">

              <h3>Wedding Images</h3>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Fragment>
                    <input
                      color="primary"
                      accept="image/*"
                      type="file"
                      multiple
                      onChange={handleMultipleFileChange}
                      id="thumbnailMultiple"
                      name="thumbnailMultiple"
                      style={{ display: 'none', }}
                    />
                    <label htmlFor="thumbnailMultiple">
                      <Button
                        variant="contained"
                        component="span"
                        className={classes.button}
                        size="large"
                        color="primary"
                        style={{ margin: 0, height: '100%', }}
                      >
                        <Image className={classes.extendedIcon} /> Select Multiple Images
                    </Button>
                    </label>
                  </Fragment>
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
        </Card>
        {/* MULTIPLE IMAGES UPLOAD SECTION END */}
      </div>
    </div>
  );
}
)
