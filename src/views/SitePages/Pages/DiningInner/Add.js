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
import FAQSection from "../Common/FAQSection";
import GalleryDialog from "views/Common/GalleryDialog";

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
      section_avtar_alt: '',
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
      section_avtar_alt: '',
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
      section_avtar_alt: '',
      section_slug: 'dress'
    },
    faq: {
      id: 0,
      section_name: '',
      section_content: [],
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'faq'
    },
  })

  const [currentSection, setCurrentSection] = useState("")

  const [imagesData, setImagesData] = useState([])
  // const [uploadsPreview, setUploadsPreview] = useState(null)
  // const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(false)
  // const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;

        let intro = data.find(x => x.section_slug === "intro");
        let dress = data.find(x => x.section_slug === "dress");
        let timings = data.find(x => x.section_slug === "timings");
        let faq = data.find(x => x.section_slug === "faq");
        if (faq && faq.section_content) {
          faq.section_content = JSON.parse(faq.section_content);
        }
        setDiningInner(
          {
            intro: intro || diningInner.intro,
            dress: dress || diningInner.dress,
            timings: timings || diningInner.timings,
            faq: faq || diningInner.faq,
          }
        )
      }
    });
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

  const handleInputChange = (e, section) => {

    let updatedDiningInner = { ...diningInner };
    updatedDiningInner[section][e.target.name] = e.target.value;
    setDiningInner(updatedDiningInner);
  }

  const handleImageSelect = (e, index, section) => {
    debugger;
    if (e.target.checked) {
      if (isSingle && thumbnailPreview !== "") {
        alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
        return;
      } else {
        setDiningInner({ ...diningInner, [section]: { ...diningInner[section], section_avatar: imagesData[index].id } })
        setThumbnailPreview(imagesData[index].avatar)

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
      setDiningInner({ ...diningInner, [section]: { ...diningInner[section], section_avatar: "" } })
      setThumbnailPreview("")

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

  //faq section methods
  const removeQuestion = (id) => {
    setDiningInner({ ...diningInner, faq: { ...diningInner.faq, section_content: diningInner.faq.section_content.filter(x => x.id !== id) } })
  }

  const handleQuestionChange = (e, section, index) => {
    let section_content = [...diningInner.faq.section_content];
    section_content[index].question = e.target.value;
    setDiningInner({ ...diningInner, faq: { ...diningInner.faq, section_content } })
  }
  const handleAnswerChange = (data, section, index) => {
    let section_content = [...diningInner.faq.section_content];
    section_content[index].answer = data;
    setDiningInner({ ...diningInner, faq: { ...diningInner.faq, section_content } })
  }
  //end faq section methods

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
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={diningInner.intro.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !diningInner.intro.id > 0 ?
                              thumbnailPreview && thumbnailPreview !== "" ?
                                <img src={thumbnailPreview} alt={diningInner.intro.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (diningInner.intro.section_avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview} alt={diningInner.intro.section_avtar_alt || ""} />
                                :
                                <img src={diningInner.intro.section_avatar} alt={diningInner.intro.section_avtar_alt || ""} />
                          }
                        </div>
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <MaterialButton
                            variant="contained"
                            color="primary"
                            startIcon={<Image />}
                            className="mt-1"
                            fullWidth
                            onClick={() => {
                              setIsSingle(true);
                              setCurrentSection("intro");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
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
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={diningInner.dress.section_avtar_alt}
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
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={diningInner.timings.section_avtar_alt}
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
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>F.A.Q's</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MaterialButton
                      variant="outlined"
                      component="span"
                      className={classes.button}
                      size="small"
                      color="primary"
                      onClick={() => setDiningInner({ ...diningInner, faq: { ...diningInner.faq, section_content: [...diningInner.faq.section_content, { id: diningInner.faq.section_content?.length + 1, question: '', answer: '' }] } })}
                    >
                      Add a New Link
                    </MaterialButton>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    {/*FAQ ITEM*/}
                    <FAQSection
                      removeQuestion={removeQuestion}
                      section_content={diningInner.faq.section_content}
                      handleQuestionChange={handleQuestionChange}
                      handleAnswerChange={handleAnswerChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(diningInner.faq.id, "faq")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
      </div>
      {/* GALLERY DIALOG BOX START */}
      <GalleryDialog isSingle={isSingle} section={currentSection} open={showGallery} handleImageSelect={handleImageSelect} handleClose={() => {
        setShowGallery(false);
      }} refreshGallery={getGalleryImages} data={imagesData} />
      {/* GALLERY DIALOG BOX END */}
    </div>
  );
}
