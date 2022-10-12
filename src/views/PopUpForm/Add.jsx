import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import MaterialButton from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import LangAPI from "langapi/http";
import { MenuItem, Select, FormControl, TextField } from "@material-ui/core";
import { Image } from "@material-ui/icons";
import GalleryDialog from "views/Common/GalleryDialog";

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

export default function AddPopUp(props) {
  const classes = useStyles();
  const initialObject = {
    image: "",
    link: "",
  };
  const [offer, setOffer] = useState({ ...initialObject });
  const [imagesData, setImagesData] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isSingle, setIsSingle] = useState(false);
  const [isBanner, setIsBanner] = useState(false);
  // const [selectedLang, setSelectedLang] = useState(lang || "en");

  useEffect(() => {
    LangAPI.get(`/pop-up/63465d630ac6a76716045822`).then((response) => {
      if (response.status === 200) {
        if (response?.data?.data) {
          setOffer(response?.data?.data);
        } else {
          setOffer(initialObject);
        }
      }
    });
    // }
    if (!imagesData.length > 0) {
      getGalleryImages();
    }
  }, []);

  const getGalleryImages = () => {
    LangAPI.get(`/get_all_images`).then((response) => {
      if (response.status === 200) {
        setImagesData(
          response.data?.data?.map((x) => ({ ...x, isChecked: false }))
        );
      }
    });
  };

  const handleInputChange = (e) => {
    let updatedOffer = { ...offer };
    updatedOffer[e.target.name] = e.target.value;
    setOffer(updatedOffer);
  };

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && !isBanner) {
        setOffer({
          ...offer,
          image: imagesData[index].avatar,
          image: imagesData[index].avatar,
        });
        setTimeout(() => {
          setShowGallery(false);
        }, 500);
      }
    } else {
      if (isSingle && !isBanner) {
        setOffer({ ...offer, image: "" });
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
    LangAPI.post(`/pop-up`, finalOffer)
      .then((response) => {
        if (response.status === 200) {
          alert("Record Updated");
          props.history.push("/admin/popup/add");
        }
      })
      .catch((err) => alert("Something went wrong"));
  };

  // const handleChange = (event) => {
  //   // setAge(event.target.value as string);
  //   if (event.target.value != selectedLang) {
  //     setSelectedLang(event.target.value);
  //   }
  // };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader
            color="primary"
            className="d-flex justify-content-between align-items-center"
          >
            <h4 style={{ fontWeight: "400" }} className="mb-0">
              Add Pop-Up
            </h4>
            {/* <FormControl
              variant="outlined"
              size="small"
              style={{ width: "20%", color: "white" }}
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
            </FormControl> */}
          </CardHeader>
          <CardBody>
            <Grid container spacing={2} style={{ display: "flex" }}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="link"
                      name="link"
                      label="URL"
                      value={offer.link}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <div className="thumbnail-preview-wrapper-small img-thumbnail">
                      <img src={offer.image} alt={"pop up image"} />
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
                        }}
                      >
                        Change Thumbnail Image
                      </MaterialButton>
                    </Fragment>
                  </Grid>
                </Grid>
              </Grid>
              <div className="clearfix clear-fix"></div>
              {/* GALLERY DIALOG BOX START */}
              <GalleryDialog
                isSingle={isSingle}
                open={showGallery}
                handleImageSelect={handleImageSelect}
                handleClose={() => {
                  setShowGallery(false);
                }}
                refreshGallery={getGalleryImages}
                data={imagesData}
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
