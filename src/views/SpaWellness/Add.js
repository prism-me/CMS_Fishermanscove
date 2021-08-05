import React, { Fragment, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, RadioGroup, Radio, FormControlLabel } from "@material-ui/core";
import { ckEditorConfig } from "utils/data";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";

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


export default function SpaWellnessAdd() {
  const classes = useStyles();
  const [spaWellness, setSpaWellness] = useState({
    post_name: '',
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    category_id: -1,
    thumbnail:'',
    alt_text: '',
    meta_title: '',
    meta_description: '',
    schema_markup: '',
    permalink: '',
    is_followed: true,
    is_indexed: true
  })

  const handleInputChange = (e) => {
    let updatedSpaWellness = { ...spaWellness };
    updatedSpaWellness[e.target.name] = e.target.value;
    setSpaWellness(updatedSpaWellness);
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
      setSpaWellness({ ...spaWellness, thumbnail: e.target.result })
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add SpaWellness Activity</h4>
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
                  value={spaWellness.post_name}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="alt_text"
                  name="alt_text"
                  label="Image Alt Text"
                  value={spaWellness.alt_text}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Fragment>
                  <input
                    color="primary"
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
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
                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                  <InputLabel id="room_type-label">Type</InputLabel>
                  <Select
                    labelId="room_type-label"
                    id="room_type"
                    name="room_type"
                    value={spaWellness.room_type}
                    onChange={handleInputChange}
                    label="Type"
                    fullWidth
                  >
                    <MenuItem value={-1}>
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>SpaWellness</MenuItem>
                    <MenuItem value={2}>Suite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                  <InputLabel id="category_id-label">Category</InputLabel>
                  <Select
                    labelId="category_id-label"
                    id="category_id"
                    name="category_id"
                    value={spaWellness.category_id}
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
                <CKEditor
                    config={ckEditorConfig}
                  editor={ClassicEditor}
                  data={spaWellness.short_description}
                  // config={{
                  //   toolbar: ['bold', 'italic']
                  // }}
                  onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                    editor.editing.view.change(writer => {
                      writer.setStyle(
                        "height",
                        "150px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setSpaWellness({ ...spaWellness, short_description: data })
                  }}
                  onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <p>Detailed Content</p>
                <CKEditor
                    config={ckEditorConfig}
                  editor={ClassicEditor}
                  data={spaWellness.post_content}
                  // config={{
                  //   toolbar: ['bold', 'italic']
                  // }}
                  onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                    editor.editing.view.change(writer => {
                      writer.setStyle(
                        "height",
                        "150px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setSpaWellness({ ...spaWellness, post_content: data })
                  }}
                  onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                  }}
                />
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
                  value={spaWellness.meta_title}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="meta_description"
                  name="meta_description"
                  label="Meta Description"
                  value={spaWellness.meta_description}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="schema_markup"
                  name="schema_markup"
                  label="Schema Markup"
                  value={spaWellness.schema_markup}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="permalink"
                  name="permalink"
                  label="Permalink"
                  value={spaWellness.permalink}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={spaWellness.is_followed} onChange={(e) => {
                    setSpaWellness({ ...spaWellness, is_followed: !spaWellness.is_followed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Follow" />
                    <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={spaWellness.is_indexed} onChange={(e) => {
                    setSpaWellness({ ...spaWellness, is_indexed: !spaWellness.is_indexed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Index" />
                    <FormControlLabel value={false} control={<Radio />} label="No Index" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3>SpaWellness Images</h3>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="alt_text"
                  name="alt_text"
                  label="Image Alt Text"
                  value={spaWellness.alt_text}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Fragment>
                  <input
                    color="primary"
                    accept="image/*"
                    type="file"
                    onChange={handleInputChange}
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
                      <Image className={classes.extendedIcon} /> Upload Multiple Image
                    </Button>
                  </label>
                </Fragment>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
