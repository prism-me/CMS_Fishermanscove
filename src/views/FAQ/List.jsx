import { Button, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { AccordionContext, Card } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { useParams } from "react-router-dom";
import API from "utils/http";
import LangAPI from "langapi/http";
import AddFAQDialog from "./AddFAQDialog";
import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  VisibilityOutlined,
} from "@material-ui/icons";
import InputLabel from "@material-ui/core/InputLabel";
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, } from "@material-ui/core";
import { Link } from "react-router-dom";


function ContextAwareToggle({
  children,
  eventKey,
  callback,
  sectionIndex,
  contentIndex,
  handleDelete,
  setShowFAQ,
  setIsEdit,
  faqData,
  setEditFaq
}) {
  const currentEventKey = useContext(AccordionContext);

  // const decoratedOnClick = useAccordionToggle(
  //   eventKey,
  //   () => callback && callback(eventKey),
  // );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div className="d-flex align-items-center justify-content-center">
      <i
        style={{ width: "5%" }}
        className={`pr-4 fa ${isCurrentEventKey ? "fa-minus" : "fa-plus"}`}
      />
      <h6 style={{ padding: "0.5rem 0", marginBottom: 0, width: "90%" }}>
        {children}
      </h6>
      <i
        style={{ width: "5%", color: "#ff0000" }}
        className={`fa fa-trash float-right d-block`}
        onClick={() => handleDelete(sectionIndex)}
      />
      <i
        style={{ width: "5%", color: "#ff0000" }}
        className={`fa fa-pencil float-right d-block`}
        onClick={() => { setShowFAQ(true); setIsEdit(true); setEditFaq(faqData) }}
      />
    </div>
  );
}

