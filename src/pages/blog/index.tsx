import { graphql, PageProps } from 'gatsby';
import { Layout } from '@/components/common';
import BlogListItem from '@/components/blog/BlogListItem';
import { BlogPostMdxNode, mdxToBlogPost } from '@/model';

type DataProps = {
  allMdx: {
    nodes: BlogPostMdxNode[];
  };
};

const BlogHomePage = ({ data }: PageProps<DataProps>) => {
  return (
    <Layout>
      <h1>My latest posts</h1>
      {data.allMdx.nodes.map((node) => (
        <BlogListItem key={node.id} blogPost={mdxToBlogPost(node, {})}></BlogListItem>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        ...BlogPost
      }
    }
  }
`;

export default BlogHomePage;
