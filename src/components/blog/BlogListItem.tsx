import { ArticleHeaderMetadata } from '@/components/blog/post';
import Tag from '@/components/blog/Tag';
import { BlogPost } from '@/model';
import Link from 'gatsby-link';

const BlogListItem = ({ blogPost }: { blogPost: BlogPost }) => {
  return (
    <article key={blogPost.id} className="mb-4">
      <h2 className="flex flex-wrap font-bold text-gray-600 dark:text-gray-100">
        <Link to={`/blog/${blogPost.slug}/`}>{blogPost.title}</Link>
      </h2>

      <ArticleHeaderMetadata
        date={blogPost.date}
        timeToRead={blogPost.timeToRead}
      />

      <p className="pt-8 mb-8 leading-relaxed text-gray-600 dark:text-gray-100">
        {blogPost.excerpt}
      </p>
      <p className="flex flex-wrap">
        {blogPost.tags != null &&
          blogPost.tags.map((tag) => <Tag key={tag} tag={tag}></Tag>)}
      </p>
    </article>
  );
};

export default BlogListItem;
