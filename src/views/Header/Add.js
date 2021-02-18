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
import { MenuItem, Select, FormControl, TextField, Radio, RadioGroup, FormControlLabel, Collapse, Paper } from "@material-ui/core";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

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

export default function UpdateHeader() {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const initialObject = {
    menuItems: [],
    contact: {
      phone: '',
      email: '',
      address: ''
    }
  }
  const [dragId, setDragId] = useState();
  const [headerContent, setHeaderContent] = useState({ ...initialObject })

  useEffect(() => {
    API.get('/get_widgets/header').then(response => {
      if (response.status === 200) {
        const { data } = response;
        setHeaderContent({
          menuItems: JSON.parse(data.find(x => x.widget_name === "menuItems").items) || initialObject.menuItems,
          contact: JSON.parse(data.find(x => x.widget_name === "contact").items) || initialObject.contact,
        })
      }
    })
  }, [])

  const handleMenuItemChange = (e, index) => {
    let updatedItems = [...headerContent.menuItems];
    updatedItems[index][e.target.name] = e.target.value;
    setHeaderContent({ ...headerContent, menuItems: updatedItems });
  }

  const handleContactItemChange = (e) => {
    let updatedContact = { ...headerContent.contact };
    updatedContact[e.target.name] = e.target.value;
    setHeaderContent({ ...headerContent, contact: updatedContact });
  }

  const handleFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    createImage(files[0]);
  }

  const createImage = (file) => {
    // let reader = new FileReader();
    // reader.onload = (e) => {
    //   setDining({ ...dining, thumbnail: e.target.result })
    // };
    // reader.readAsDataURL(file);
  }

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    const dragBox = headerContent.menuItems.find((box) => box.id == dragId);
    const dropBox = headerContent.menuItems.find((box) => box.id == ev.currentTarget.id);

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const updatedMenuItems = headerContent.menuItems.map((box) => {
      if (box.id == dragId) {
        box.order = dropBoxOrder;
      }
      if (box.id == ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });

    setHeaderContent({ ...headerContent, menuItems: updatedMenuItems });
  };

  const handleSubmit = (section) => {
    API.post(`/widget`, {
      widget_type: 'header',
      widget_name: section,
      items: headerContent[section]
    }).then(response => {
      if (response.status === 200) {
        alert(response.data.message);
        setHeaderContent({ ...initialObject }); //resetting the form
      }
    }).catch(err => alert("Something went wrong"));
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Update Site Header</h4>
          </CardHeader>
          <CardBody className="">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Menu Items (Drawer Menu)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2"></h4> */}
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                  </Grid> */}
                  <Grid item xs={12} sm={8}>
                    <MaterialButton
                      variant="outlined"
                      component="span"
                      className={"mb-3"}
                      // size="small"
                      color="primary"
                      onClick={() => setHeaderContent({ ...headerContent, menuItems: [...headerContent.menuItems, { text: '', address: '', id: headerContent.menuItems.length + 1, order: headerContent.menuItems.length + 1 }] })}
                    >
                      Add a New Link
                  </MaterialButton>
                    <Grid container spacing={2}>
                      {
                        headerContent?.menuItems?.sort((a, b) => a.order - b.order).map((x, index) => (
                          <React.Fragment>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                required
                                id={`text${x.id}`}
                                name="text"
                                label="Link Text"
                                value={x.text}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => handleMenuItemChange(e, index)}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                required
                                id={`address${x.id}`}
                                name="address"
                                label="Link Address"
                                value={x.address}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => handleMenuItemChange(e, index)}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <MaterialButton onClick={() => setHeaderContent({ ...headerContent, menuItems: headerContent.menuItems.filter(z => z.id !== x.id) })} color="secondary" size="small" variant="outlined" style={{ height: '100%' }}>
                                Delete Link
                              </MaterialButton>
                            </Grid>
                          </React.Fragment>
                        ))
                      }
                      <Grid item xs={12}>
                        <MaterialButton disabled={headerContent.menuItems?.length < 1} onClick={() => handleSubmit("menuItems")} color="primary" variant="contained">
                          Update Section
                        </MaterialButton>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <p>Drag and Drop the items to Re-Arrange the order</p>
                    {
                      headerContent.menuItems?.length > 0 ?

                        <Paper>
                          <List component="nav" aria-label="main mailbox folders">
                            {
                              headerContent?.menuItems?.sort((a, b) => a.order - b.order).map(x => (
                                <ListItem style={{ borderBottom: '1px solid #ddd', zIndex: 9999 }} button id={x.id} draggable onDragStart={handleDrag} onDrop={handleDrop} onDragOver={(ev) => ev.preventDefault()} >
                                  <ListItemText primary={x.text} />
                                </ListItem>
                              ))
                            }
                          </List>
                        </Paper>
                        :
                        <em>No items added yet</em>
                    }
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
                <Typography className={classes.heading}>Header Contact Links</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2"></h4> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      value={headerContent.contact.phone}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="email"
                      name="email"
                      label="Email Address"
                      value={headerContent.contact.email}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="address"
                      name="address"
                      label="Location"
                      value={headerContent.contact.address}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit("contact")} color="primary" variant="contained">
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
