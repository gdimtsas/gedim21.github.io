import { graphql } from 'gatsby';
import { Layout } from '@/components/common';
import { PostCard } from '@/components/blog/post';
import { BlogPostMdxNode, mdxToBlogPost } from '@/model/BlogPost';

interface DataProps {
  allMdx: {
    nodes: BlogPostMdxNode[];
  };
}

const Tags = ({ data, tag }: { data: DataProps; tag: string }) => {
  return (
    <Layout>
      <h1>{tag}</h1>
      <section className="grid xl:grid-cols-4 lg:grid-cols-3 lg:gap-6 md:grid-cols-2 md:gap-4 sm:grid-cols-1 sm:gap-4">
        {data.allMdx.nodes
          .map((node) => mdxToBlogPost(node))
          .map((post) => (
            <PostCard key={post.id} post={post}></PostCard>
          ))}
      </section>
    </Layout>
  );
};

export const query = graphql`
  query MdxBlogPost($tag: String!) {
    allMdx(
      filter: { frontmatter: { tags: { eq: $tag } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        ...BlogPost
      }
    }
  }
`;

export default Tags;
