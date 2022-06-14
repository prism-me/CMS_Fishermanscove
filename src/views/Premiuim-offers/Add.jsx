import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
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
  MenuItem,
  Select,
  FormControl,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Avatar,
} from "@material-ui/core";
import CKEditor from "ckeditor4-react";

import { ckEditorConfig } from "utils/data";

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams, useLocation } from "react-router-dom";
import GalleryDialog from "views/Common/GalleryDialog";
import SelectedImagesThumbnails from "../Common/SelectedImagesThumbnails";

const website_url = "https://fishermanscove-resort.com/offers/";
const append_url = "offers/";

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

export default function AddOffer(props) {
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
    is_premium: 1,
    thumbnail: "",
    banner_img: "",
    banner_text: "",
    alt_text: "",
    meta_title: "",
    meta_description: "",
    schema_markup: "",
    post_url: "",
    slug: "",
    route: website_url,
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "1,1",
    img_directory: "offers",
    images_list: [],
    category_id: 5,
  };
  const [offer, setOffer] = useState({ ...initialObject });
  const [offerImages, setOfferImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  const [imagesData, setImagesData] = useState([]);
  const [uploadsPreview, setUploadsPreview] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isSingle, setIsSingle] = useState(false);
  const [renderPreviews, setRenderPreviews] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [isImagesList, setImagesList] = useState(false);
  const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");
  const [selectedLang, setSelectedLang] = useState(lang || "en");

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      // setPostId(id);
      LangAPI.get(`/offers/${id}?lang=${selectedLang}`).then((response) => {
        if (response.status === 200) {
          let data = response?.data?.data || [];
          data.route = website_url + data.route;
          if (response?.data?.data) {
            setOffer(response?.data?.data);
            let images = JSON.parse(response.data?.data?.images_list)
            setSelectedImages(images);
            setThumbnailPreview(response.data?.data?.thumbnailPreview);
            setBannerThumbnailPreview(response?.data?.data?.banner_imgPreview);
          } else {
            setSelectedImages([]);
            setThumbnailPreview("");
            setBannerThumbnailPreview("");
            setOffer(initialObject);
          }
        }
      });
    }
    // LangAPI.get("/offer_categories/offers").then((response) => {
    //   if (response?.status === 200) {
    //     setCategories(response.data);
    //   }
    // });
    if (!imagesData.length > 0) {
      getGalleryImages();
    }
  }, [selectedLang]);

  const getGalleryImages = () => {
    LangAPI.get(`/get_all_images`).then((response) => {
      if (response.status === 200) {
        setImagesData(response.data?.data?.map((x) => ({ ...x, isChecked: false })));
      }
    });
  };

  const handleInputChange = (e) => {
    let updatedOffer = { ...offer };
    updatedOffer[e.target.name] = e.target.value;
    if (e.target.name === "post_name" && !isEdit) {
      let updatedValue = e.target.value.replace(/\s+/g, "-");
      updatedValue = updatedValue.replace(/--/g, "-");
      updatedOffer["route"] = website_url + updatedValue.toLowerCase();
    }
    setOffer(updatedOffer);
  };

  const handleRouteChange = (e) => {
    // eslint-disable-next-line no-debugger
    // debugger;
    let updatedOffer = { ...offer };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1]
      ? splitValues[1].replace(/\s+/g, "-")
      : "";
    updatedValue = updatedValue.replace(/--/g, "-");
    updatedOffer[e.target.name] = website_url + updatedValue.toLowerCase();
    setOffer(updatedOffer);
  };

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      // if (isSingle && !isBanner) {
      // alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
      //   setShowGallery(false);
      //   return;
      // } else if (!isSingle && isBanner ) {
      //   alert("You can only select 1 image for banner. If you want to change image, deselect the image and then select a new one");
      //   return;
      // } else {
      if (isSingle && !isBanner && !isImagesList) {
        setOffer({ ...offer, thumbnail: imagesData[index].avatar, thumbnailPreview: imagesData[index].avatar });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setShowGallery(false);
        }, 500);
      } else if (!isSingle && isBanner && !isImagesList) {
        setOffer({ ...offer, banner_img: imagesData[index].avatar, banner_imgPreview: imagesData[index].avatar });
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
        setOffer({ ...offer, thumbnail: "" });
        setThumbnailPreview("");
      } else if (!isSingle && isBanner) {
        setOffer({ ...offer, banner_img: "" });
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
    let finalOffer = offer;
    finalOffer.route = finalOffer.route.split(website_url)?.[1];

    finalOffer.images_list = JSON.stringify(selectedImages);

    finalOffer.is_indexed_or_is_followed = `${finalOffer.is_indexed},${finalOffer.is_followed}`;
    // console.log("====finalOffer====",finalOffer)
    // return false;

    if (isEdit) {
      // finalOffer.images_list = [
      //   ...JSON.parse(finalOffer.images_list),
      //   ...selectedImages,
      // ];
      // finalOffer.images_list = JSON.stringify(finalOffer.images_list);

      LangAPI.post(`/offers?lang=${selectedLang}`, finalOffer)
        .then((response) => {
          if (response.status === 200) {
            alert("Record Updated");
            // setOffer({ ...initialObject }); //resetting the form
            // eslint-disable-next-line react/prop-types
            props.history.push("/admin/premium-offers");
          }
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      // finalOffer.images_list = JSON.stringify(selectedImages);

      LangAPI.post(`/offers?lang=${selectedLang}`, finalOffer)
        .then((response) => {
          if (response.status === 200) {
            alert("Record Added");
            // setPostId(response.data?.post_id);
            // setOffer({ ...initialObject });
            props.history.push("/admin/premium-offers");
          }
        })
        .catch((err) => alert("Something went wrong."));
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
        console.log('selectedImages', x)
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
  // const handleInputChangePremium = (event) => {
  //   // setAge(event.target.value as string);

  //   let updatedOffer = { ...offer };
  //   if (event.target.value != updatedOffer.is_premium) {
  //     updatedOffer.is_premium = event.target.value;
  //   }

  //   setOffer(updatedOffer);
  // };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary" className="d-flex justify-content-between align-items-center">
            <h4 style={{ fontWeight: "400" }} className="mb-0">
              Add Premiuim Offer
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
          </CardHeader>
          <CardBody>
            <h4 style={{ fontWeight: "400" }} className="mt-1">
              General Information
            </h4>
            <Grid container spacing={2} style={{ display: "flex" }}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="post_name"
                      name="post_name"
                      label="Name"
                      value={offer.post_name}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      fullWidth
                      className={classes.formControl}
                    >

                      <TextField
                        required
                        id="post_url"
                        name="post_url"
                        label="synxis Link"
                        value={offer.post_url}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChange}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <div className="thumbnail-preview-wrapper-small img-thumbnail">
                      {!isEdit ? (
                        thumbnailPreview && thumbnailPreview !== "" ? (
                          <img
                            src={thumbnailPreview}
                            alt={offer.alt_text || ""}
                          />
                        ) : (
                          <img
                            src={require("./../../assets/img/placeholder.png")}
                            alt=""
                          />
                        )
                      ) : typeof offer.thumbnail === typeof 0 ? (
                        // offer.thumbnail && offer.thumbnail !== "" ?
                        <img
                          src={thumbnailPreview}
                          alt={offer.alt_text || ""}
                        />
                      ) : (
                        <img src={offer.thumbnail} alt={offer.alt_text || ""} />
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
                    </Fragment>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="banner_text"
                      name="banner_text"
                      label="Banner Text"
                      value={offer.banner_text}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      fullWidth
                      className={classes.formControl}
                    >

                      <TextField
                        required
                        id="slug"
                        name="slug"
                        label="Slug"
                        value={offer.slug}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChange}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <div className="thumbnail-preview-wrapper img-thumbnail">
                      {!isEdit ? (
                        bannerThumbnailPreview &&
                          bannerThumbnailPreview !== "" ? (
                          <img
                            src={bannerThumbnailPreview}
                            alt={offer.alt_text || ""}
                          />
                        ) : (
                          <img
                            src={require("./../../assets/img/placeholder.png")}
                            alt=""
                          />
                        )
                      ) : typeof offer.banner_img === typeof 0 ? (
                        // offer.thumbnail && offer.thumbnail !== "" ?
                        <img
                          src={bannerThumbnailPreview}
                          alt={offer.alt_text || ""}
                        />
                      ) : (
                        <img
                          src={offer.banner_img}
                          alt={offer.alt_text || ""}
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
                        onClick={() => {
                          setIsSingle(false);
                          setIsBanner(true);
                          setShowGallery(true);
                          setImagesList(false);
                        }}
                      >
                        {isEdit ? "Change" : "Upload"} Featured Image
                      </MaterialButton>
                    </Fragment>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item xs={12} sm={12}>
                <FormControl
                  variant="outlined"
                  size="small"
                  fullWidth
                  className={classes.formControl}
                >

                  <InputLabel id="is_premium-label">Type</InputLabel>
                  <Select
                    labelId="is_premium-label"
                    id="is_premium"
                    name="is_premium"
                    value={offer?.is_premium}
                    onChange={handleInputChangePremium}
                    label="Type"
                    fullWidth
                  >
                    <MenuItem value={0}>Other Offer</MenuItem>
                    <MenuItem value={1}>Preminum Offer</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} sm={12}>
                <hr />
                <h4 style={{ fontWeight: "400" }}>Short Description</h4>
                <CKEditor
                  config={ckEditorConfig}
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={offer.short_description}
                  onChange={(e) =>
                    setOffer({
                      ...offer,
                      short_description: e.editor.getData(),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <hr />
                <h4 style={{ fontWeight: "400" }}>Detailed Content</h4>
                <CKEditor
                  config={ckEditorConfig}
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={offer.post_content}
                  onChange={(e) =>
                    setOffer({ ...offer, post_content: e.editor.getData() })
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
                  value={offer.meta_title}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="route"
                  name="route"
                  label="Permalink"
                  value={offer.route}
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
                  value={offer.meta_description}
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
                  value={offer.schema_markup}
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
                    value={offer.is_followed}
                    onChange={(e) => {
                      setOffer({ ...offer, is_followed: !offer.is_followed });
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
                    value={offer.is_indexed}
                    onChange={(e) => {
                      setOffer({ ...offer, is_indexed: !offer.is_indexed });
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

        {/* MULTIPLE IMAGES UPLOAD SECTION START */}
        <Card>
          <CardBody>
            <h3>Offer Images</h3>
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
                  ?.map((x) => (
                    <SelectedImagesThumbnails x={x} handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "selectedImages")} />
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
        {/* MULTIPLE IMAGES UPLOAD SECTION END */}
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
      </div>
    </div>
  );
}
