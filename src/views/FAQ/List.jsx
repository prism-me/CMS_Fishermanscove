import { Button, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AccordionContext, Card } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useParams } from 'react-router-dom';
import API from 'utils/http';
import AddFAQDialog from './AddFAQDialog';


function ContextAwareToggle({ children, eventKey, callback, sectionIndex, contentIndex, handleDelete }) {
  const currentEventKey = useContext(AccordionContext);

  // const decoratedOnClick = useAccordionToggle(
  //   eventKey,
  //   () => callback && callback(eventKey),
  // );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div className="d-flex align-items-center justify-content-center">
      <i style={{ width: '5%' }} className={`pr-4 fa ${isCurrentEventKey ? 'fa-minus' : 'fa-plus'}`} />
      <h6 style={{ padding: '0.5rem 0', marginBottom: 0, width: '90%' }}>
        {children}
      </h6>
      <i style={{ width: '5%', color: '#ff0000' }} className={`fa fa-trash float-right d-block`} onClick={() => handleDelete(sectionIndex, contentIndex)} />
    </div>
  );
}

const FAQList = (props) => {
  const pageId = parseInt(useParams().id);

  const [faqList, setFaqList] = useState([]);
  const [currentFAQ, setCurrentFAQ] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [faq, setFAQ] = useState({
    id: 0,
    section_name: '',
    section_content: [{
      question: '', answer: ''
    }],
    page_id: pageId,
    section_avatar: '',
    section_col_arr: 0,
    section_prior: 1,
    section_avtar_alt: '',
    section_slug: 'faq'
  })

  useEffect(() => {
    API.get('/faqs').then(response => {
      if (response.status === 200) {
        setFaqList(response.data)
      }
    }).catch(err => {
      alert("Something went wrong")
    })
  }, [])

  //faq section methods
  const handleQuestionChange = (e, index) => {
    let section_content = [...faq.section_content];
    section_content[0].question = e.target.value;
    setFAQ({ ...faq, section_content })
  }
  const handleAnswerChange = (data, index) => {
    let section_content = [...faq.section_content];
    section_content[0].answer = data;
    setFAQ({ ...faq, section_content })
  }
  //end faq section methods

  const handleDelete = (sectionIndex, contentIndex) => {
    let updatedFAQ = faqList[sectionIndex];
    //parsing to JSON as the data is stringified
    let updatedSectionContent = JSON.parse(updatedFAQ.section_content);
    //deleting index item
    updatedSectionContent = updatedSectionContent.filter((x, i) => i !== contentIndex);
    //replacing section content with modified array
    updatedFAQ.section_content = updatedSectionContent;

    API.put(`/add_section/${updatedFAQ.page_id}`, updatedFAQ).then(response => {
      if (response.status === 200) {
        alert("FAQ added successfully !");
      }
    }).then(()=>{
      API.get('/faqs').then(response => {
        if (response.status === 200) {
          setFaqList(response.data)
        }
      })
    })
    .catch(err => console.log(err))
  }

  const handleSubmit = () => {
    let updatedFAQ = faqList[currentFAQ.index];

    //parsing to JSON as the data is stringified
    let updatedSectionContent = JSON.parse(updatedFAQ.section_content);
    //appending the new item
    updatedSectionContent.push(faq.section_content[0]);
    //replacing section content with modified array
    updatedFAQ.section_content = updatedSectionContent;

    //extracting current pageId and calling update API
    API.put(`/add_section/${updatedFAQ.page_id}`, updatedFAQ).then(response => {
      if (response.status === 200) {
        alert("FAQ added successfully !");
      }
    }).then(()=>{
      API.get('/faqs').then(response => {
        if (response.status === 200) {
          setFaqList(response.data)
        }
      })
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="faq-section-block my-3 my-sm-4">
      <div className="container">
        <h3 className="text-center main-title mb-3">Frequently Asked Questions (F.A.Q's)</h3>

        {
          faqList?.map((faq, i) => (
            <div key={faq.id}>
              {
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="my-3">
                    {faq.post_name}
                  </h5>
                  <Button variant="contained" color="primary" size="small" onClick={() => {
                    setCurrentFAQ({ ...faq, index: i });
                    setShowFAQ(true);
                  }}>
                    Add New F.A.Q Item
                  </Button>
                </div>
              }
              {
                JSON.parse(faq.section_content).map((x, ind) => (
                  <Accordion key={x.id}>
                    <Card>
                      <Accordion.Toggle as={Card.Header} eventKey={`${i}`} style={{ cursor: 'pointer' }} >
                        <ContextAwareToggle eventKey={`${i}`} sectionIndex={i} contentIndex={ind} handleDelete={handleDelete} >
                          {x.question}
                        </ContextAwareToggle>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={`${i}`}>
                        <Card.Body>
                          <div dangerouslySetInnerHTML={{ __html: x.answer }}></div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                ))
              }
            </div>
          ))
        }
      </div>
      {
        <AddFAQDialog
          currentFAQ={currentFAQ}
          section_content={faq.section_content[0]}
          handleQuestionChange={handleQuestionChange}
          handleAnswerChange={handleAnswerChange}
          onClose={() => setShowFAQ(false)}
          handleSubmit={handleSubmit}
          open={showFAQ}
        />
      }
    </div >
  );
}

export default FAQList;