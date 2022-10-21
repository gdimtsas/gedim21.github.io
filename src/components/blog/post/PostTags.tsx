import { BlogPost } from '@/model/BlogPost';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tag from '../Tag';

const PostTags = ({ post }: { post: BlogPost }) => {
  return (
    <>
      <span>
        <FontAwesomeIcon icon={faTags} className="mr-2" />
        <span className="mr-2">Tags:</span>
      </span>
      {post.tags != null &&
        post.tags.map((tag) => <Tag key={tag} tag={tag}></Tag>)}
    </>
  );
};

export default PostTags;
