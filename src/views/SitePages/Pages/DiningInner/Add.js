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

import MaterialButton from "@material-ui/core/Button";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, CardMedia, CardActionArea, CardContent, CardActions } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from "react-router-dom";
import API from "utils/http";

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


export default function AddDiningInner() {
  const pageId = parseInt(useParams().id);
  const classes = useStyles();
  const [diningInner, setDiningInner] = useState({
    intro: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avatar_alt: '',
      section_slug: 'intro'
    },
    timings: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avatar_alt: '',
      section_slug: 'timings'
    },
    dress: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avatar_alt: '',
      section_slug: 'dress'
    },
  })

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        setDiningInner(
          {
            intro: data.find(x => x.section_slug === "intro") || diningInner.intro,
            dress: data.find(x => x.section_slug === "dress") || diningInner.dress,
            timings: data.find(x => x.section_slug === "timings") || diningInner.timings,
          }
        )
      }
    })
  }, [])
  const handleInputChange = (e, section) => {
    debugger;
    let updatedDiningInner = { ...diningInner };
    updatedDiningInner[section][e.target.name] = e.target.value;
    setDiningInner(updatedDiningInner);
  }

  const handleFileChange = (e, section) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    createImage(files[0], section);
  }

  const createImage = (file, section) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      let updatedDiningInner = { ...diningInner };
      updatedDiningInner[section]["section_avatar"] = e.target.result;
      setDiningInner(updatedDiningInner);
    };
    reader.readAsDataURL(file);
  }

  const handleSubmit = (id, name) => {
    API.put(`/add_section/${id}`, diningInner[name]).then(response => {
      if (response.status === 200) {
        alert("Section updated successfully !");
      }
    }).catch(err => console.log(err))
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add DiningInner Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Intro</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={diningInner.intro.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={diningInner.intro.section_content} onChange={(e) => setDiningInner({ ...diningInner, intro: { ...diningInner.intro, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avatar_alt"
                      name="section_avatar_alt"
                      label="Image Alt Text"
                      value={diningInner.intro.section_avatar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {diningInner.intro.section_avatar && diningInner.intro.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={diningInner.intro.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "intro")}
                            id="section_avatar_intro"
                            name="section_avatar_intro"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_intro" style={{ width: '100%', margin: 0 }}>
                            <Button
                              variant="contained"
                              component="span"
                              className={classes.button}
                              size="large"
                              color="primary"
                              fullWidth
                            >
                              <Image className={classes.extendedIcon} /> Upload Section Image
                        </Button>
                          </label>
                        </Fragment>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(diningInner.intro.id, "intro")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ****************** */}
            {/* SECTION 2 */}
            {/* ****************** */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>Opening Hours</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={diningInner.dress.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "dress")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={diningInner.dress.section_content} onChange={(e) => setDiningInner({ ...diningInner, dress: { ...diningInner.dress, section_content: e.editor.getData() } })} />
                  </Grid>
                  {/* <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avatar_alt"
                      name="section_avatar_alt"
                      label="Image Alt Text"
                      value={diningInner.dress.section_avatar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "dress")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {diningInner.dress.section_avatar && diningInner.dress.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={diningInner.dress.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "dress")}
                            id="section_avatar_dress"
                            name="section_avatar_dress"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_dress" style={{ width: '100%', margin: 0 }}>
                            <Button
                              variant="contained"
                              component="span"
                              className={classes.button}
                              size="large"
                              color="primary"
                              fullWidth
                            >
                              <Image className={classes.extendedIcon} /> Upload Section Image
                            </Button>
                          </label>
                        </Fragment>
                      </CardActions>
                    </Card>
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(diningInner.dress.id, "dress")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ****************** */}
            {/* SECTION 3 */}
            {/* ****************** */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography className={classes.heading}>Dress Code</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={diningInner.timings.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "timings")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={diningInner.timings.section_content} onChange={(e) => setDiningInner({ ...diningInner, timings: { ...diningInner.timings, section_content: e.editor.getData() } })} />
                  </Grid>
                  {/* <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avatar_alt"
                      name="section_avatar_alt"
                      label="Image Alt Text"
                      value={diningInner.timings.section_avatar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "timings")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {diningInner.timings.section_avatar && diningInner.timings.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={diningInner.timings.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "timings")}
                            id="section_avatar_timings"
                            name="section_avatar_timings"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_timings" style={{ width: '100%', margin: 0 }}>
                            <Button
                              variant="contained"
                              component="span"
                              className={classes.button}
                              size="large"
                              color="primary"
                              fullWidth
                            >
                              <Image className={classes.extendedIcon} /> Upload Section Image
                            </Button>
                          </label>
                        </Fragment>
                      </CardActions>
                    </Card>
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(diningInner.timings.id, "timings")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
