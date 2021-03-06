import React from 'react';
import { Link } from 'react-router';
import { printArtists } from '../utils.js';
const moment = require('moment');

const CollectionItem = props => {
  const { date_added } = props.release;
  const { artists, title, year, id } = props.release.basic_information;
  return (
    <tr>
      <td>{printArtists(artists)}</td>
      <td>
        <Link to={`/collection/${id}`}>
          {title}
        </Link>
      </td>
      <td>{year}</td>
      <td>{moment(date_added).format('MMM D, YYYY')}</td>
    </tr>
  );
};

CollectionItem.propTypes = {
  release: React.PropTypes.object.isRequired,
};

export default CollectionItem;
