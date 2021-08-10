import React, { useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import ReactGA from 'react-ga'

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import API from "utils/http";
import { Avatar, Checkbox, IconButton } from "@material-ui/core";
import { AddOutlined, Check, DeleteOutlined, PlaylistAddOutlined } from "@material-ui/icons";
import AddTodoDialog from "./AddTodoDialog";
import WeddingDetailDialog from "./WeddingDetailDialog";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [stats, setStats] = useState({
    contacts_count: 0,
    offers_count: 0,
    subscribers_count: 0,
    analytics_count: 12
  });
  const [recents, setRecents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [weddings, setWeddings] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [currentWedding, setCurrentWedding] = useState(null);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showWedding, setShowWedding] = useState(false);

  useEffect(() => {
    API.get('/dashboard_apis').then(response => {
      if (response?.status === 200) {
        setRecents(response.data)
      }
      // ReactGA.pageview('/dashboard_apis')
      // console.log(recents)
    })

  }, [])

  const getTodos = () => {
    API.get('/todo').then(response => {
      if (response?.status === 200) {
        setTodos(response.data)
      }
    })
  }

  const handleStatusChange = (e, index) => {
    let updatedTodo = todos[index];
    debugger;
    updatedTodo.is_read = e.target.checked;
    
    API.put(`/todo/${todos[index].id}`, updatedTodo)
      .then(response => {
        if (response?.status === 200) {
          // alert("Updated")
        }
      })
      .then(() => {
        API.get('/todo').then(response => {
          if (response?.status === 200) {
            setTodos(response.data)
          }
        })
      })
      .catch(err => {
        alert("Something went wrong")
      })
  }

  const handleTaskDelete = (id) => {
    API.delete(`/todo/${id}`).then(response => {
      if (response.status === 200) {
        // alert("Task deleted successfully.");
        // this.setState({currentFiles: []})
      }
    }).then(() => {
      API.get('/todo').then(response => {
        if (response.status === 200) {
          setTodos(response.data)
        }
      })
    })
      .catch(err => alert("Something went wrong"));
  }

  return (
    <div>
      
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Contacts</p>
              <h3 className={classes.cardTitle}>
                {recents.contacts_count}
              </h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Get more space
                </a>
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Total Subscribers</p>
              <h3 className={classes.cardTitle}>{recents.subscribers_count}</h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Active Offers</p>
              <h3 className={classes.cardTitle}>{recents.offers_count}</h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Analytics</p>
              <h3 className={classes.cardTitle}>{stats.analytics_count}</h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer style={{ display: 'none' }}>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Email Subscriptions</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Tasks</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success">
              <div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h4 className="mb-0">Todo List</h4>
                  <p className={classes.cardCategoryWhite}>
                    List of all tasks and todos.
                  </p>
                </div>
                <div>
                  <IconButton color="default" style={{ color: '#fff' }} onClick={() => setShowAddTodo(true)}>
                    <AddOutlined />
                  </IconButton>
                </div>
              </div>
            </CardHeader>
            <CardBody style={{ height: '300px', overflowY: 'scroll' }}>
              <div className="d-flex align-items-center img-thumbnail mb-2" style={{ justifyContent: 'space-between' }}>
                <small style={{ width: '30%', marginBottom: 0, fontWeight: 500 }}>
                  Task
                    </small>
                <small style={{ width: '30%', marginBottom: 0, fontWeight: 500 }}>
                  Date
                    </small>
                <small style={{ width: '20%', marginBottom: 0, fontWeight: 500, textAlign: 'center' }}>
                  Status
                    </small>
                <small style={{ width: '10%', marginBottom: 0, fontWeight: 500, textAlign: 'center' }}>
                  Mark
                    </small>
                <small style={{ width: '10%', marginBottom: 0, fontWeight: 500, textAlign: 'center' }}>
                  Delete
                    </small>
              </div>
              {
                recents?.Todo_lists?.map((x, index) => (
                  <div className="d-flex align-items-center img-thumbnail mb-2" style={{ justifyContent: 'space-between' }}>
                    <p title={x.todo_description} style={{ width: '30%', marginBottom: 0 }}>
                      {x.todo_name}
                    </p>
                    <p style={{ width: '30%', marginBottom: 0 }}>
                      {new Date(x.updated_at).toLocaleDateString()}
                    </p>
                    <p style={{ width: '20%', marginBottom: 0, textAlign: 'center' }}>
                      {
                        x.is_read == 0 ?
                          <small className="badge badge-warning">pending</small>
                          :
                          <small className="badge badge-success">completed</small>
                      }
                    </p>
                    <p style={{ width: '10%', marginBottom: 0, textAlign: 'center' }}>
                      <Checkbox
                        checked={x.is_read == 0 ? false : true}
                        tabIndex={-1}
                        onChange={(e) => handleStatusChange(e, index)}
                        size="small"
                      />
                    </p>
                    <p style={{ width: '10%', marginBottom: 0, textAlign: 'center' }}>
                      <DeleteOutlined onClick={() => handleTaskDelete(x.id)} style={{ cursor: 'pointer' }} fontSize="small" color="secondary" />
                    </p>
                  </div>
                ))
              }
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info">
              <h4 className="mb-0">Recent Activity</h4>
              <p className={classes.cardCategoryWhite}>
                List of recent activitiies on CMS
              </p>
            </CardHeader>
            <CardBody style={{ height: '300px', overflowY: 'scroll' }}>
              <div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                <p style={{ marginBottom: 0, width: '10%' }}>

                </p>
                <p style={{ marginBottom: 0, width: '30%' }}>
                  <b>Activity</b>
                </p>
                <p style={{ marginBottom: 0, width: '30%' }}>
                  <b>Date</b>
                </p>
                <p style={{ marginBottom: 0, width: '30%' }}>
                  <b>Time</b>
                </p>
              </div>
              <hr />
              {
                recents.recent_activities?.map(x => (
                  <div key={x.post_name} className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                    <p style={{ width: '10%' }}>
                      <Avatar src={x.thumbnail} style={{ width: '30px', height: '30px' }} />
                    </p>
                    <p style={{ width: '30%' }}>
                      {x.post_name}
                    </p>
                    <p style={{ width: '30%' }}>
                      {new Date(x.updated_at).toLocaleDateString()}
                    </p>
                    <p style={{ width: '30%' }}>
                      {new Date(x.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              }
            </CardBody>
          </Card>
        </GridItem>
        {/* WEDDING FORM DATA */}
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h4 className="mb-0">Wedding Forms</h4>
                  <p className={classes.cardCategoryWhite}>
                    List of all wedding forms data.
                  </p>
                </div>
                {/* <div>
                  <IconButton color="default" style={{ color: '#fff' }} onClick={() => setShowAddTodo(true)}>
                    <AddOutlined />
                  </IconButton>
                </div> */}
              </div>
            </CardHeader>
            <CardBody style={{ height: '300px', overflowY: 'scroll' }}>
              <div className="d-flex align-items-center mb-2" style={{ justifyContent: 'space-between' }}>
                <small style={{ width: '30%', marginBottom: 0, fontWeight: 500 }}>
                  Name
                </small>
                <small style={{ width: '30%', marginBottom: 0, fontWeight: 500 }}>
                  Email
                </small>
                <small style={{ width: '20%', marginBottom: 0, fontWeight: 500, textAlign: 'center' }}>
                  Date
                </small>
              </div>
              {
                recents.weddings?.map((x, index) => (
                  <div onClick={() => {
                    setCurrentWedding(weddings[index]);
                    setShowWedding(true);
                  }} className="d-flex align-items-center img-thumbnail mb-2" style={{ justifyContent: 'space-between', cursor: 'pointer' }}>
                    <p title={x.todo_description} style={{ width: '30%', marginBottom: 0 }}>
                      {x.name}
                    </p>
                    <p style={{ width: '30%', marginBottom: 0 }}>
                      {x.email}
                    </p>
                    <p style={{ width: '20%', marginBottom: 0, textAlign: 'center' }}>
                      {new Date(x.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              }
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info">
              <h4 className="mb-0">Subscribers List</h4>
              <p className={classes.cardCategoryWhite}>
                List of subscribers
              </p>
            </CardHeader>
            <CardBody style={{ height: '300px', overflowY: 'scroll' }}>
              <div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                <p style={{ marginBottom: 0, width: '40%' }}>
                  <b>Email</b>
                </p>
                <p style={{ marginBottom: 0, width: '40%' }}>
                  <b>Joined</b>
                </p>
                <p style={{ marginBottom: 0, width: '20%' }}>
                  <b>Enroled</b>
                </p>
              </div>
              <hr />
              {
                recents.subscribers?.map(x => (
                  <div key={x.post_name} className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                    <p style={{ width: '40%' }}>
                      {x.email}
                    </p>
                    <p style={{ width: '40%' }}>
                      {new Date(x.created_at).toLocaleDateString()}
                    </p>
                    <p style={{ width: '20%' }}>
                      <Checkbox
                        defaultChecked
                        tabIndex={-1}
                        size="small"
                      />
                    </p>
                  </div>
                ))
              }
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <AddTodoDialog success={() => { getTodos(); setShowAddTodo(false) }} onClose={() => setShowAddTodo(false)} open={showAddTodo} />
      <WeddingDetailDialog onClose={() => setShowWedding(false)} open={showWedding} wedding={currentWedding} />
    </div>
  );
}
