import { BlogPost } from '@/model/BlogPost';
import ArticleHeaderMetadata from './ArticleHeaderMetadata';

interface PostHeaderProps {
  post: BlogPost;
}

const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <>
      <h1>{post.title}</h1>
      <ArticleHeaderMetadata date={post.date} timeToRead={post.timeToRead} />
    </>
  );
};

export default PostHeader;
