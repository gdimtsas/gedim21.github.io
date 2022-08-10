import { graphql, PageProps } from 'gatsby';
import Layout from '../../components/Layout';
import BlogListItem from '@/components/blog/BlogListItem';

type Node = {
  frontmatter: {
    date: Date;
    title: string;
    tags: string[];
    categories: string[];
  };
  id: string;
  body: string;
  excerpt: string;
  slug: string;
  timeToRead: number;
};

type DataProps = {
  allMdx: {
    nodes: Node[];
  };
};

const HomePage = ({ data }: PageProps<DataProps>) => {
  return (
    <Layout>
      <h1>My latest posts</h1>
      {data.allMdx.nodes.map((node) => (
        <BlogListItem
          key={node.id}
          id={node.id}
          title={node.frontmatter.title}
          date={node.frontmatter.date}
          tags={node.frontmatter.tags}
          categories={node.frontmatter.categories}
          excerpt={node.excerpt}
          slug={node.slug}
          timeToRead={node.timeToRead}
        ></BlogListItem>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          tags
          categories
        }
        id
        slug
        excerpt
        timeToRead
      }
    }
  }
`;

export default HomePage;
