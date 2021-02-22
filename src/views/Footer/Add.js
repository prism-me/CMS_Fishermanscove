import React, { Fragment, Suspense, useEffect, useState } from "react";
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
import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import { Link } from "react-router-dom";
import FooterPreview from "./Preview";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
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

export default function UpdateFooter() {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const initialObject = {
    first: {
      description: ''
    },
    second: {
      links: []
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
  }

  const [footerContent, setFooterContent] = useState({ ...initialObject })

  useEffect(() => {
    getFooterData();
  }, [])

  const getFooterData = () => {
    API.get('/get_widgets/footer').then(response => {
      if (response.status === 200) {
        const { data } = response;
        const first = data.find(x => x.widget_name === "first");
        const second = data.find(x => x.widget_name === "second");
        const third = data.find(x => x.widget_name === "third");
        const social = data.find(x => x.widget_name === "social");
        setFooterContent({
          first: first ? { id: first.id, ...JSON.parse(first.items) } : initialObject.first,
          second: second ? { id: second.id, ...JSON.parse(second.items) } : initialObject.second,
          third: third ? { id: third.id, ...JSON.parse(third.items) } : initialObject.third,
          social: social ? { id: social.id, ...JSON.parse(social.items) } : initialObject.social,
        })
      }
    })
  }

  const handleInputChange = (e, section) => {
    let updatedFooterContent = { ...footerContent };
    updatedFooterContent[section][e.target.name] = e.target.value;
    setFooterContent(updatedFooterContent);
  }

  const handleLinkChange = (e, index, section) => {
    let updatedFooterContent = { ...footerContent };
    updatedFooterContent[section].links[index][e.target.name] = e.target.value;
    setFooterContent(updatedFooterContent);
  }

  // const handleFileChange = (e) => {
  //   let files = e.target.files || e.dataTransfer.files;
  //   if (!files.length)
  //     return;
  //   createImage(files[0]);
  // }

  // const createImage = (file) => {
  //   let reader = new FileReader();
  //   reader.onload = (e) => {
  //     setDining({ ...dining, thumbnail: e.target.result })
  //   };
  //   reader.readAsDataURL(file);
  // }

  const handleSubmit = (section) => {
    API[footerContent[section]?.id ? "put" : "post"](footerContent[section]?.id ? `/widget/${footerContent[section]?.id}` : `/widget`, {
      widget_type: 'footer',
      widget_name: section,
      items: footerContent[section]
    }).then(response => {
      if (response.status === 200) {
        alert(response.data.message);
        // setFooterContent({ ...initialObject }); //resetting the form
      }
    }).catch(err => alert("Something went wrong"));
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Update Site Footer</h4>
          </CardHeader>

          <CardBody className="">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>First Column - About</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2">First Column (About)</h4> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="description"
                      name="description"
                      label="About Description"
                      value={footerContent.first.description}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      rowsMax={4}
                      onChange={(e) => handleInputChange(e, 'first')}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit("first")} color="primary" variant="contained">
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
                <Typography className={classes.heading}>Second Column - Services</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-4"></h4> */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MaterialButton
                      variant="outlined"
                      component="span"
                      className={classes.button}
                      size="small"
                      color="primary"
                      onClick={() => setFooterContent({ ...footerContent, second: { ...footerContent.second, links: [...footerContent.second.links, { id: footerContent.second.links.length + 1, text: '', address: '' }] } })}
                    >
                      Add a New Link
                    </MaterialButton>
                  </Grid>
                  {
                    footerContent?.second?.links?.map((x, index) => (
                      <React.Fragment>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            required
                            id={`text${x.id}`}
                            name="text"
                            label="Link Text"
                            value={x.text}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => handleLinkChange(e, index, 'second')}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            required
                            id={`address${x.id}`}
                            name="address"
                            label="Link Address"
                            value={x.address}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => handleLinkChange(e, index, 'second')}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <MaterialButton onClick={() => setFooterContent({ ...footerContent, second: { ...footerContent.second, links: footerContent.second.links.filter(z => z.id !== x.id) } })} color="secondary" size="small" variant="outlined" style={{ height: '100%' }}>
                            Delete Link
                          </MaterialButton>
                        </Grid>
                      </React.Fragment>
                    ))
                  }
                  <Grid item xs={12} sm={12}>
                    <MaterialButton disabled={footerContent.second.links < 1} onClick={() => handleSubmit("second")} color="primary" variant="contained">
                      Update Section
                  </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography className={classes.heading}>Third Column - Contact Us</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      value={footerContent.third.phone}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, 'third')}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="email"
                      name="email"
                      label="Email Address"
                      value={footerContent.third.email}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, 'third')}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="address"
                      name="address"
                      label="Location"
                      value={footerContent.third.address}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, 'third')}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit("third")} color="primary" variant="contained">
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
