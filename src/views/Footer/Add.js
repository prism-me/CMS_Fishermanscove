import React, { Fragment, Suspense, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';

import Button from "components/CustomButtons/Button.js";
import MaterialButton from '@material-ui/core/Button';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, Radio, RadioGroup, FormControlLabel, Collapse } from "@material-ui/core";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import { Link } from "react-router-dom";
import FooterPreview from "./Preview";

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

export default function UpdateFooter() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [dining, setDining] = useState({
    post_name: '',
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    room_type: -1,
    category_id: -1,
    thumbnail: '',
    alt_text: '',
    meta_title: '',
    meta_description: '',
    schema_markup: '',
    permalink: '',
    is_followed: true,
    is_indexed: true
  })

  const [footerContent, setFooterContent] = useState({
    first: {
      description: ''
    },
    second: {
      links: [{
        text: 'About Us',
        address: '/about us'
      }]
    },
    third: {
      phone: '',
      email: '',
      address: ''
    },
    social: {
      facebook: '',
      twitter: '',
      instagram: ''
    }
  })


  const handleInputChange = (e) => {
    let updatedDining = { ...dining };
    updatedDining[e.target.name] = e.target.value;
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
      setDining({ ...dining, thumbnail: e.target.result })
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Update Site Footer</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          {/* <h5 className="pl-4 mt-3 mb-0" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>Show/Hide Preview</h5> */}

          <MaterialButton
            variant="outlined"
            component="span"
            className="m-3"
            size="small"
            color="primary"
            style={{ width: '150px' }}
            onClick={() => setOpen(!open)}
          >
            Show/Hide Preview
          </MaterialButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <FooterPreview />
          </Collapse>
          <CardBody className="pt-0">
            <h3>First Column (About)</h3>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="post_name"
                  name="post_name"
                  label="About Description"
                  value={dining.post_name}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  rowsMax={4}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <h3>Second Column (Services)</h3>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MaterialButton
                  variant="outlined"
                  component="span"
                  className={classes.button}
                  size="small"
                  color="primary"
                  onClick={() => setFooterContent({ ...footerContent, second: { ...footerContent.second, links: [...footerContent.second.links, { text: '', address: '' }] } })}
                >
                  Add Link
                </MaterialButton>
              </Grid>
              {
                footerContent?.second?.links?.map(x => (
                  <React.Fragment>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="post_name"
                        name="post_name"
                        label="Link Text"
                        value={x.text}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="post_name"
                        name="post_name"
                        label="Link Address"
                        value={x.address}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </React.Fragment>
                ))
              }
            </Grid>
            <h3>SEO Information</h3>
            <Grid container spacing={3}>
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="meta_description"
                  name="meta_description"
                  label="Meta Description"
                  value={dining.meta_description}
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
                  value={dining.schema_markup}
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
                  value={dining.permalink}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
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
        <Card>
          <CardBody>
            <h3>Dining Images</h3>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="alt_text"
                  name="alt_text"
                  label="Image Alt Text"
                  value={dining.alt_text}
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