const FAQList = (props) => {
  const pageId = parseInt(useParams().id);

  const [faqList, setFaqList] = useState([]);
  const [currentFAQ, setCurrentFAQ] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState({});
  const [faq, setFAQ] = useState({
    id: 0,
    section_name: "",
    section_content: [
      {
        question: "",
        answer: "",
        slug: "",
        page: "",
        innerpage: ""
      },
    ],
    page_id: pageId,
    section_avatar: "",
    section_col_arr: 0,
    section_prior: 1,
    section_avtar_alt: "",
    section_slug: "faq",
  });

  useEffect(() => {
    LangAPI.get(`/faqs?lang=${selectedLang}`)
      .then((response) => {
        if (response.status === 200) {
          setFaqList(response?.data?.data);
        }
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  }, [selectedLang]);

  //faq section methods
  const handleQuestionChange = (e, index) => {
    let section_content = [...faq.section_content];
    section_content[0].question = e.target.value;
    setFAQ({ ...faq, section_content });
  };

  const setEditFaq = (data) => {
    setSelectedFaq(data)

    let section_content = [...faq.section_content];
    section_content[0].question = data.question;
    section_content[0].answer = data.answer;
    section_content[0].slug = data.slug;
    section_content[0].page = data.page;
    section_content[0].innerpage = data.innerpage;

    setFAQ({ ...faq, section_content });

  }

  const handleSlugChange = (e, index) => {
    let section_content = [...faq.section_content];
    section_content[0].slug = e.target.value;
    setFAQ({ ...faq, section_content });
  };
  const handleAnswerChange = (data, index) => {
    let section_content = [...faq.section_content];
    section_content[0].answer = data;
    setFAQ({ ...faq, section_content });
  };
  //end faq section methods

  const handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != selectedLang) {
      setSelectedLang(event.target.value)
    }
  };
  const handleChangePage = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != faq.section_content[0].page) {
      let section_content = [...faq.section_content];
      section_content[0].page = event.target.value;
      setFAQ({ ...faq, section_content });
    }
  };

  const handleChangeInnerPage = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != faq.section_content[0].innerpage) {
      let section_content = [...faq.section_content];
      section_content[0].innerpage = event.target.value;
      setFAQ({ ...faq, section_content });
    }
  };

  const handleDelete = (sectionIndex) => {
    if (window.confirm("Are you sure you want to delete this ?")) {

      LangAPI.delete(`/faqs/${sectionIndex}?lang=${selectedLang}`)
        .then((response) => {
          if (response.status === 200) {

            LangAPI.get(`/faqs?lang=${selectedLang}`).then((response) => {
              if (response.status === 200) {
                setFaqList(response?.data?.data);
                alert("FAQ Deleted Successfully")
              }
            })
              .catch((err) => {
                alert("Something went wrong");
              });
          }
        }).catch((err) => console.log(err));
    }

    // let updatedSectionContent = JSON.parse(updatedFAQ.section_content);
    //deleting index item
    // updatedSectionContent = updatedSectionContent.filter(
    //   (x, i) => i !== contentIndex
    // );
    //replacing section content with modified array
    // updatedFAQ.section_content = updatedSectionContent;

    // API.put(`/add_section/${'updatedFAQ.page_id'}`, 'updatedFAQ')
    //   .then((response) => {
    //     if (response.status === 200) {
    //       alert("FAQ added successfully !");
    //     }
    //   })
    //   .then(() => {
    //     API.get(`/faqs?lang=${selectedLang}`).then((response) => {
    //       if (response.status === 200) {
    //         setFaqList(response.data);
    //       }
    //     });
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleSubmit = () => {
    // let updatedFAQ = faqList[currentFAQ.index];

    //parsing to JSON as the data is stringified
    // let updatedSectionContent = JSON.parse(updatedFAQ.section_content);
    //appending the new item

    faq.section_content[0].lang = selectedLang;
    let faqObj = faq.section_content[0]

    // console.log(faq.section_content[0], "faq.section_content[0]", selectedLang, "selectedLang");
    // updatedSectionContent.push(faq.section_content[0]);
    //replacing section content with modified array
    // updatedFAQ.section_content = updatedSectionContent;

    //extracting current pageId and calling update API
    // API.post(`/add_section`, updatedFAQ)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       alert("FAQ added successfully !");
    //       setShowFAQ(false);
    //       window.location.reload(true);
    //     }
    //   })
    //   .then(() => {
    //     API.get("/faqs").then((response) => {
    //       if (response.status === 200) {
    //         setFaqList(response.data);
    //         window.location.reload(true);
    //       }
    //     });
    //   })
    //   .catch((err) => console.log(err));

    if (!faqObj.page || faqObj.page == "") {
      alert("Please Select FAQ Page")
      return false;
    }
    if (!faqObj.question || faqObj.question == "") {
      alert("Please Select FAQ Title")
      return false;
    }
    if (!faqObj.slug || faqObj.slug == "") {
      alert("Please Add FAQ Slug")
      return false;
    }
    if (!faqObj.answer || faqObj.answer == "") {
      alert("Please Add FAQ Answer")
      return false;
    }

    LangAPI.post(`/faqs?lang=${selectedLang}`, faqObj)
      .then((response) => {
        if (response.status === 200) {
          alert("FAQ Added Successfully")

          let section_content = [
            {
              question: "",
              answer: "",
              slug: "",
              page: "",
              innerpage: ""
            },
          ]

          LangAPI.get(`/faqs?lang=${selectedLang}`)
            .then((response) => {
              if (response.status === 200) {
                setFaqList(response?.data?.data);
                setFAQ({ ...faq, section_content });
                setShowFAQ(false)
              }
            })
        }
      })
  };

  return (
    <div className="faq-section-block my-3 my-sm-4">
      <div className="container">
        <h3 className="text-center main-title mb-3">
          Frequently Asked Questions (F.A.Q's)
        </h3>
        <div key={faq.id}>
          <div className="d-flex justify-content-between">
            {/* <h5 className="my-3">{faq.post_name}</h5> */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginBottom: "1rem" }}
              onClick={() => {
                // setCurrentFAQ({ ...faq, index: i });
                setShowFAQ(true);
              }}
            >
              Add New F.A.Q Item
            </Button>
            <FormControl
              variant="outlined"
              size="small"
              style={{ width: "20%", marginBottom: '1rem' }}
            // fullWidth
            >
              <InputLabel id="language"
              >Select Language</InputLabel>
              <Select
                labelId="language"
                id="language"
                name="language"
                value={selectedLang}
                label="Select Language"
                fullWidth
                onChange={handleChange}
              >
                <MenuItem value={'en'}>En</MenuItem>
                <MenuItem value={'fr'}>FR</MenuItem>
                <MenuItem value={'de'}>DE</MenuItem>
                <MenuItem value={'ru'}>RU</MenuItem>

              </Select>
            </FormControl>
          </div>
          {faqList.map((x, ind) => (
            <Accordion key={x.id}>
              <Card>
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey={`${ind}`}
                  style={{ cursor: "pointer" }}
                >
                  <ContextAwareToggle
                    eventKey={`${ind}`}
                    sectionIndex={x.slug}
                    contentIndex={ind}
                    handleDelete={handleDelete}
                    setShowFAQ={setShowFAQ}
                    setIsEdit={setIsEdit}
                    faqData={x}
                    setEditFaq={setEditFaq}
                  >
                    {x?.question}
                  </ContextAwareToggle>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={`${ind}`}>
                  <Card.Body>
                    <div dangerouslySetInnerHTML={{ __html: x?.answer }}></div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          ))}
        </div>
      </div>
      {
        <AddFAQDialog
          currentFAQ={currentFAQ}
          section_content={faq.section_content[0]}
          handleQuestionChange={handleQuestionChange}
          handleSlugChange={handleSlugChange}
          handleAnswerChange={handleAnswerChange}
          onClose={() => {
            setShowFAQ(false);
            setSelectedFaq({});
            setFAQ({
              ...faq, section_content: [{
                question: "",
                answer: "",
                slug: "",
                page: "",
                innerpage: ""
              },
              ]
            });
          }}
          handleSubmit={handleSubmit}
          open={showFAQ}
          handleChange={handleChange}
          selectedLang={selectedLang}
          handleChangePage={handleChangePage}
          handleChangeInnerPage={handleChangeInnerPage}
          selectedFaq={selectedFaq}
          setEditFaq={setEditFaq}
        />
      }
    </div>
  );
};

export default FAQList;
