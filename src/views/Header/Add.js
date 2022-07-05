import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import MaterialButton from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import { TextField, Paper } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
// import API from "utils/http";
import API from "langapi/http";
import {
  AddCircleOutline,
  CloseOutlined,
  DragHandleOutlined,
} from "@material-ui/icons";
import { Select, MenuItem, FormControl } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";

const append_url_dining = "dining";
const append_url_room = "rooms";

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

export default function UpdateHeader() {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const initialObject = {
    menuItems: [],
    menuId: null,
    contactId: null,
    type: "header",
    contact: {
      phone: "",
      email: "",
      address: "",
      whatsapp: "",
    },
  };

  const [dragId, setDragId] = useState();
  const [submenuDragId, setSubmenuDragId] = useState();
  const [headerContent, setHeaderContent] = useState({ ...initialObject });
  const [pages, setPages] = useState([]);
  const [pagesFilter, setPagesFilter] = useState([]);
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {

    // API.get(`/pages?lang=${selectedLang}`).then((response) => {
    API.get(`/drop-down`).then((response) => {

      let a = []
      if (response?.data?.data?.length > 0) {
        // response.data.data.forEach(element => {
        let pages = []
        response.data.data[1].forEach(element => {
          let obj = { ...element }
          obj.name = obj.post_name
          obj.name_de = obj.name_de || ""
          obj.name_fr = obj.name_fr || ""
          obj.name_ru = obj.name_ru || ""
          obj.base_url = "dining"
          pages.push(obj)
        });
        response.data.data[0].forEach(element => {
          let obj = { ...element }
          obj.name = obj.post_name
          obj.name_de = obj.name_de || ""
          obj.name_fr = obj.name_fr || ""
          obj.name_ru = obj.name_ru || ""
          obj.base_url = "rooms"
          pages.push(obj)
        });

        a = [...response?.data?.data[2], ...pages]
        console.log(a, "element")
        setPages(a);
      }
      setPagesFilter(a);
    });

    // // let filteredArray = response.data?.data?.filter(function (array_el) {
    // //   return (
    // //     menuItems.filter(function (menuItems_el) {
    // //       return menuItems_el.text == array_el.name;
    // //     }).length == 0
    // //   );
    // // });

    // });
    // }
  }, []);

  useEffect(() => {

    API.get(`/common?lang=${selectedLang}`).then(response => {

      const contactdata = response?.data?.data.find((x) => x.type === "header");
      if (contactdata) {
        setHeaderContent(contactdata);
      } else {
        setHeaderContent(initialObject)
      }


    });

  }, [selectedLang]);

  const handleChange = (event) => {
    if (event.target.value != selectedLang) {
      setSelectedLang(event.target.value)
    }
  };

  const handleMenuItemChange = (e, slug, index) => {
    let updatedItems = [...headerContent.menuItems];
    updatedItems[index][e.target.name] = e.target.value;
    updatedItems[index]["slug"] = slug;
    setHeaderContent({ ...headerContent, menuItems: updatedItems });
    // setPagesFilter(pagesFilter.filter(x => x.name !== e.target.value))
  };

  const handleSubMenuItemChange = (e, slug, index, ind, base_url) => {
    // eslint-disable-next-line no-debugger
    // debugger;
    let updatedHeaderContent = { ...headerContent };
    let updatedSubMenu = [...updatedHeaderContent.menuItems[index].subMenu];

    if (updatedSubMenu.find((x) => x.text === e.target.value)?.text) {
      alert("Submenu item already added. Please select different");
      return;
    }

    updatedSubMenu[ind][e.target.name] = e.target.value;
    updatedSubMenu[ind]["slug"] = slug;
    updatedSubMenu[ind]["base_url"] = base_url;
    // if()

    updatedHeaderContent.menuItems[index].subMenu = updatedSubMenu;
    setHeaderContent(updatedHeaderContent);
    // setPagesFilter(pagesFilter.filter(x => x.name !== e.target.value))
  };

  const handleContactItemChange = (e) => {
    let updatedContact = { ...headerContent.contact };
    updatedContact[e.target.name] = e.target.value;
    setHeaderContent({ ...headerContent, contact: updatedContact });
  };

  const addNewLink = () => {
    if (headerContent?.menuItems?.length > 0) {
      setPagesFilter(
        pagesFilter.filter(
          (x) =>
            x.name !==
            headerContent?.menuItems[headerContent?.menuItems?.length - 1]?.text
        )
      );
    }

    if (!headerContent.menuItems.length > 0) {
      let newObj = { ...headerContent }
      let data = {
        text: "",
        address: "",
        temp_id:
          headerContent?.menuItems[headerContent?.menuItems?.length - 1].order +
          1,
        order:
          headerContent?.menuItems[headerContent?.menuItems?.length - 1].order +
          1,
        slug: "",
      }
      newObj.menuItems.push(data)
      setHeaderContent(newObj)
    } else {
      setHeaderContent({
        ...headerContent,
        menuItems: [
          ...headerContent?.menuItems,
          {
            text: "",
            address: "",
            temp_id:
              headerContent?.menuItems[headerContent?.menuItems?.length - 1].order +
              1,
            order:
              headerContent?.menuItems[headerContent?.menuItems?.length - 1].order +
              1,
            slug: "",
          },
        ],
      });
    }
  };

  const addSubmenu = (index) => {
    setHeaderContent({
      ...headerContent,
      menuItems: [
        ...headerContent.menuItems,
        {
          text: "",
          address: "",
          temp_id: headerContent.menuItems.length + 1,
          order: headerContent.menuItems.length + 1,
          slug: "",
        },
      ],
    });

    let updatedHeaderContent = { ...headerContent };

    let subMenu = updatedHeaderContent.menuItems[index].subMenu || [];

    updatedHeaderContent.menuItems[index].subMenu = [
      ...subMenu,
      {
        text: "",
        address: "",
        base_url: "",
        temp_id: subMenu.length + 1,
        order: subMenu.length + 1,
        slug: "",
      },
    ];

    setHeaderContent(updatedHeaderContent);
  };

  const deleteSubmenuLink = (index, ind) => {
    let updatedHeaderContent = { ...headerContent };
    let updatedSubMenu = updatedHeaderContent.menuItems[index].subMenu?.filter(
      (x, i) => i !== ind
    );
    updatedHeaderContent.menuItems[index].subMenu = updatedSubMenu;
    setHeaderContent(updatedHeaderContent);
  };

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    const dragBox = headerContent.menuItems.find(
      (box) => box.temp_id == dragId
    );
    const dropBox = headerContent.menuItems.find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    if (dragBoxOrder == dropBoxOrder) {
      return;
    }

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

  const handleSubMenuDrag = (ev) => {
    setSubmenuDragId(ev.currentTarget.id);
  };

  const handleSubMenuDrop = (ev, index) => {
    const dragBox = headerContent.menuItems[index]?.subMenu?.find(
      (box) => box.temp_id == submenuDragId
    );
    const dropBox = headerContent.menuItems[index]?.subMenu?.find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const updatedSubMenuItems = headerContent.menuItems[index]?.subMenu?.map(
      (box) => {
        if (box.temp_id == submenuDragId) {
          box.order = dropBoxOrder;
        }
        if (box.temp_id == ev.currentTarget.id) {
          box.order = dragBoxOrder;
        }
        return box;
      }
    );
    let updatedHeaderContent = { ...headerContent };
    updatedHeaderContent.menuItems[index].subMenu = updatedSubMenuItems;

    setHeaderContent(updatedHeaderContent);
  };

  const handleSubmit = () => {

    let updatedHeaderContent = { ...headerContent };

    API.post(`/common?lang=${selectedLang}`, updatedHeaderContent).then(response => {
      if (response.status === 200) {
        alert("Section updated successfully !");
      }
    }).catch(err => console.log(err))

  };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4 className="mb-0">Update Site Header</h4>
            <FormControl
              variant="outlined"
              size="small"
              style={{ width: "20%" }}
            >

              <InputLabel
                id="language"
                style={{ color: "white" }}
              >Select Language</InputLabel>

              <Select
                labelId="language"
                id="language"
                name="language"
                value={selectedLang}
                label="Select Language"
                fullWidth
                onChange={handleChange}
                style={{ color: "white" }}
              >

                <MenuItem value={'en'}>En</MenuItem>
                <MenuItem value={'fr'}>FR</MenuItem>
                <MenuItem value={'de'}>DE</MenuItem>
                <MenuItem value={'ru'}>RU</MenuItem>

              </Select>

            </FormControl>
          </CardHeader>
          <CardBody className="">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Menu Items (Drawer Menu)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2"></h4> */}
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <Grid container spacing={2}>
                      {headerContent?.menuItems
                        ?.sort((a, b) => a.order - b.order)
                        .map((x, index) => (
                          <React.Fragment key={x.temp_id}>
                            <Grid item xs={12} sm={12}>
                              <Paper
                                className="px-2 py-3 header-menu-list-item"
                                key={x.temp_id}
                                id={x.temp_id}
                                draggable
                                onDragStart={handleDrag}
                                onDrop={handleDrop}
                                onDragOver={(ev) => ev.preventDefault()}
                              >
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={1}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <DragHandleOutlined
                                      style={{ cursor: "pointer" }}
                                      color="disabled"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={4}>
                                    {pages?.length > 0 && (
                                      <>
                                        {selectedLang == 'en' &&
                                          <Autocomplete
                                            id={`text${x.temp_id}`}
                                            name="text"
                                            options={pagesFilter}
                                            size="small"
                                            value={
                                              pages.find(
                                                (p) =>
                                                  p.name?.toLowerCase() ===
                                                  x.text?.toLowerCase()
                                              ) || { name: "" }
                                            }
                                            onChange={(e, newValue) =>
                                              handleMenuItemChange(
                                                {
                                                  target: {
                                                    value: newValue?.name,
                                                    name: "text",
                                                  },
                                                },
                                                newValue?.slug,
                                                index,
                                                pages.find(
                                                  (p) =>
                                                    p.name?.toLowerCase() ===
                                                    newValue?.name?.toLowerCase()
                                                )?.slug
                                              ) || ""
                                            }
                                            getOptionLabel={(option) =>
                                              option.name
                                            }
                                            // style={{ width: 300 }}
                                            renderInput={(params) => (
                                              <TextField
                                                required
                                                {...params}
                                                label="Select Link Text"
                                                variant="outlined"
                                              />
                                            )}
                                          />
                                        }
                                        {
                                          selectedLang == 'de' &&
                                          <Autocomplete
                                            id={`text${x.temp_id}`}
                                            name="text"
                                            options={pagesFilter}
                                            size="small"
                                            value={
                                              pages.find(
                                                (p) =>
                                                  p.name_de?.toLowerCase() ===
                                                  x.text?.toLowerCase()
                                              ) || { name_de: "" }
                                            }
                                            onChange={(e, newValue) =>

                                              // handleMenuItemChange(
                                              //   {
                                              //     target: {
                                              //       value: newValue?.name_de,
                                              //       name: "text",
                                              //     },
                                              //   },
                                              //   newValue?.slug,
                                              //   index,
                                              //   pages.find(
                                              //     (p) =>
                                              //       p.name_de?.toLowerCase() ===
                                              //       newValue?.name?.toLowerCase()
                                              //   )?.slug
                                              // ) || ""
                                              console.log("e, newValue", e, newValue)

                                            }
                                            getOptionLabel={(option) =>
                                              option.name_de
                                            }
                                            // style={{ width: 300 }}
                                            renderInput={(params) => (
                                              <TextField
                                                required
                                                {...params}
                                                label="Select Link Text"
                                                variant="outlined"
                                              />
                                            )}
                                          />
                                        }

                                        {
                                          selectedLang == 'fr' &&
                                          <Autocomplete
                                            id={`text${x.temp_id}`}
                                            name="text"
                                            options={pagesFilter}
                                            size="small"
                                            value={
                                              pages.find(
                                                (p) =>
                                                  p.name_fr?.toLowerCase() ===
                                                  x.text?.toLowerCase()
                                              ) || { name_fr: "" }
                                            }
                                            onChange={(e, newValue) =>
                                              handleMenuItemChange(
                                                {
                                                  target: {
                                                    value: newValue?.name_fr,
                                                    name: "text",
                                                  },
                                                },
                                                newValue?.slug,
                                                index,
                                                pages.find(
                                                  (p) =>
                                                    p.name_fr?.toLowerCase() ===
                                                    newValue?.name?.toLowerCase()
                                                )?.slug
                                              ) || ""
                                            }
                                            getOptionLabel={(option) =>
                                              option.name_fr
                                            }
                                            // style={{ width: 300 }}
                                            renderInput={(params) => (
                                              <TextField
                                                required
                                                {...params}
                                                label="Select Link Text"
                                                variant="outlined"
                                              />
                                            )}
                                          />
                                        }

                                      </>
                                    )}

                                    {
                                      selectedLang == 'ru' &&
                                      <Autocomplete
                                        id={`text${x.temp_id}`}
                                        name="text"
                                        options={pagesFilter}
                                        size="small"
                                        value={
                                          pages.find(
                                            (p) =>
                                              p.name_ru?.toLowerCase() ===
                                              x.text?.toLowerCase()
                                          ) || { name_ru: "" }
                                        }
                                        onChange={(e, newValue) =>
                                          handleMenuItemChange(
                                            {
                                              target: {
                                                value: newValue?.name_ru,
                                                name: "text",
                                              },
                                            },
                                            newValue?.slug,
                                            index,
                                            pages.find(
                                              (p) =>
                                                p.name_ru?.toLowerCase() ===
                                                newValue?.name?.toLowerCase()
                                            )?.slug
                                          ) || ""
                                        }
                                        getOptionLabel={(option) =>
                                          option.name_ru
                                        }
                                        // style={{ width: 300 }}
                                        renderInput={(params) => (
                                          <TextField
                                            required
                                            {...params}
                                            label="Select Link Text"
                                            variant="outlined"
                                          />
                                        )}
                                      />
                                    }
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <TextField
                                      required
                                      id={`address${x.temp_id}`}
                                      name="address"
                                      label="URL"
                                      value={
                                        selectedLang === "en" ?

                                          pages?.find(
                                            (p) =>
                                              p.name?.toLowerCase() ===
                                              x.text?.toLowerCase()
                                          )?.slug || ""
                                          :
                                          selectedLang === "fr" ?
                                            pages?.find(
                                              (p) =>
                                                p.name_fr?.toLowerCase() ===
                                                x.text?.toLowerCase()
                                            )?.slug || ""
                                            :
                                            selectedLang === "de" ?
                                              pages?.find(
                                                (p) =>
                                                  p.name_de?.toLowerCase() ===
                                                  x.text?.toLowerCase()
                                              )?.slug || ""
                                              :
                                              selectedLang === "ru" ?
                                                pages?.find(
                                                  (p) =>
                                                    p.name_ru?.toLowerCase() ===
                                                    x.text?.toLowerCase()
                                                )?.slug || ""
                                                : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                      onChange={(e) =>
                                        handleMenuItemChange(e, index)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={2}>
                                    <MaterialButton
                                      onClick={() =>
                                        setHeaderContent({
                                          ...headerContent,
                                          menuItems: headerContent.menuItems.filter(
                                            (z) => z.temp_id !== x.temp_id
                                          ),
                                        })
                                      }
                                      color="secondary"
                                      size="small"
                                      variant="outlined"
                                      style={{ height: "100%" }}
                                    >
                                      Delete Link
                                    </MaterialButton>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    sm={1}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <AddCircleOutline
                                      style={{ cursor: "pointer" }}
                                      titleAccess="Add submenu"
                                      onClick={() => addSubmenu(index)}
                                      color="primary"
                                    />
                                  </Grid>
                                </Grid>

                                {/* ************************* */}
                                {/* SUBMENU LOGIC STARTS HERE */}
                                {/* ************************* */}
                                <div
                                  className={
                                    x.subMenu?.length > 0 ? "" : "d-none"
                                  }
                                  style={{
                                    border: "1px dashed #3f50b5",
                                    borderRadius: "4px",
                                    margin: "1rem 0",
                                    padding: "1rem",
                                  }}
                                >
                                  <Typography color="primary" variant="caption">
                                    SUBMENU
                                  </Typography>
                                  {x.subMenu
                                    ?.sort((a, b) => a.order - b.order)
                                    .map((y, ind) => (
                                      <Paper
                                        className="px-2 py-2 mt-2 header-menu-list-item"
                                        key={y.temp_id}
                                        id={y.temp_id}
                                        draggable
                                        onDragStart={handleSubMenuDrag}
                                        onDrop={(ev) =>
                                          handleSubMenuDrop(ev, index)
                                        }
                                        onDragOver={(ev) => ev.preventDefault()}
                                      >
                                        <Grid container spacing={1}>
                                          <Grid
                                            item
                                            xs={12}
                                            sm={1}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          ></Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            sm={1}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <DragHandleOutlined
                                              style={{ cursor: "pointer" }}
                                              color="disabled"
                                            />
                                          </Grid>

                                          <Grid item xs={12} sm={4}>
                                            {pages?.length > 0 && (
                                              <>
                                                {selectedLang == 'en' &&
                                                  <Autocomplete
                                                    id={`text${y.temp_id}`}
                                                    name="text"
                                                    options={pages}
                                                    size="small"
                                                    value={
                                                      pages.find(
                                                        (p) =>
                                                          p.name?.toLowerCase() ===
                                                          y.text?.toLowerCase()
                                                      ) || { name: "" }
                                                    }
                                                    onChange={(e, newValue) =>

                                                      handleSubMenuItemChange(
                                                        {
                                                          target: {
                                                            value:
                                                              newValue?.name,
                                                            name: "text",
                                                          },
                                                        },
                                                        newValue?.slug,
                                                        index,
                                                        ind,
                                                        newValue?.base_url || "",
                                                        pages.find(
                                                          (p) =>
                                                            p.name?.toLowerCase() ===
                                                            newValue?.name?.toLowerCase()
                                                        )?.slug
                                                      ) || ""
                                                    }
                                                    getOptionLabel={(option) =>
                                                      option.name
                                                    }
                                                    // style={{ width: 300 }}
                                                    renderInput={(params) => (
                                                      <TextField
                                                        required
                                                        {...params}
                                                        label="Select Link Text"
                                                        variant="outlined"
                                                      />
                                                    )}
                                                  />
                                                }
                                                {selectedLang == 'fr' &&
                                                  <Autocomplete
                                                    id={`text${y.temp_id}`}
                                                    name="text"
                                                    options={pages}
                                                    size="small"
                                                    value={
                                                      pages.find(
                                                        (p) =>
                                                          p.name_fr?.toLowerCase() ===
                                                          y.text?.toLowerCase()
                                                      ) || { name_fr: "" }
                                                    }
                                                    // onChange={(e, newValue) =>
                                                    //   handleSubMenuItemChange(
                                                    //     {
                                                    //       target: {
                                                    //         value:
                                                    //           newValue?.name_fr,
                                                    //         name: "text",
                                                    //       },
                                                    //     },
                                                    //     newValue.slug,
                                                    //     index,
                                                    //     ind,
                                                    //     newValue.base_url || "",
                                                    //     pages.find(
                                                    //       (p) =>
                                                    //         p.name_fr?.toLowerCase() ===
                                                    //         newValue?.name?.toLowerCase()
                                                    //     )?.slug
                                                    //   ) || ""
                                                    // }
                                                    onChange={(e, newValue) =>
                                                      handleSubMenuItemChange(
                                                        {
                                                          target: {
                                                            value: newValue?.name_fr,
                                                            name: "text",
                                                          },
                                                        },
                                                        newValue?.slug,
                                                        index,
                                                        ind,
                                                        newValue?.base_url || "",
                                                        pages.find(
                                                          (p) =>
                                                            p.name_fr?.toLowerCase() ===
                                                            newValue?.name?.toLowerCase()
                                                        )?.slug
                                                      ) || ""
                                                    }
                                                    getOptionLabel={(option) =>
                                                      option?.name_fr
                                                    }
                                                    // style={{ width: 300 }}
                                                    renderInput={(params) => (
                                                      <TextField
                                                        required
                                                        {...params}
                                                        label="Select Link Text"
                                                        variant="outlined"
                                                      />
                                                    )}
                                                  />
                                                }
                                                {selectedLang == 'de' &&
                                                  <Autocomplete
                                                    id={`text${y.temp_id}`}
                                                    name="text"
                                                    options={pages}
                                                    size="small"
                                                    value={
                                                      pages.find(
                                                        (p) =>
                                                          p?.name_de?.toLowerCase() ===
                                                          y.text?.toLowerCase()
                                                      ) || { name_de: "" }
                                                    }
                                                    onChange={(e, newValue) =>
                                                      handleSubMenuItemChange(
                                                        {
                                                          target: {
                                                            value:
                                                              newValue?.name_de,
                                                            name: "text",
                                                          },
                                                        },
                                                        newValue?.slug,
                                                        index,
                                                        ind,
                                                        newValue?.base_url || "",
                                                        pages.find(
                                                          (p) =>
                                                            p.name_de?.toLowerCase() ===
                                                            newValue?.name?.toLowerCase()
                                                        )?.slug
                                                      ) || ""
                                                    }
                                                    getOptionLabel={(option) =>
                                                      option?.name_de
                                                    }
                                                    // style={{ width: 300 }}
                                                    renderInput={(params) => (
                                                      <TextField
                                                        required
                                                        {...params}
                                                        label="Select Link Text"
                                                        variant="outlined"
                                                      />
                                                    )}
                                                  />
                                                }
                                                {selectedLang == 'ru' &&
                                                  <Autocomplete
                                                    id={`text${y.temp_id}`}
                                                    name="text"
                                                    options={pages}
                                                    size="small"
                                                    value={
                                                      pages.find(
                                                        (p) =>
                                                          p?.name_ru?.toLowerCase() ===
                                                          y.text?.toLowerCase()
                                                      ) || { name_ru: "" }
                                                    }
                                                    onChange={(e, newValue) =>
                                                      handleSubMenuItemChange(
                                                        {
                                                          target: {
                                                            value:
                                                              newValue?.name_ru,
                                                            name: "text",
                                                          },
                                                        },
                                                        newValue?.slug,
                                                        index,
                                                        ind,
                                                        newValue?.base_url || "",
                                                        pages.find(
                                                          (p) =>
                                                            p.name_ru?.toLowerCase() ===
                                                            newValue?.name?.toLowerCase()
                                                        )?.slug
                                                      ) || ""
                                                    }
                                                    getOptionLabel={(option) =>
                                                      option?.name_ru
                                                    }
                                                    // style={{ width: 300 }}
                                                    renderInput={(params) => (
                                                      <TextField
                                                        required
                                                        {...params}
                                                        label="Select Link Text"
                                                        variant="outlined"
                                                      />
                                                    )}
                                                  />
                                                }
                                              </>
                                            )}
                                          </Grid>
                                          <Grid item xs={12} sm={4}>
                                            <TextField
                                              required
                                              id={`address${y.temp_id}`}
                                              name="address"
                                              label="URL"
                                              value={
                                                selectedLang === "en" ?
                                                  pages?.find(
                                                    (p) =>
                                                      p.name?.toLowerCase() ===
                                                      y.text?.toLowerCase()
                                                  )?.slug || ""
                                                  :
                                                  selectedLang === "fr" ?
                                                    pages?.find(
                                                      (p) =>
                                                        p.name_fr?.toLowerCase() ===
                                                        y.text?.toLowerCase()
                                                    )?.slug || ""
                                                    :
                                                    selectedLang === "de" ?
                                                      pages?.find(
                                                        (p) =>
                                                          p.name_de?.toLowerCase() ===
                                                          y.text?.toLowerCase()
                                                      )?.slug || ""
                                                      :
                                                      selectedLang === "ru" ?
                                                        pages?.find(
                                                          (p) =>
                                                            p.name_ru?.toLowerCase() ===
                                                            y.text?.toLowerCase()
                                                        )?.slug || ""
                                                        : ""
                                              }
                                              variant="outlined"
                                              fullWidth
                                              disabled
                                              onChange={(e) =>
                                                handleSubMenuItemChange(e, ind)
                                              }
                                              size="small"
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            sm={1}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <CloseOutlined
                                              onClick={() =>
                                                deleteSubmenuLink(index, ind)
                                              }
                                              color="secondary"
                                              fontSize="small"
                                              variant="outlined"
                                              style={{ cursor: "pointer" }}
                                            />
                                          </Grid>

                                          {/* <Grid item xs={12} sm={1} style={{ display: 'flex', alignItems: 'center' }}>
                                        <AddCircleOutline style={{ cursor: 'pointer' }} onClick={() => addSubmenu(ind)} color="primary" />
                                      </Grid> */}
                                        </Grid>
                                      </Paper>
                                    ))}
                                </div>
                                {/* ************************* */}
                                {/* SUBMENU LOGIC ENDS HERE */}
                                {/* ************************* */}
                              </Paper>
                            </Grid>
                          </React.Fragment>
                        ))}

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
                      {/* <Grid
                        item
                        xs={12}
                        style={{
                          alignItems: "flex-end",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <MaterialButton
                          disabled={headerContent.menuItems?.length < 1}
                          onClick={() => handleSubmit("menuItems")}
                          color="primary"
                          variant="contained"
                        >
                          Update Section
                        </MaterialButton>
                      </Grid> */}
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={12} sm={4}>
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
                  </Grid> */}
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
                  Header Contact Links
                </Typography>
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
                      value={headerContent?.contact?.phone}
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
                      value={headerContent?.contact?.email}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="whatsapp"
                      name="whatsapp"
                      label="Whatsapp"
                      value={headerContent?.contact?.whatsapp}
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
                      value={headerContent?.contact?.address}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Grid container spacing={2} style={{ marginTop: '30px' }}>
              <Grid item xs={12} sm={12}>
                <MaterialButton
                  onClick={() => handleSubmit()}
                  color="primary"
                  variant="contained"
                >
                  Update Section
                </MaterialButton>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
