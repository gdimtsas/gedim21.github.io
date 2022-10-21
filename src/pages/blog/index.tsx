import { graphql, PageProps } from 'gatsby';
import Layout from '../../components/Layout';
import BlogListItem from '@/components/blog/BlogListItem';
import { BlogPostMdxNode, mdxToBlogPost } from '@/model';

type DataProps = {
  allMdx: {
    nodes: BlogPostMdxNode[];
  };
};

const HomePage = ({ data }: PageProps<DataProps>) => {
  return (
    <Layout>
      <h1>My latest posts</h1>
      {data.allMdx.nodes.map((node) => (
        <BlogListItem blogPost={mdxToBlogPost(node, {})}></BlogListItem>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        ...BlogPost
      }
    }
  }
`;

export default HomePage;
