import { graphql, PageProps } from 'gatsby';
import { Layout } from '@/components/common';
import { BlogPost, BlogPostMdxNode, mdxToBlogPost } from '@/model/BlogPost';
import FeaturedContent from '@/components/blog/FeaturedContent';
import Topics from '@/components/blog/Topics';
import LatestPosts from '@/components/blog/LatestPosts';

interface DataProps {
  allMdx: {
    nodes: BlogPostMdxNode[];
  };
}

const HomePage = ({ data }: PageProps<DataProps>) => {
  return (
    <Layout>
      <h1>Hey there! 🎉</h1>
      <p className="text-2xl">
        I&apos;m Giorgos, and this is my blog. I am a Software Engineer based in
        Athens, Greece.
      </p>
      <p className="text-2xl">
        I write about programming, software design, cloud technologies, and many
        more!
      </p>

      <section>
        <h2>Browse topics</h2>
        <Topics />
      </section>

      <section className="hidden">
        <h2>Featured Content</h2>
        <FeaturedContent />
      </section>

      <section>
        <h2>Latest posts</h2>
        <LatestPosts
          blogPosts={data.allMdx.nodes
            .slice(0, 8)
            .map((node) => mdxToBlogPost(node))}
        />
      </section>
    </Layout>
  );
};

export const query = graphql`
  query LatestPosts {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        ...BlogPost
      }
    }
  }
`;

export default HomePage;
