import { graphql, PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import { BlogPost } from '@/model/BlogPost';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import FeaturedContent from '@/components/blog/FeaturedContent';
import Topics from '@/components/blog/Topics';
import LatestPosts from '@/components/blog/LatestPosts';

type MdxNode = {
  frontmatter: {
    date: Date;
    title: string;
    description: string;
    tags: string[];
    categories: string[];
    image: {
      publicURL: string;
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };
  };
  id: string;
  body: string;
  excerpt: string;
  slug: string;
  timeToRead: number;
  headings: [
    {
      value: string;
      depth: number;
    },
  ];
};

interface DataProps {
  allMdx: {
    nodes: MdxNode[];
  };
}

const mdxToBlogPost = (node: MdxNode): BlogPost => {
  return {
    id: node.id,
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    slug: node.slug,
    date: node.frontmatter.date,
    timeToRead: node.timeToRead,
    image: node.frontmatter.image.childImageSharp.gatsbyImageData,
    tags: node.frontmatter.tags,
    categories: node.frontmatter.categories,
  };
};

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
  query {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        frontmatter {
          title
          description
          date
          tags
          categories
          image {
            publicURL
            childImageSharp {
              gatsbyImageData(width: 700, height: 350)
            }
          }
        }
        id
        slug
        body
        timeToRead
        headings {
          value
          depth
        }
      }
    }
  }
`;

export default HomePage;
