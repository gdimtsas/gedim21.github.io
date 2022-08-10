import ArticleHeaderMetadata from '@/components/blog/post/ArticleHeaderMetadata';
import Tag from '@/components/blog/Tag';
import Link from 'gatsby-link';

type Props = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  timeToRead: number;
  date: Date;
  tags?: string[];
  categories: string[];
};

const BlogListItem = (props: Props) => {
  return (
    <article key={props.id} className="mb-4">
      <h2 className="flex flex-wrap font-bold text-gray-600 dark:text-gray-100">
        <Link to={`/blog/${props.slug}`}>{props.title}</Link>
      </h2>

      <ArticleHeaderMetadata date={props.date} timeToRead={props.timeToRead} />

      <p className="pt-8 mb-8 leading-relaxed text-gray-600 dark:text-gray-100">
        {props.excerpt}
      </p>
      <p className="flex flex-wrap">
        {props.tags != null &&
          props.tags.map((tag) => <Tag key={tag} tag={tag}></Tag>)}
      </p>
    </article>
  );
};

export default BlogListItem;
