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


export default function AddSustainability() {
  const pageId = parseInt(useParams().id);
  const classes = useStyles();
  const [sustainability, setSustainability] = useState({
    intro: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'intro'
    },
    pillars: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'pillars'
    },
    projects: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'projects'
    },
    energy: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'energy'
    },
  })

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        setSustainability(
          {
            intro: data.find(x => x.section_slug === "intro") || sustainability.intro,
            projects: data.find(x => x.section_slug === "projects") || sustainability.projects,
            pillars: data.find(x => x.section_slug === "pillars") || sustainability.pillars,
            energy: data.find(x => x.section_slug === "energy") || sustainability.energy,
          }
        )
      }
    })
  }, [])
  const handleInputChange = (e, section) => {
    debugger;
    let updatedSustainability = { ...sustainability };
    updatedSustainability[section][e.target.name] = e.target.value;
    setSustainability(updatedSustainability);
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
      let updatedSustainability = { ...sustainability };
      updatedSustainability[section]["section_avatar"] = e.target.result;
      setSustainability(updatedSustainability);
    };
    reader.readAsDataURL(file);
  }

  const handleSubmit = (id, name) => {
    API.put(`/add_section/${id}`, sustainability[name]).then(response => {
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
            <h4 className="mb-0">Add Sustainability Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Intro Section</Typography>
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
                      value={sustainability.intro.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.intro.section_content} onChange={(e) => setSustainability({ ...sustainability, intro: { ...sustainability.intro, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.intro.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {sustainability.intro.section_avatar && sustainability.intro.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={sustainability.intro.section_avatar}
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
                    <MaterialButton onClick={() => handleSubmit(sustainability.intro.id, "intro")} size="large" color="primary" variant="contained">
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
                <Typography className={classes.heading}>Projects Section</Typography>
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
                      value={sustainability.projects.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "projects")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.projects.section_content} onChange={(e) => setSustainability({ ...sustainability, projects: { ...sustainability.projects, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.projects.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "projects")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {sustainability.projects.section_avatar && sustainability.projects.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={sustainability.projects.section_avatar}
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
                            onChange={(e) => handleFileChange(e, "projects")}
                            id="section_avatar_projects"
                            name="section_avatar_projects"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_projects" style={{ width: '100%', margin: 0 }}>
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
                    <MaterialButton onClick={() => handleSubmit(sustainability.projects.id, "projects")} size="large" color="primary" variant="contained">
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
                <Typography className={classes.heading}>Pillars Section</Typography>
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
                      value={sustainability.pillars.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "pillars")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.pillars.section_content} onChange={(e) => setSustainability({ ...sustainability, pillars: { ...sustainability.pillars, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.pillars.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "pillars")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {sustainability.pillars.section_avatar && sustainability.pillars.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={sustainability.pillars.section_avatar}
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
                            onChange={(e) => handleFileChange(e, "pillars")}
                            id="section_avatar_pillars"
                            name="section_avatar_pillars"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_pillars" style={{ width: '100%', margin: 0 }}>
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
                    <MaterialButton onClick={() => handleSubmit(sustainability.pillars.id, "pillars")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ****************** */}
            {/* SECTION 4 */}
            {/* ****************** */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4a-content"
                id="panel4a-header"
              >
                <Typography className={classes.heading}>Energy Conversation Section</Typography>
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
                      value={sustainability.energy.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "energy")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.energy.section_content} onChange={(e) => setSustainability({ ...sustainability, energy: { ...sustainability.energy, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.energy.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "energy")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {sustainability.energy.section_avatar && sustainability.energy.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={sustainability.energy.section_avatar}
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
                            onChange={(e) => handleFileChange(e, "energy")}
                            id="section_avatar_energy"
                            name="section_avatar_energy"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_energy" style={{ width: '100%', margin: 0 }}>
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
                    <MaterialButton onClick={() => handleSubmit(sustainability.energy.id, "energy")} size="large" color="primary" variant="contained">
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