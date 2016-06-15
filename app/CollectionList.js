import React from 'react';
import request from 'superagent';
import {
  Grid,
  Row,
  Col,
  Table,
  Pagination,
  Form,
  FormGroup,
  FormControl,
} from 'react-bootstrap';

import CollectionHeader from './CollectionHeader.js';
import CollectionItem from './CollectionItem.js';
import LoadingModal from './LoadingModal.js';

export default class CollectionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      releases: [],
      activePage: 1,
      pages: undefined,
      items: undefined,
      perPage: 25,
      perPageOpts: [10, 25, 50, 100],
      sort: {
        column: 'added',
        order: 'desc',
      },
      loading: true,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.getCollection = this.getCollection.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.getCollection();
  }

  getCollection() {
    this.setState({ loading: true }, () => {
      request
        .get('/api/collection')
        .query({
          page: this.state.activePage,
          per_page: this.state.perPage,
          sort: this.state.sort.column,
          sort_order: this.state.sort.order,
        })
        .end((err, res) => {
          const pagination = res.body.pagination;
          this.setState({
            releases: res.body.releases,
            activePage: pagination.page,
            pages: pagination.pages,
            items: pagination.items,
            perPage: pagination.per_page,
            loading: false,
          });
        });
    });
  }

  handleSelect(activePage) {
    this.setState({ activePage }, this.getCollection);
  }

  handlePerPageChange(event) {
    this.setState({
      activePage: 1,
      perPage: Number(event.target.value),
    }, this.getCollection);
  }

  handleSort(column, order) {
    this.setState({
      activePage: 1,
      sort: { column, order },
    }, this.getCollection);
  }

  render() {
    const first = (this.state.activePage - 1) * this.state.perPage + 1;
    let last;
    if (this.state.activePage === this.state.pages) {
      last = this.state.items;
    } else {
      last = first + this.state.perPage - 1;
    }
    const showing = `Showing ${first} to ${last} of ${this.state.items} items`;

    const paginationStyle = { marginTop: '0' };

    return (
      <div>
        <Grid>
          <Row>
            <Col>
              <h3>Collection</h3>
              <Table bordered striped>
                <thead>
                  <CollectionHeader
                    sortColumn={this.state.sort.column}
                    sortOrder={this.state.sort.order}
                    handleSort={this.handleSort}
                  />
                </thead>
                <tbody>
                  {this.state.releases.map((release, i) =>
                    <CollectionItem key={i} release={release} />
                  )}
                </tbody>
              </Table>
              <div className="pull-left">
                <Form inline>
                  <FormGroup>
                    <FormControl.Static>{showing}&nbsp;</FormControl.Static>
                    <FormControl
                      componentClass="select"
                      value={this.state.perPage}
                      onChange={this.handlePerPageChange}
                    >
                      {this.state.perPageOpts.map((perPage, i) =>
                        <option key={i} value={perPage}>
                          {perPage}
                        </option>
                      )}
                    </FormControl>
                    <FormControl.Static>&nbsp;items per page</FormControl.Static>
                  </FormGroup>
                </Form>
              </div>
              <div className="pull-right">
                <Pagination
                  prev
                  next
                  boundaryLinks
                  items={this.state.pages}
                  maxButtons={4}
                  activePage={this.state.activePage}
                  onSelect={this.handleSelect}
                  style={paginationStyle}
                />
              </div>
            </Col>
          </Row>
          <LoadingModal show={this.state.loading} />
        </Grid>
      </div>
    );
  }

}
