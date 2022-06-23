import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import API from 'langapi/http';
import "./SubscriberList.scss"

class SubscribersList extends Component {
    state = {
        columns: [
            {
                name: "email",
                label: "Email",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: `created_at`,
                label: "Joined",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (val) => {
                        return new Date(val).toLocaleDateString()
                    }
                }
            },
        ],
        rows: []
    }

    options = {
        filterType: "checkbox",
        responsive: "vertical",
        print: false,
        pagination: false,
        filter: false,
        viewColumns: false
    };

    componentDidMount() {
        API.get(`/dashboard_apis`).then(response => {
            let rows = response?.data?.subscribers;
            this.setState({ rows })
        })
    }

    render() {
        return (
            <div>
                <MUIDataTable
                    columns={this.state.columns}
                    data={this.state.rows}
                    options={this.options}
                />
            </div>
        );
    }
}

export default SubscribersList;