import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import MaterialButton from '@material-ui/core/Button';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import { TextField, Paper } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
    menuId: null,
    contactId: null,
    contact: {
      phone: '',
      email: '',
      address: ''
    }
  }
  const [dragId, setDragId] = useState();
  const [headerContent, setHeaderContent] = useState({ ...initialObject })
  const [pages, setPages] = useState([])
  const [pagesFilter, setPagesFilter] = useState([])

  useEffect(() => {
    async function getData() {

      let menuItems = await getWidgetData();

      API.get('/pages').then(response => {
        setPages(response.data);
        let filteredArray = response.data?.filter(function (array_el) {
          return menuItems.filter(function (menuItems_el) {
            return menuItems_el.text == array_el.post_name;
          }).length == 0
        });
        setPagesFilter(filteredArray)
        // })

      })
    }
    getData();
  }, [])

  const getWidgetData = async () => {
    const response = await API.get('/get_widgets/header');
    if (response.status === 200) {
      const { data } = response;
      const menuItems = data.find(x => x.widget_name === "menuItems");
      const contact = data.find(x => x.widget_name === "contact");
      setHeaderContent({
        menuItems: menuItems ? JSON.parse(menuItems?.items) : initialObject.menuItems,
        menuId: menuItems ? menuItems.id : initialObject.menuId,
        contact: contact ? JSON.parse(contact?.items) : initialObject.contact,
        contactId: contact ? contact.id : initialObject.contactId,
      })
      return menuItems ? JSON.parse(menuItems?.items) : initialObject.menuItems;
    } else {
      return [];
    }
    // });
  }

  const handleMenuItemChange = (e, index, inner_route) => {
    let updatedItems = [...headerContent.menuItems];
    updatedItems[index][e.target.name] = e.target.value;
    updatedItems[index]["inner_route"] = inner_route;
    setHeaderContent({ ...headerContent, menuItems: updatedItems });
    // setPagesFilter(pagesFilter.filter(x => x.post_name !== e.target.value))
  }

  const handleContactItemChange = (e) => {
    let updatedContact = { ...headerContent.contact };
    updatedContact[e.target.name] = e.target.value;
    setHeaderContent({ ...headerContent, contact: updatedContact });
  }

  const addNewLink = () => {
    if (headerContent.menuItems?.length > 0) {
      setPagesFilter(pagesFilter.filter(x => x.post_name !== headerContent.menuItems[headerContent.menuItems.length - 1]?.text))
    }
    setHeaderContent({ ...headerContent, menuItems: [...headerContent.menuItems, { text: '', address: '', temp_id: headerContent.menuItems.length + 1, order: headerContent.menuItems.length + 1, inner_route: "" }] })
  }

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    const dragBox = headerContent.menuItems.find((box) => box.temp_id == dragId);
    const dropBox = headerContent.menuItems.find((box) => box.temp_id == ev.currentTarget.id);

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const updatedMenuItems = headerContent.menuItems.map((box) => {
      if (box.temp_id == dragId) {
        box.order = dropBoxOrder;
      }
      if (box.temp_id == ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });

    setHeaderContent({ ...headerContent, menuItems: updatedMenuItems });
  };

  const handleSubmit = (section) => {
    let updatedHeaderContent = { ...headerContent, menuItems: headerContent.menuItems.filter(x => x.text !== "") };
    let id = section === "menuItems" ? updatedHeaderContent.menuId : updatedHeaderContent.contactId;
    API[id ? "put" : "post"](id ? `/widget/${id}` : `/widget`, {
      widget_type: 'header',
      widget_name: section,
      items: updatedHeaderContent[section]
    }).then(response => {
      if (response.status === 200) {
        alert(response.data.message);
        // window.location.reload();
        // setHeaderContent({ ...initialObject }); //resetting the form
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

                    <Grid container spacing={2}>
                      {
                        headerContent?.menuItems?.sort((a, b) => a.order - b.order).map((x, index) => (
                          <React.Fragment key={x.temp_id}>
                            <Grid item xs={12} sm={4}>
                              {
                                pages?.length > 0 &&
                                <Autocomplete
                                  id={`text${x.temp_id}`}
                                  name="text"
                                  options={pagesFilter}
                                  size="small"
                                  value={pages.find(p => p.post_name?.toLowerCase() === x.text?.toLowerCase()) || { post_name: "" }}
                                  onChange={(e, newValue) => handleMenuItemChange({ target: { value: newValue?.post_name, name: 'text' } }, index, pages.find(p => p.post_name?.toLowerCase() === newValue?.post_name?.toLowerCase())?.inner_route) || ""}
                                  getOptionLabel={(option) => option.post_name}
                                  // style={{ width: 300 }}
                                  renderInput={(params) => <TextField required {...params} label="Select Link Text" variant="outlined" />}
                                />
                              }
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                required
                                id={`address${x.temp_id}`}
                                name="address"
                                label="URL"
                                value={pages.find(p => p.post_name?.toLowerCase() === x.text?.toLowerCase())?.route || ""}
                                variant="outlined"
                                fullWidth
                                disabled
                                onChange={(e) => handleMenuItemChange(e, index)}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <MaterialButton onClick={() => setHeaderContent({ ...headerContent, menuItems: headerContent.menuItems.filter(z => z.temp_id !== x.temp_id) })} color="secondary" size="small" variant="outlined" style={{ height: '100%' }}>
                                Delete Link
                              </MaterialButton>
                            </Grid>
                          </React.Fragment>
                        ))
                      }

                      <Grid item xs={12}>
                        <MaterialButton
                          variant="outlined"
                          component="span"
                          className={"mb-3"}
                          // size="small"
                          color="primary"
                          onClick={addNewLink}
                        >
                          Add a New Link
                        </MaterialButton>
                      </Grid>
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
                                <ListItem key={x.text} style={{ borderBottom: '1px solid #ddd', zIndex: 9999 }} button id={x.temp_id} draggable onDragStart={handleDrag} onDrop={handleDrop} onDragOver={(ev) => ev.preventDefault()} >
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
