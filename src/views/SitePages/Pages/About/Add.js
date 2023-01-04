import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MaterialButton from "@material-ui/core/Button";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import LangAPI from "langapi/http";
import avatar from "assets/img/faces/marc.jpg";
import {
  FormControl,
  FormControlLabel,
  Radio,
  MenuItem,
  RadioGroup,
  Select,
  TextField,
  CardMedia,
  CardActionArea,
  CardContent,
  CardActions,
} from "@material-ui/core";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "utils/data";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useParams } from "react-router-dom";
import API from "utils/http";
import GalleryDialog from "views/Common/GalleryDialog";

// const website_url = "https://fishermanscove-resort.com/";
// const website_url = "/";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // width:'60%',
    // margin:'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function AddAboutUs() {
  const pageId = useParams().id;
  const classes = useStyles();
  const [about, setAbout] = useState({
    banner: {
      id: 0,
      section_name: "",
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: "",
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: "",
      section_slug: "banner",
    },
    intro: {
      id: 0,
      section_name: "",
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: "",
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: "",
      section_slug: "intro",
    },
    dine: {
      id: 0,
      section_name: "",
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: "",
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: "",
      section_slug: "dine",
    },
  });

  const [seoInfo, setSeoInfo] = useState({
    id: 0,
    post_id: pageId || 0,
    meta_title: "",
    meta_description: "",
    // route: website_url,
    schema_markup: "",
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "1,1",
  });

  const [currentSection, setCurrentSection] = useState("");

  const [imagesData, setImagesData] = useState([]);
  // const [uploadsPreview, setUploadsPreview] = useState(null)
  // const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false);
  const [isSingle, setIsSingle] = useState(true);
  // const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    // API.get(`/all_sections/${pageId}`).then(response => {
    LangAPI.get(`/all-sections/${pageId}/${selectedLang}`).then((response) => {
      if (response?.status === 200) {
        // const { data } = response;
        // setAbout(
        //   {
        //     intro: data.find(x => x.section_slug === "intro") || about.intro,
        //     dine: data.find(x => x.section_slug === "dine") || about.dine,
        //     banner: data.find(x => x.section_slug === "banner") || about.banner,
        //   }
        // )
        if (response.data.data[0]) {
          setAbout(response.data.data[0]);
          // setThumbnailPreview(response?.data?.data[0]?.banner?.section_avatar?.url || "")
          setSeoInfo(response?.data?.data[0]?.meta);
        } else {
          setAbout({
            banner: {
              id: 0,
              section_name: "",
              section_content: "<p>Detailed content goes here!</p>",
              page_id: pageId,
              section_avatar: "",
              section_col_arr: 0,
              section_prior: 1,
              section_avtar_alt: "",
              section_slug: "banner",
            },
            intro: {
              id: 0,
              section_name: "",
              section_content: "<p>Detailed content goes here!</p>",
              page_id: pageId,
              section_avatar: "",
              section_col_arr: 0,
              section_prior: 1,
              section_avtar_alt: "",
              section_slug: "intro",
            },
            dine: {
              id: 0,
              section_name: "",
              section_content: "<p>Detailed content goes here!</p>",
              page_id: pageId,
              section_avatar: "",
              section_col_arr: 0,
              section_prior: 1,
              section_avtar_alt: "",
              section_slug: "dine",
            },
          });
          setSeoInfo({
            id: 0,
            post_id: pageId || 0,
            meta_title: "",
            meta_description: "",
            // route: website_url,
            schema_markup: "",
            is_followed: true,
            is_indexed: true,
            is_indexed_or_is_followed: "1,1",
          });
        }
      }
    });

    if (!imagesData.length > 0) {
      getGalleryImages();
    }
    // getSEOInfo();
  }, [selectedLang]);

  const getGalleryImages = () => {
    LangAPI.get(`/get_all_images`).then((response) => {
      if (response.status === 200) {
        setImagesData(
          response.data?.data?.map((x) => ({ ...x, isChecked: false }))
        );
      }
    });
  };

  // const getSEOInfo = () => {
  //   API.get(`/meta/${pageId}`).then(response => {
  //     if (response.status === 200) {
  //       let seoInfoData = response.data;
  //       if (seoInfoData) {
  //         setSeoInfo(seoInfoData);
  //       }
  //       else {
  //         seoInfoData(seoInfo);
  //       }
  //     }
  //   })
  // }

  const handleInputChange = (e, section) => {
    let updatedAbout = { ...about };
    updatedAbout[section][e.target.name] = e.target.value;
    setAbout(updatedAbout);
  };

  const handleImageSelect = (e, index, section) => {
    setTimeout(() => {
      setShowGallery(false);
    }, 500);

    if (e.target.checked) {
      // if (isSingle && thumbnailPreview !== "") {
      //   alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
      //   return;
      // } else {
      setAbout({
        ...about,
        [section]: { ...about[section], section_avatar: imagesData[index] },
      });
      // setThumbnailPreview(imagesData[index].url)

      // let imagesDataUpdated = imagesData.map((x, i) => {
      //   if (i === index) {
      //     return {
      //       ...x,
      //       isChecked: true
      //     }
      //   } else {
      //     return x
      //   }
      // });
      // setImagesData(imagesDataUpdated);
      // }
    } else {
      setAbout({
        ...about,
        [section]: { ...about[section], section_avatar: "" },
      });
      setThumbnailPreview("");

      setImagesData(
        imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: false,
            };
          } else {
            return x;
          }
        })
      );
    }
  };

  const handleSEOInputChange = (e) => {
    let updatedSeoInfo = { ...seoInfo };
    updatedSeoInfo[e.target.name] = e.target.value;
    setSeoInfo(updatedSeoInfo);
  };

  // const handleRouteChange = (e) => {
  //   let updatedSeoInfo = { ...seoInfo };
  //   let splitValues = e.target.value.split(website_url);
  //   let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
  //   updatedValue = updatedValue.replace(/--/g, '-')
  //   updatedSeoInfo[e.target.name] = website_url + updatedValue;
  //   setSeoInfo(updatedSeoInfo);
  // }

  const handleSEOSubmit = () => {
    let updatedSeoInfo = seoInfo;
    updatedSeoInfo.is_indexed_or_is_followed = `${updatedSeoInfo.is_indexed},${updatedSeoInfo.is_followed}`;

    if (updatedSeoInfo.id > 0) {
      API.put(`/meta/${pageId}`, updatedSeoInfo)
        .then((response) => {
          if (response.status === 200) {
            alert("Section updated successfully !");
          }
        })
        .catch((err) => console.log(err));
    } else {
      API.post(`/meta`, updatedSeoInfo)
        .then((response) => {
          if (response.status === 200) {
            alert("Section updated successfully !");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSubmit = (id, name) => {
    // API.post(`/add_section`, about[name]).then(response => {
    //   if (response.status === 200) {
    //     alert("Section updated successfully !");
    //   }
    // }).catch(err => console.log(err))

    let updatedAbout = { ...about };
    updatedAbout.meta = { ...seoInfo };
    updatedAbout.page_id = pageId;
    updatedAbout.slug = "about-sections";
    // console.log("updatedAbout",updatedAbout); return false;

    LangAPI.post(`/add-section?lang=${selectedLang}`, updatedAbout)
      .then((response) => {
        if (response.status === 200) {
          alert("Section updated successfully !");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != selectedLang) {
      setSelectedLang(event.target.value);
    }
  };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader
            color="primary"
            className="d-flex justify-content-between align-items-center"
          >
            <h4 className="mb-0">Add About-Us Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
            <FormControl
              variant="outlined"
              size="small"
              style={{ width: "20%", color: "white" }}
              // fullWidth
            >
              <InputLabel id="language" style={{ color: "white" }}>
                Select Language
              </InputLabel>
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
                <MenuItem value={"en"}>En</MenuItem>
                <MenuItem value={"fr"}>FR</MenuItem>
                <MenuItem value={"de"}>DE</MenuItem>
                <MenuItem value={"ru"}>RU</MenuItem>
              </Select>
            </FormControl>
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
                      value={about.banner.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "banner")}
                      size="medium"
                      style={{ marginBottom: "1rem" }}
                    />

                    <div className="thumbnail-preview-wrapper-large img-thumbnail">
                      {!about.banner.id > 0 ? (
                        about.banner.section_avatar &&
                        about.banner.section_avatar.url !== "" ? (
                          <img
                            src={
                              process.env.REACT_APP_IMAGE_BASE_URL +
                              about.banner.section_avatar?.url
                            }
                            alt={about.banner.section_avtar_alt || ""}
                          />
                        ) : (
                          <img
                            src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png"
                            alt=""
                          />
                        )
                      ) : typeof about.banner.section_avatar?.url ===
                        typeof 0 ? (
                        // dining.thumbnail && dining.thumbnail !== "" ?
                        <img
                          src={
                            process.env.REACT_APP_IMAGE_BASE_URL +
                            thumbnailPreview
                          }
                          alt={about.banner.section_avtar_alt || ""}
                        />
                      ) : (
                        <img
                          src={
                            process.env.REACT_APP_IMAGE_BASE_URL +
                            about.banner.section_avatar?.url
                          }
                          alt={about.banner.section_avtar_alt || ""}
                        />
                      )}
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
                  <Grid item xs={12} sm={9}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={about.intro.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                      style={{ marginBottom: "1rem" }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor
                      config={ckEditorConfig}
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={about.intro.section_content}
                      onChange={(e) =>
                        setAbout({
                          ...about,
                          intro: {
                            ...about.intro,
                            section_content: e.editor.getData(),
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={about.intro.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {!about.intro.id > 0 ? (
                            about.intro.section_avatar &&
                            about.intro.section_avatar.url !== "" ? (
                              <img
                                src={
                                  process.env.REACT_APP_IMAGE_BASE_URL +
                                  about.intro.section_avatar.url
                                }
                                alt={about.intro.section_avtar_alt || ""}
                              />
                            ) : (
                              <img
                                src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png"
                                alt=""
                              />
                            )
                          ) : typeof about.intro.section_avatar === typeof 0 ? (
                            // dining.thumbnail && dining.thumbnail !== "" ?
                            <img
                              src={
                                process.env.REACT_APP_IMAGE_BASE_URL +
                                thumbnailPreview
                              }
                              alt={about.intro.section_avtar_alt || ""}
                            />
                          ) : (
                            <img
                              src={
                                process.env.REACT_APP_IMAGE_BASE_URL +
                                about.intro.section_avatar
                              }
                              alt={about.intro.section_avtar_alt || ""}
                            />
                          )}
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
                <Typography className={classes.heading}>
                  Dine Elegantly With Us
                </Typography>
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
                      value={about.dine.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "dine")}
                      size="small"
                      style={{ marginBottom: "1rem" }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor
                      config={ckEditorConfig}
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={about.dine.section_content}
                      onChange={(e) =>
                        setAbout({
                          ...about,
                          dine: {
                            ...about.dine,
                            section_content: e.editor.getData(),
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={about.dine.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "dine")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {!about.dine.id > 0 ? (
                            about.dine.section_avatar &&
                            about.dine.section_avatar.url !== "" ? (
                              <img
                                src={
                                  process.env.REACT_APP_IMAGE_BASE_URL +
                                  about.dine.section_avatar.url
                                }
                                alt={about.dine.section_avtar_alt || ""}
                              />
                            ) : (
                              <img
                                src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png"
                                alt=""
                              />
                            )
                          ) : typeof about.dine.section_avatar === typeof 0 ? (
                            // dining.thumbnail && dining.thumbnail !== "" ?
                            <img
                              src={
                                process.env.REACT_APP_IMAGE_BASE_URL +
                                thumbnailPreview
                              }
                              alt={about.dine.section_avtar_alt || ""}
                            />
                          ) : (
                            <img
                              src={
                                process.env.REACT_APP_IMAGE_BASE_URL +
                                about.dine.section_avatar
                              }
                              alt={about.dine.section_avtar_alt || ""}
                            />
                          )}
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
                              setCurrentSection("dine");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
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
                <Typography className={classes.heading}>
                  SEO Information
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
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
                  {/*<Grid item xs={12} sm={3}>*/}
                  {/*  <span>https://fishermanscove-resort.com</span>*/}
                  {/*</Grid>*/}
                  {/*<Grid item xs={12} sm={3}>*/}
                  {/*  <TextField*/}
                  {/*    required*/}
                  {/*    id="route"*/}
                  {/*    name="route"*/}
                  {/*    label="Permalink"*/}
                  {/*    value={seoInfo.route}*/}
                  {/*    variant="outlined"*/}
                  {/*    fullWidth*/}
                  {/*    onChange={handleRouteChange}*/}
                  {/*    size="small"*/}
                  {/*  />*/}
                  {/*</Grid>*/}
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
                      <RadioGroup
                        aria-label="is_followed"
                        row
                        defaultChecked
                        name="is_followed"
                        value={seoInfo.is_followed}
                        onChange={(e) => {
                          setSeoInfo({
                            ...seoInfo,
                            is_followed: !seoInfo.is_followed,
                          });
                        }}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Follow"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No Follow"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="is_indexed"
                        row
                        defaultChecked
                        name="is_indexed"
                        value={seoInfo.is_indexed}
                        onChange={(e) => {
                          setSeoInfo({
                            ...seoInfo,
                            is_indexed: !seoInfo.is_indexed,
                          });
                        }}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Index"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No Index"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
        <Grid item xs={12} sm={12}>
          <MaterialButton
            onClick={() => handleSubmit()}
            size="large"
            color="primary"
            variant="contained"
          >
            Update Section
          </MaterialButton>
        </Grid>
      </div>
      <GalleryDialog
        isSingle={isSingle}
        section={currentSection}
        open={showGallery}
        handleImageSelect={handleImageSelect}
        handleClose={() => {
          setShowGallery(false);
          // setRenderPreviews(true);
        }}
        refreshGallery={getGalleryImages}
        data={imagesData}
      />
    </div>
  );
}
