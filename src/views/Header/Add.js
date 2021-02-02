import React, { Fragment, Suspense, useState } from "react";
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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

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
  const [open, setOpen] = React.useState(false);
  const [dining, setDining] = useState({
    post_name: '',
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    room_type: -1,
    category_id: -1,
    thumbnail: '',
    alt_text: '',
    meta_title: '',
    meta_description: '',
    schema_markup: '',
    permalink: '',
    is_followed: true,
    is_indexed: true
  })
  const [dragId, setDragId] = useState();

  const [headerContent, setHeaderContent] = useState({
    first: {
      description: ''
    },
    menuItems: [
      {
        id: 1,
        text: 'About Us',
        address: '/about-us',
        order: 1
      },
      {
        id: 2,
        text: 'Rooms & Suites',
        address: '/room-suites',
        order: 2
      },
      {
        id: 3,
        text: 'Dining',
        address: '/dining',
        order: 3
      },
    ],
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
  })


  const handleInputChange = (e) => {
    let updatedDining = { ...dining };
    updatedDining[e.target.name] = e.target.value;
    setDining(updatedDining);
  }

  const handleFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    createImage(files[0]);
  }

  const createImage = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      setDining({ ...dining, thumbnail: e.target.result })
    };
    reader.readAsDataURL(file);
  }

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    debugger;
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

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Update Site Header</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          {/* <h5 className="pl-4 mt-3 mb-0" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>Show/Hide Preview</h5> */}

          {/* <MaterialButton
            variant="outlined"
            component="span"
            className="m-3"
            size="small"
            color="primary"
            style={{ width: '150px' }}
            onClick={() => setOpen(!open)}
          >
            Show/Hide Preview
          </MaterialButton> */}
          {/* <Collapse in={open} timeout="auto" unmountOnExit>
            <FooterPreview />
          </Collapse> */}
          <CardBody className="pt-0">
            <h3>Menu Items (Drawer Menu)</h3>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MaterialButton
                  variant="contained"
                  component="span"
                  className={classes.button}
                  size="small"
                  color="primary"
                  onClick={() => setHeaderContent({ ...headerContent, menuItems: [...headerContent.menuItems, { text: '', address: '', id: headerContent.menuItems + 1, order: headerContent.menuItems + 1 }] })}
                >
                  Add a New Link
                </MaterialButton>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={3}>
                  {
                    headerContent?.menuItems?.map(x => (
                      <React.Fragment>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            required
                            id="post_name"
                            name="post_name"
                            label="Link Text"
                            value={x.text}
                            variant="outlined"
                            fullWidth
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            required
                            id="post_name"
                            name="post_name"
                            label="Link Address"
                            value={x.address}
                            variant="outlined"
                            fullWidth
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <MaterialButton color="secondary" size="small" variant="outlined" style={{ height: '100%' }}>
                            Delete Link
                      </MaterialButton>
                        </Grid>
                      </React.Fragment>
                    ))
                  }
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4}>
                <p>Drag and Drop the items to Re-Arrange the order</p>
                <Paper>
                  <List component="nav" aria-label="main mailbox folders">
                    {
                      headerContent?.menuItems?.sort((a, b) => a.order - b.order).map(x => (
                        <ListItem style={{ borderBottom: '1px solid #ddd' }} button id={x.id} draggable onDragStart={handleDrag} onDrop={handleDrop} onDragOver={(ev) => ev.preventDefault()} >
                          <ListItemText primary={x.text} />
                        </ListItem>
                      ))
                    }
                  </List>
                </Paper>
              </Grid>
            </Grid>
            <h3>Header Contact Links</h3>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="meta_title"
                  name="meta_title"
                  label="Phone Number"
                  value={dining.meta_title}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="meta_description"
                  name="meta_description"
                  label="Email Address"
                  value={dining.meta_description}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="schema_markup"
                  name="schema_markup"
                  label="Location"
                  value={dining.schema_markup}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
