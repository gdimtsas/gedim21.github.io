import { Link } from 'gatsby-link';

const Tag = (props: { tag: string }) => {
  return (
    <Link to={`/blog/tag/${props.tag}/`}>
      <span className="inline-block bg-gray-400 dark:bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-100 dark:text-gray-700 mr-2 mb-2">
        #{props.tag}
      </span>
    </Link>
  );
};

export default Tag;
