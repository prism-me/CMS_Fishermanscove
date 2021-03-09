import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Grid from '@material-ui/core/Grid';

import MaterialButton from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from "react-router-dom";
import API from "utils/http";
import FAQSection from "../Common/FAQSection";
import { Image } from "@material-ui/icons";
import GalleryDialog from "views/Common/GalleryDialog";

const website_url = "https://fishermanscove-resort.com/";

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


export default function AddWedding() {
  const pageId = parseInt(useParams().id);
  const classes = useStyles();
  const [wedding, setWedding] = useState({
    banner: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'banner'
    },
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
  });

  const [seoInfo, setSeoInfo] = useState({
    id: 0,
    post_id: pageId || 0,
    meta_title: '',
    meta_description: '',
    route: website_url,
    schema_markup: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: '1,1',
  })


  const [currentSection, setCurrentSection] = useState("")

  const [imagesData, setImagesData] = useState([])
  // const [uploadsPreview, setUploadsPreview] = useState(null)
  // const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(true)
  // const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        const banner = data.find(x => x.section_slug === "banner")
        const intro = data.find(x => x.section_slug === "intro")
        const faq = data.find(x => x.section_slug === "faq")
        if (faq && faq.section_content) {
          faq.section_content = JSON.parse(faq.section_content);
        }
        setWedding(
          {
            intro: intro || wedding.intro,
            faq: faq || wedding.faq,
            banner: banner || wedding.banner
          }
        )
      }
    });
    getGalleryImages();
    getSEOInfo();
  }, [])


  const getGalleryImages = () => {
    API.get(`/uploads`).then(response => {
      if (response.status === 200) {
        setImagesData(response.data?.map(x => ({ ...x, isChecked: false })))
      }
    })
  }
  const getSEOInfo = () => {
    API.get(`/meta/${pageId}`).then(response => {
      if (response.status === 200) {
        let seoInfoData = response.data;
        if (seoInfoData) {
          // seoInfoData.is_indexed = JSON.parse(seoInfoData.is_indexed)
          // seoInfoData.is_followed = JSON.parse(seoInfoData.is_followed)
          setSeoInfo({ ...seoInfo, ...seoInfoData });
        }
        else {
          seoInfoData(seoInfoData)
        }
      }
    })
  }

  const handleInputChange = (e, section) => {
    let updatedWedding = { ...wedding };
    updatedWedding[section][e.target.name] = e.target.value;
    setWedding(updatedWedding);
  }

  const handleSEOInputChange = (e) => {
    let updatedSeoInfo = { ...seoInfo };
    updatedSeoInfo[e.target.name] = e.target.value;
    setSeoInfo(updatedSeoInfo);
  }


  const handleImageSelect = (e, index, section) => {
    if (e.target.checked) {
      if (isSingle && thumbnailPreview !== "") {
        alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
        return;
      } else {
        setWedding({ ...wedding, [section]: { ...wedding[section], section_avatar: imagesData[index].id } })
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
      setWedding({ ...wedding, [section]: { ...wedding[section], section_avatar: "" } })
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


  const handleRouteChange = (e) => {
    let updatedSeoInfo = { ...seoInfo };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
    updatedValue = updatedValue.replace(/--/g, '-')
    updatedSeoInfo[e.target.name] = website_url + updatedValue;
    setSeoInfo(updatedSeoInfo);
  }

  //faq section methods
  const removeQuestion = (id) => {
    setWedding({ ...wedding, faq: { ...wedding.faq, section_content: wedding.faq.section_content.filter(x => x.id !== id) } })
  }

  const handleQuestionChange = (e, section, index) => {
    let section_content = [...wedding.faq.section_content];
    section_content[index].question = e.target.value;
    setWedding({ ...wedding, faq: { ...wedding.faq, section_content } })
  }
  const handleAnswerChange = (data, section, index) => {
    let section_content = [...wedding.faq.section_content];
    section_content[index].answer = data;
    setWedding({ ...wedding, faq: { ...wedding.faq, section_content } })
  }
  //end faq section methods

  const handleSEOSubmit = () => {
    let updatedSeoInfo = seoInfo;
    updatedSeoInfo.route = updatedSeoInfo.route.split(website_url)?.[1];

    updatedSeoInfo.is_indexed_or_is_followed = `${updatedSeoInfo.is_indexed},${updatedSeoInfo.is_followed}`;

    if (updatedSeoInfo.id > 0) {
      API.put(`/meta/${pageId}`, updatedSeoInfo).then(response => {
        if (response.status === 200) {
          alert("Section updated successfully !");
        }
      }).catch(err => console.log(err))
    } else {
      API.post(`/meta`, updatedSeoInfo).then(response => {
        if (response.status === 200) {
          alert("Section updated successfully !");
        }
      }).catch(err => console.log(err))

    }
  }

  const handleSubmit = (id, name) => {
    API.put(`/add_section/${id}`, wedding[name]).then(response => {
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
            <h4 className="mb-0">Add Wedding Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            {/* ******************* */}
            {/* SECTION BANNER */}
            {/* ******************* */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panelaa-content"
                id="panelaa-header"
              >
                <Typography className={classes.heading}>Banner</Typography>
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
                      value={wedding.banner.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "banner")}
                      size="medium"
                      style={{ marginBottom: '1rem' }}
                    />

                    <div className="thumbnail-preview-wrapper-large img-thumbnail">
                      {
                        !wedding.banner.id > 0 ?
                          thumbnailPreview && thumbnailPreview !== "" ?
                            <img src={thumbnailPreview} alt={wedding.banner.section_avtar_alt || ""} />
                            :
                            <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                          :
                          typeof (wedding.banner.section_avatar) === typeof (0) ?
                            // dining.thumbnail && dining.thumbnail !== "" ?
                            <img src={thumbnailPreview} alt={wedding.banner.section_avtar_alt || ""} />
                            :
                            <img src={wedding.banner.section_avatar} alt={wedding.banner.section_avtar_alt || ""} />
                      }
                    </div>
                    <Fragment>
                      <MaterialButton
                        variant="outlined"
                        color="primary"
                        startIcon={<Image />}
                        className="mt-1"
                        fullWidth
                        size="large"
                        onClick={() => {
                          setIsSingle(true);
                          setCurrentSection("banner");
                          setShowGallery(true);
                        }}
                      >
                        Upload Featured Image
                          </MaterialButton>
                    </Fragment>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(wedding.banner.id, "banner")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ******************* */}
            {/* SECTION 1 */}
            {/* ******************* */}
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
                  <Grid item xs={12} sm={12}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={wedding.intro.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={wedding.intro.section_content} onChange={(e) => setWedding({ ...wedding, intro: { ...wedding.intro, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(wedding.intro.id, "intro")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ******************* */}
            {/* SECTION 2 */}
            {/* ******************* */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>SEO Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="meta_title"
                      name="meta_title"
                      label="Meta Title"
                      value={seoInfo.meta_title}
                      variant="outlined"
                      fullWidth
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="route"
                      name="route"
                      label="Permalink"
                      value={seoInfo.route}
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
                      value={seoInfo.meta_description}
                      variant="outlined"
                      fullWidth
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="schema_markup"
                      name="schema_markup"
                      label="Schema Markup"
                      value={seoInfo.schema_markup}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      rowsMax={4}
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={seoInfo.is_followed} onChange={(e) => {
                        setSeoInfo({ ...seoInfo, is_followed: !seoInfo.is_followed })
                      }}>
                        <FormControlLabel value={true} control={<Radio />} label="Follow" />
                        <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={seoInfo.is_indexed} onChange={(e) => {
                        setSeoInfo({ ...seoInfo, is_indexed: !seoInfo.is_indexed })
                      }}>
                        <FormControlLabel value={true} control={<Radio />} label="Index" />
                        <FormControlLabel value={false} control={<Radio />} label="No Index" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={handleSEOSubmit} variant="contained" color="primary" size="large">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ******************* */}
            {/* SECTION 3 */}
            {/* ******************* */}
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
                      onClick={() => setWedding({ ...wedding, faq: { ...wedding.faq, section_content: [...wedding.faq.section_content, { id: wedding.faq.section_content?.length + 1, question: '', answer: '' }] } })}
                    >
                      Add a New Link
                    </MaterialButton>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    {/*FAQ ITEM*/}
                    <FAQSection
                      removeQuestion={removeQuestion}
                      section_content={wedding.faq.section_content}
                      handleQuestionChange={handleQuestionChange}
                      handleAnswerChange={handleAnswerChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(wedding.faq.id, "faq")} size="large" color="primary" variant="contained">
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
        // setRenderPreviews(true);
      }} refreshGallery={getGalleryImages} data={imagesData} />
      {/* GALLERY DIALOG BOX END */}
    </div>
  );
}
