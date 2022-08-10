import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

type Props = {
  username?: string;
  type: string;
  title: string;
  desc: string;
  imageUrl?: string;
};

const Twitter = ({ type, username, title, desc, imageUrl }: Props) => (
  <Helmet>
    {username && <meta name="twitter:site" content={username} />}
    <meta name="twitter:card" content={type} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={desc} />
    <meta name="twitter:image" content={imageUrl} />
    <meta name="twitter:image:alt" content={desc} />
  </Helmet>
);

export default Twitter;

Twitter.propTypes = {
  type: PropTypes.string,
  username: PropTypes.string,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

Twitter.defaultProps = {
  type: 'summary_large_image',
  username: null,
};
