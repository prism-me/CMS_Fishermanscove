import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import MaterialButton from "@material-ui/core/Button";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, CardMedia, CardActionArea, CardContent, CardActions } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Delete, DeleteOutlined, Image } from "@material-ui/icons";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from "react-router-dom";
import API from "utils/http";
import FAQSection from "../Common/FAQSection";

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
  })

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        const intro = data.find(x => x.section_slug === "intro")
        const faq = data.find(x => x.section_slug === "faq")
        if (faq && faq.section_content) {
          faq.section_content = JSON.parse(faq.section_content);
        }
        setWedding(
          {
            intro: intro || wedding.intro,
            faq: faq || wedding.faq,
          }
        )
      }
    })
  }, [])
  const handleInputChange = (e, section) => {
    let updatedDiningInner = { ...wedding };
    updatedDiningInner[section][e.target.name] = e.target.value;
    setWedding(updatedDiningInner);
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
    </div>
  );
}
