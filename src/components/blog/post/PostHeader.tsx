import { BlogPost } from '@/model/BlogPost';
import { ArticleHeaderMetadata } from './';

export const PostHeader = ({ post }: { post: BlogPost }) => {
  return (
    <>
      <h1>{post.title}</h1>
      <ArticleHeaderMetadata date={post.date} timeToRead={post.timeToRead} />
    </>
  );
};
