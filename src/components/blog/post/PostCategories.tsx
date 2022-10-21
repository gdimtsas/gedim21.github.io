import { BlogPost } from '@/model/BlogPost';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tag from '../Tag';

const PostTags = ({ post }: { post: BlogPost }) => {
  return (
    <>
      <span>
        <FontAwesomeIcon icon={faFolderOpen} className="mr-2" />
        <span className="mr-2">Categories:</span>
      </span>
      {post.categories != null &&
        post.categories.map((category) => (
          <Tag key={category} tag={category}></Tag>
        ))}
    </>
  );
};

export default PostTags;
