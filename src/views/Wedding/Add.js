import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Grid from '@material-ui/core/Grid';
import MaterialButton from '@material-ui/core/Button';

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { TextField, Avatar } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

import { Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams, withRouter } from "react-router-dom";
import { ckEditorConfig } from "utils/data";

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
    post_url: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "1,1",
    img_directory: "wedding"

  }
  const [wedding, setWedding] = useState({ ...initialObject });
  const [weddingImages, setWeddingImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      setPostId(id);
      API.get(`/wedding/${id}/edit`).then(response => {
        if (response.status === 200) {
          setWedding({ ...wedding, ...response?.data?.wedding_details })
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
      setWedding({ ...wedding, thumbnail: e.target.result });
      if (isEdit) {
        API.patch(`update_upload/${post_id}/wedding`, {
          thumbnail: e.target.result
        }).then(response => {
          console.log(response)
        })
      }
    };
    reader.readAsDataURL(file);
  }

  const handleSubmit = () => {
    let finalWedding = wedding;
    finalWedding.is_indexed_or_is_followed = `${finalWedding.is_indexed},${finalWedding.is_followed}`
    if (isEdit) {
      API.put(`/wedding/${id}`, finalWedding).then(response => {
        console.log(response);
        if (response.status === 200) {
          alert("Record Updated");
          // setWedding({ ...initialObject }); //resetting the form
          props.history.push('/admin/weddings');
        }
      }).catch(err => alert("Something went wrong"));
    } else {
      API.post('/wedding', finalWedding).then(response => {
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

  const handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    weddingImages.forEach(x => {
      console.log(x);
      imagesFormData.append("images[]", x.avatar);
      imagesFormData.append("data[]", JSON.stringify(x))
    });

    API.post(`/multiple_upload`, imagesFormData, {
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
          </CardHeader>
          <CardBody>
            <h4 className="mt-1">General Information</h4>
            <Grid container spacing={2} style={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={7} >
                <Grid container spacing={5}>
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
                  <Grid item xs={12} sm={7}>
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
                  <Grid item xs={6} sm={5}>
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
                    {
                      isEdit &&
                      <Avatar src={wedding.thumbnail} alt={wedding.alt_text} className="float-left mr-4" />
                    }
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className="thumbnail-preview-wrapper img-thumbnail">
                  {
                    wedding.thumbnail && wedding.thumbnail !== "" ?
                      <img src={wedding.thumbnail} alt={wedding.alt_text || ""} />
                      :
                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                  }
                </div>
              </Grid>
              <Grid item xs={12} sm={12}>
                <h4>Short Description</h4>
                <CKEditor config={ckEditorConfig} onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} type="classic" data={wedding.short_description} onChange={(e) => setWedding({ ...wedding, short_description: e.editor.getData() })}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <h4>Detailed Content</h4>

                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={wedding.post_content} onChange={(e) => setWedding({ ...wedding, post_content: e.editor.getData() })} />

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
