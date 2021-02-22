import { Button, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AccordionContext, Card } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import API from 'utils/http';


function ContextAwareToggle({ children, eventKey, callback }) {
  const currentEventKey = useContext(AccordionContext);

  // const decoratedOnClick = useAccordionToggle(
  //   eventKey,
  //   () => callback && callback(eventKey),
  // );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div className="d-flex align-items-center">
      <i className={`pr-4 fa ${isCurrentEventKey ? 'fa-minus' : 'fa-plus'}`} />
      <h6 style={{ padding: '0.5rem 0', marginBottom: 0 }}>
        {children}
      </h6>
    </div>
  );
}

const FAQList = (props) => {

  const [faqList, setFaqList] = useState([]);

  const faqListw = [
    //sunset
    {
      id: 17,
      question: 'What is there to do in Seychelles at night?',
      answer: `One prospect can be to dance all night in one of the many night clubs in Seychelles. Thanks to its tropical nature, the city allows guests to sit outside and enjoy the ocean breeze with a hint of lively music`,
      category: 'dining'
    },
    {
      id: 17,
      question: 'Can you drink alcohol in Seychelles?',
      answer: `Hotels and bars in Seychelles are allowed to serve alcohol while having a license. It is not advisable to drink in public places so the tourists should be careful and considerate of the local culture.`,
      category: 'policy'
    },
    {
      id: 17,
      question: 'Is Seychelles a party place?',
      answer: `Seychelles is not considered to be a party place and it is not known for its nightlife. Tourists will have to settle for calm and chill evenings. There aren’t many hotels and Casinos though there are some options but mostly hotels and resorts take this responsibility of entertaining guests.`,
      category: 'policy'
    },

    {
      id: 17,
      question: 'What are the best areas to stay in Seychelles?',
      answer: `Here are some areas suited for different kinds of tourists. Victoria is the best place to go for first-timers. Beau Vallon is one of the most visited places in Seychelles. Praslin is the place to go for tourists looking for Nightlife. La Digue is considered to be the coolest place to go and Mahe is the best place to be for families.`,
      category: 'policy'
    },
    //paris seychelles
    {
      id: 15,
      question: 'Is it expensive to eat out in Seychelles?',
      answer: `There are numerous restaurants in Seychelles, Victoria and the cost of eating out can vary. However, the average cost of lunch and dinner is SCR 560 per day. Breakfasts are usually a bit cheaper.`,
      category: 'policy'
    },

    {
      id: 15,
      question: 'What is Seychelles known for?',
      answer: `Seychelles is known for its deep blue waters and yet unspoiled shores. However, there is much more to Seychelles than just a remote island including fine dining restaurants and luxurious resorts.`,
      category: 'policy'
    },

    {
      id: 15,
      question: 'How many days are enough to explore Seychelles?',
      answer: `The Island is around 17 miles long. Scheduling three nights and four days would allow tourists to explore enough attractions including beaches, bars, and restaurants in Seychelles.`,
      category: 'policy'
    },

    //lecocoloba
    {
      id: 16,
      question: 'Is Seychelles expensive to eat?',
      answer: `The prices at Seychelles bars and restaurants can vary. There are numerous options to choose from and there is no end to luxury so visitors need to be careful and spend according to their budget.`,
      category: 'policy'
    },

    {
      id: 16,
      question: 'Is Seychelles better than the Maldives?',
      answer: `Seychelles is comparatively larger and there is much more to explore than the Maldives. Moreover, Seychelles is home to some of the rarest species of fauna and flora. Having some of the most beautiful diving sites, it is a paradise for divers.  Mahé is the main island and it is home to Seychelles' best restaurants and hotels.`,
      category: 'policy'
    },

    {
      id: 16,
      question: 'What are Seychelles best bars and clubs?',
      answer: `Here is a list of some of the famous bars and clubs in Seychelles.
    Club Liberte Casino
    Beach Shak
    Bar Ocean View
    Honesty Bar
    Rogan’s Irish Bar
    Katiolo Night Club
    Trader Vicks
    1502
    `,
      category: 'policy'
    },
    {
      id: 16,
      question: 'Where in Seychelles can we enjoy nightlife?',
      answer: `One of the best places to enjoy the nightlife in Seychelles is Katiolo. Due to its tropical nature, the open-air party vibe is amazing. `,
      category: 'policy'
    },

    //le cardinal

    {
      id: 18,
      question: 'Is veg food available in Seychelles?',
      answer: `There are a number of Seychelle restaurants that are vegetarian friendly, mainly in Mahe islands and La Digue. Some of the vegetarian-friendly restaurants include Rey and Josh Café, Mi Mum’s Takeaway, Les Rochers, and Mimi’s Café.`,
      category: 'policy'
    },

    {
      id: 18,
      question: 'Is Seychelles expensive to eat?',
      answer: `Prices can vary due to several factors. Primarily due to a huge number of fine dining restaurants in Seychelles However, the average price per day is somewhere around SCR 569. Dinner is considered to be expensive as compared to breakfast. There is something for every price range in the city.`,
      category: 'policy'
    },

    {
      id: 18,
      question: 'What foods do they eat in Seychelles?',
      answer: `Some of the common staple foods including fish, shellfish dishes, and seafood dishes are famous and are eaten with rice. Curry dishes with rice are generally well-liked. Seafood is cooked in different ways such as steamed, grilled, baked, and salted.`,
      category: 'policy'
    },
    {
      id: 18,
      question: 'How much money do I need for Seychelles?',
      answer: `According to visitors who have spent some time in Seychelles, the average daily budget should be around $105. Though it varies and numerous factors need to be taken into consideration. However, tourists should at least keep this amount in mind.`,
      category: 'policy'
    },

  ];

  useEffect(() => {
    API.get('/faqs').then(response => {
      if (response.status === 200) {
        // let data = response.data.map(x => {
        //   return {
        //     page_id: x.page_id,
        //     page_name: x.post_name,
        //     section_content: JSON.parse(x.section_content)
        //   }
        // })
        // debugger;
        setFaqList(response.data)
      }
    }).catch(err => {
      alert("Something went wrong")
    })
  }, [])

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
                  {/* <Button variant="contained" color="primary" size="small" onClick={() => props.history.push('/')}>
                    Add/Update FAQ
                  </Button> */}
                </div>
              }
              {
                JSON.parse(faq.section_content).map(x => (
                  <Accordion key={x.id}>
                    <Card>
                      <Accordion.Toggle as={Card.Header} eventKey={`${i}`} style={{ cursor: 'pointer' }} >
                        <ContextAwareToggle eventKey={`${i}`} >
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
    </div >
  );
}

export default FAQList;