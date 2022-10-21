import { BlogPost } from '@/model/BlogPost';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import Tag from '@/components/blog/Tag';

const PostCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="md:max-w-lg bg-white rounded-lg border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/blog/${post.slug}`}>
        <GatsbyImage className="rounded-t-lg" image={post.image} alt="" />
      </Link>
      <div className="p-4">
        {post.categories && (
          <p className="mb-2 text-blue-700 dark:text-blue-300">
            {post.categories[0]}
          </p>
        )}
        <Link to={`/blog/${post.slug}`}>
          <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {post.title}
          </span>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {post.description}
        </p>
        <div className="pt-4">
          {post.tags.map((tag) => (
            <Tag key={tag} tag={tag}></Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
