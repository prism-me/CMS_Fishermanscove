import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from "@material-ui/core/Grid";
// import Paper from '@material-ui/core/Paper';
import MaterialButton from "@material-ui/core/Button";

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { ckEditorConfig } from "utils/data";
// import avatar from "assets/img/faces/marc.jpg";
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@material-ui/core";

import CKEditor from "ckeditor4-react";
import InputLabel from "@material-ui/core/InputLabel";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams, withRouter, useLocation } from "react-router-dom";
import GalleryDialog from "views/Common/GalleryDialog";
import SelectedImagesThumbnails from "../Common/SelectedImagesThumbnails";
import AddFAQDialog from "../FAQ/AddFAQDialog";
import FAQSection from "../SitePages/Pages/Common/FAQSection";
import LangAPI from "langapi/http";

const website_url = "https://fishermanscove-resort.com/dining/";
const append_url = "dining";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default withRouter(function DiningAdd(props) {
  const classes = useStyles();

  //check if edit or add request
  let { id } = useParams();
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const lang = query.get('lang');

  const initialObject = {
    post_name: "",
    post_content: "",
    short_description: "",
    room_type: -1,
    parent_id: -1,
    thumbnail: "",
    banner_img: "",
    banner_text: "",
    alt_text: "",
    meta_title: "",
    meta_description: "",
    schema_markup: "",
    post_url: "",
    route: website_url,
    inner_route: append_url,
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "1,1",
    images_list: [],
    section_slug: "",
    section_name: "",
    section_dress_code: "",
    section_opening_hours: "",
    slug: ""
  };

  const [dining, setDining] = useState({ ...initialObject });

  const [diningImages, setDiningImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);
  const [showFAQ, setShowFAQ] = useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [uploadsPreview, setUploadsPreview] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isSingle, setIsSingle] = useState(false);
  const [isImagesList, setImagesList] = useState(false);
  const [renderPreviews, setRenderPreviews] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");
  const [selectedLang, setSelectedLang] = useState(lang || "en");

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      // setPostId(id);
      LangAPI.get(`/dinings/${id}?lang=${selectedLang}`).then((response) => {
        if (response.status === 200) {

          if (response?.data?.data) {
            let data = { ...response?.data?.data };
            // let meta = { ...response?.data?.meta[0] };
            // data.meta_title = meta.meta_title;
            // data.is_indexed_or_is_followed = meta.is_indexed_or_is_followed;
            // data.meta_description = meta.meta_description;
            // data.schema_markup = meta.schema_markup;
            // data.route = website_url + data.route;
            setDining(data);
            // setUploadsPreview(response.data?.data?.images_list);
            // console.log(response.data?.data?.images_list,"response.data?.data?.images_list");return false;
            let images = JSON.parse(response.data?.data?.images_list)
            setSelectedImages(images)
            setThumbnailPreview(response?.data?.data?.thumbnailPreview)
            setBannerThumbnailPreview(response?.data?.data?.banner_imgPreview)
          } else {
            setDining(initialObject);
            // setUploadsPreview([]);
            setSelectedImages([])
          }

        }
      });
    }

    if (!imagesData.length > 0) {
      getGalleryImages();
    }
  }, [selectedLang]);

  const getGalleryImages = () => {
    LangAPI.get(`/get_all_images`).then((response) => {
      if (response.status === 200) {
        setImagesData(response.data?.data);
      }
    });
  };

  const handleInputChange = (e) => {
    let updatedDining = { ...dining };
    updatedDining[e.target.name] = e.target.value;
    if (e.target.name === "post_name") {
      let updatedValue = e.target.value.replace(/\s+/g, "-");
      updatedValue = updatedValue.replace(/--/g, "-");
      updatedDining["route"] = website_url + updatedValue.toLowerCase();
    }
    setDining(updatedDining);
  };

  const handleRouteChange = (e) => {
    let updatedDining = { ...dining };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1]
      ? splitValues[1].replace(/\s+/g, "-")
      : "";
    updatedValue = updatedValue.replace(/--/g, "-");
    updatedDining[e.target.name] = website_url + updatedValue.toLowerCase();
    setDining(updatedDining);
  };

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      // if (isSingle && thumbnailPreview !== "") {
      //   alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
      //   return;
      // } else {
      if (isSingle && !isBanner && !isImagesList) {
        setDining({ ...dining, thumbnail: imagesData[index].avatar, thumbnailPreview: imagesData[index].avatar });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setShowGallery(false);
        }, 500);
      } else if (!isSingle && isBanner && !isImagesList) {
        setDining({ ...dining, banner_img: imagesData[index].avatar, banner_imgPreview: imagesData[index].avatar });
        setBannerThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setShowGallery(false);
        }, 500);
      } else if (!isSingle && !isBanner && isImagesList) {
        setSelectedImages([...selectedImages, imagesData[index]]);
        let imagesDataUpdated = imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: true,
            };
          } else {
            return x;
          }
        });
        setImagesData(imagesDataUpdated);
      }
      // }
    } else {
      if (isSingle && !isBanner) {
        setDining({ ...dining, thumbnail: "" });
        setThumbnailPreview("");
      } else if (isSingle && isBanner) {
        setDining({ ...dining, banner_img: "" });
        setBannerThumbnailPreview("");
      } else {
        setSelectedImages(
          selectedImages.filter((x) => x !== imagesData[index]._id)
        );
      }
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

  const handleSubmit = () => {

    let finalDining = dining;
    finalDining.route = dining?.route?.split(website_url)?.[1] || "";
    finalDining.inner_route = append_url || "";
    finalDining.images_list = JSON.stringify([...new Set(selectedImages)]);
    finalDining.is_indexed_or_is_followed = `${finalDining.is_indexed ? "1" : "0"
      },${finalDining.is_followed ? "1" : "0"}`;

    const initialObject = {
      post_name: "",
      post_content: "",
      short_description: "",
      room_type: -1,
      parent_id: -1,
      thumbnail: "",
      banner_img: "",
      banner_text: "",
      alt_text: "",
      meta_title: "",
      meta_description: "",
      schema_markup: "",
      post_url: "",
      route: website_url,
      inner_route: append_url,
      is_followed: true,
      is_indexed: true,
      is_indexed_or_is_followed: "1,1",
      images_list: [],
      section_slug: "",
      section_name: "",
      section_dress_code: "",
      section_opening_hours: "",
      slug: ""
    };

    if (!finalDining.post_name || finalDining.post_name == "") {
      alert("Please Add Title Before Submiting")
      return false;
    }
    if (!finalDining.banner_text || finalDining.banner_text == "") {
      alert("Please Add Banner Text Before Submiting")
      return false;
    }
    if (!finalDining.thumbnailPreview || finalDining.thumbnailPreview == "") {
      alert("Please select Featured Image Before Submiting")
      return false;
    }
    if (!finalDining.banner_imgPreview || finalDining.banner_imgPreview == "") {
      alert("Please select Add Banner Image Before Submiting")
      return false;
    }
    if (!finalDining.slug || finalDining.slug == "") {
      alert("Please select Add Slug Before Submiting")
      return false;
    }
    if (!finalDining.short_description || finalDining.short_description == "") {
      alert("Please Add Short Description Before Submiting")
      return false;
    }
    if (!selectedImages || selectedImages.length <= 0) {
      alert("Please select Images List Before Submiting")
      return false;
    }


    if (isEdit) {
      LangAPI.post(`/dinings?lang=${selectedLang}`, finalDining).then((response) => {
        if (response.status === 200) {
          alert("Record Updated");
          setDining({ ...initialObject }); //clear all fields
          props.history.push("/admin/dining");
        }
      });
    } else {
      LangAPI.post(`/dinings?lang=${selectedLang}`, finalDining).then((response) => {
        if (response.status === 200) {
          // setPostId(response.data?.post_id);
          alert("Record Updated");
          setDining({ ...initialObject });
          props.history.push("/admin/dining");
        }
      });
    }
  };

  const handleRemoveSelectedImage = (x, arrayListType) => {
    switch (arrayListType) {
      case "uploadsPreview":
        let updatePreview = uploadsPreview.filter((u) => u._id !== x._id)
        setUploadsPreview(updatePreview);
        setImagesData(imagesData.map(im => {
          if (im._id === x._id) {
            im.isChecked = false
          }
          return im
        }))
        setSelectedImages(updatePreview.map((u) => u._id));
        break;
      case "selectedImages":
        let updateData = selectedImages.filter((u) => u._id !== x._id);
        setImagesData(imagesData.map(im => {
          if (im._id === x._id) {
            im.isChecked = false
          }
          return im
        }))
        setSelectedImages(updateData);
        break;
      default:
        return setUploadsPreview(uploadsPreview.filter((u) => u._id !== x._id))
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
            <h4 style={{ fontWeight: "400" }} className="my-0">
              Add Dining/Suite
            </h4>
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
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <h4 style={{ fontWeight: "400" }} className="mt-3">
              General Information
            </h4>
            <Grid container spacing={2} style={{ display: "flex" }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="post_name"
                  name="post_name"
                  label="Restaurant Name"
                  value={dining.post_name}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
                <div className="thumbnail-preview-wrapper-small mt-2 img-thumbnail">
                  {!isEdit ? (
                    thumbnailPreview && thumbnailPreview !== "" ? (
                      <img src={thumbnailPreview} alt={dining.alt_text || ""} />
                    ) : (
                      <img
                        src={require("./../../assets/img/placeholder.png")}
                        alt=""
                      />
                    )
                  ) : typeof dining.thumbnail === typeof 0 ? (
                    // dining.thumbnail && dining.thumbnail !== "" ?
                    <img src={thumbnailPreview} alt={dining.alt_text || ""} />
                  ) : (
                    <img src={dining.thumbnail} alt={dining.alt_text || ""} />
                  )}
                </div>
                <Fragment>
                  <MaterialButton
                    variant="outlined"
                    color="primary"
                    startIcon={<Image />}
                    className="mt-1"
                    fullWidth
                    onClick={() => {
                      setIsSingle(true);
                      setIsBanner(false);
                      setShowGallery(true);
                      setImagesList(false);
                    }}
                  >
                    {isEdit ? "Change" : "Upload"} Featured Image
                  </MaterialButton>
                  <TextField
                    required
                    id="slug"
                    name="slug"
                    label="Slug"
                    value={dining.slug}
                    variant="outlined"
                    fullWidth
                    onChange={handleInputChange}
                    size="small"
                    style={{ marginTop: '1rem' }}
                  />
                </Fragment>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="banner_text"
                  name="banner_text"
                  label="Banner Text"
                  value={dining.banner_text}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
                <div className="thumbnail-preview-wrapper-small mt-2 img-thumbnail">
                  {!isEdit ? (
                    bannerThumbnailPreview && bannerThumbnailPreview !== "" ? (
                      <img
                        src={bannerThumbnailPreview}
                        alt={dining.alt_text || ""}
                      />
                    ) : (
                      <img
                        src={require("./../../assets/img/placeholder.png")}
                        alt=""
                      />
                    )
                  ) : typeof dining.banner_img === typeof 0 ? (
                    // dining.thumbnail && dining.thumbnail !== "" ?
                    <img
                      src={bannerThumbnailPreview}
                      alt={dining.alt_text || ""}
                    />
                  ) : (
                    <img src={dining.banner_img} alt={dining.alt_text || ""} />
                  )}
                </div>
                <Fragment>
                  <MaterialButton
                    variant="outlined"
                    color="primary"
                    startIcon={<Image />}
                    className="mt-1"
                    fullWidth
                    onClick={() => {
                      setIsSingle(false);
                      setIsBanner(true);
                      setShowGallery(true);
                      setImagesList(false);
                    }}
                  >
                    {isEdit ? "Change" : "Upload"} Banner Image
                  </MaterialButton>
                </Fragment>
              </Grid>

              <Grid item xs={12} sm={12}>
                <hr />
                <h4 style={{ fontWeight: "400" }} className="mt-2">
                  Short Description
                </h4>
                <CKEditor
                  config={ckEditorConfig}
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={dining.short_description}
                  onChange={(e) =>
                    setDining({
                      ...dining,
                      short_description: e.editor.getData(),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <hr />
                <h4 style={{ fontWeight: "400" }} className="mt-2">
                  Detailed Content
                </h4>
                <CKEditor
                  config={ckEditorConfig}
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={dining.post_content}
                  onChange={(e) =>
                    setDining({ ...dining, post_content: e.editor.getData() })
                  }
                />
                <hr />
              </Grid>
              <Grid item xs={12} sm={6}>
                <h4 style={{ fontWeight: "400" }} className="mt-2">
                  Dress Code
                </h4>
                <CKEditor
                  config={ckEditorConfig}
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={dining.section_dress_code}
                  onChange={(e) =>
                    setDining({ ...dining, section_dress_code: e.editor.getData() })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <h4 style={{ fontWeight: "400" }} className="mt-2">
                  Opening hours
                </h4>
                <CKEditor
                  config={ckEditorConfig}
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={dining.section_opening_hours}
                  onChange={(e) =>
                    setDining({ ...dining, section_opening_hours: e.editor.getData() })
                  }
                />
              </Grid>
            </Grid>
            <hr />
            <h4 style={{ fontWeight: "400" }} className="mt-2">
              SEO Information
            </h4>
            <Grid container spacing={2}>
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
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {
                  isEdit ? <TextField
                    required
                    id="route"
                    name="route"
                    label="Permalink"
                    value={dining.route}
                    variant="outlined"
                    fullWidth
                    onChange={handleRouteChange}
                    size="small"
                    InputProps={{
                      disabled: true,
                    }}
                  /> :
                    <TextField
                      required
                      id="route"
                      name="route"
                      label="Permalink"
                      value={dining.route}
                      variant="outlined"
                      fullWidth
                      onChange={handleRouteChange}
                      size="small"
                      InputProps={{
                        disabled: false,
                      }}
                    />
                }
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="meta_description"
                  name="meta_description"
                  label="Meta Description"
                  value={dining.meta_description}
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
                  value={dining.schema_markup}
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
                  <RadioGroup
                    aria-label="is_followed"
                    row
                    defaultChecked
                    name="is_followed"
                    value={dining.is_followed}
                    onChange={(e) => {
                      setDining({
                        ...dining,
                        is_followed: !dining.is_followed,
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
                    value={dining.is_indexed}
                    onChange={(e) => {
                      setDining({ ...dining, is_indexed: !dining.is_indexed });
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
          </CardBody>
        </Card>

        {/* ***************FAQ Section***************** */}
        {/*<Grid container spacing={2}>*/}
        {/*  <Card>*/}
        {/*    <CardBody>*/}
        {/*      <h4 style={{ fontWeight: "400" }}>F.A.Q'S</h4>*/}
        {/*  <Grid item xs={12} sm={12}>*/}
        {/*    FAQ ITEM*/}
        {/*    <FAQSection*/}
        {/*        removeQuestion={removeQuestion}*/}
        {/*        section_content={dining.faqs_content}*/}
        {/*        handleQuestionChange={handleQuestionChange}*/}
        {/*        handleAnswerChange={handleAnswerChange}*/}
        {/*        // section_content={dining.initialObject.faqs_content}*/}
        {/*        // handleQuestionChange={handleQuestionChange}*/}
        {/*        // handleAnswerChange={handleAnswerChange}*/}
        {/*    />*/}
        {/*  </Grid>*/}
        {/*  <Grid item xs={12}>*/}
        {/*    <MaterialButton*/}
        {/*        variant="outlined"*/}
        {/*        component="span"*/}
        {/*        className={classes.button}*/}
        {/*        size="small"*/}
        {/*        color="primary"*/}
        {/*        onClick={() => dining({ ...dining, initialObject: { ...dining.initialObject, faqs_content: [...dining.initialObject.faqs_content, { id: dining.initialObject.faqs_content?.length + 1, question: '', answer: '' }] } })}*/}
        {/*    >*/}
        {/*      Add a New Link*/}
        {/*    </MaterialButton>*/}
        {/*  </Grid>*/}
        {/*    </CardBody>*/}
        {/*  </Card>*/}
        {/*</Grid>*/}
        {/* ********* SLIDER IMAGES ******** */}
        {/* ******************************** */}
        <Card>
          <CardBody>
            <h4 style={{ fontWeight: "400" }}>Dining Images</h4>
            <p>
              <em>Please select images from gallery.</em>
            </p>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <MaterialButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setRenderPreviews(false);
                    setIsSingle(false);
                    setIsBanner(false);
                    setShowGallery(true);
                    setImagesList(true);
                  }}
                >
                  Select Gallery Images
                </MaterialButton>
              </Grid>
              {
                imagesData
                  ?.filter(function (array_el) {
                    return (
                      selectedImages.filter(function (menuItems_el) {
                        return menuItems_el._id == array_el._id;
                      }).length !== 0
                    );
                  })
                  ?.map((x) => (<SelectedImagesThumbnails x={x} handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "selectedImages")} />
                    // <Grid item xs={12} sm={2}>
                    //   <div style={{ height: "120px" }}>
                    //     <img
                    //       width="100%"
                    //       src={x.avatar}
                    //       className="img-thumbnail"
                    //       alt=""
                    //       style={{ height: "90%", objectFit: "cover" }}
                    //     />
                    //     <p style={{ fontSize: "12px" }} className="text-center">
                    //       {x.alt_tag}
                    //     </p>
                    //   </div>
                    // </Grid>
                  ))}
              {uploadsPreview &&
                uploadsPreview?.map((x) => (
                  <SelectedImagesThumbnails x={x} handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "uploadsPreview")} />
                  // <Grid item xs={12} sm={2}>
                  //   <div style={{ height: "120px" }}>
                  //     <img
                  //       width="100%"
                  //       src={x.avatar}
                  //       className="img-thumbnail"
                  //       alt=""
                  //       style={{ height: "90%", objectFit: "cover" }}
                  //     />
                  //     <p style={{ fontSize: "12px" }} className="text-center">
                  //       {x.alt_tag}
                  //     </p>
                  //   </div>
                  // </Grid>
                ))}
              <div className="clearfix clear-fix"></div>
              {/* GALLERY DIALOG BOX START */}
              <GalleryDialog
                isSingle={isSingle}
                open={showGallery}
                handleImageSelect={handleImageSelect}
                handleClose={() => {
                  setShowGallery(false);
                  setRenderPreviews(true);
                  setUploadsPreview([])
                }}
                refreshGallery={getGalleryImages}
                data={imagesData}
                selectedData={selectedImages}
              />
              {/* GALLERY DIALOG BOX END */}
            </Grid>
          </CardBody>
        </Card>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <MaterialButton
              onClick={handleSubmit}
              style={{ float: "right" }}
              variant="contained"
              color="primary"
              size="large"
            >
              Submit
            </MaterialButton>
          </Grid>
        </Grid>
        {/* } */}
      </div>
    </div>
  );
});
