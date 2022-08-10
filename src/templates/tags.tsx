import { graphql } from 'gatsby';
import Layout from '@/components/Layout';
import PostCard from '@/components/blog/post/PostCard';
import { BlogPost } from '@/model/BlogPost';
import { IGatsbyImageData } from 'gatsby-plugin-image';

interface Node {
  frontmatter: {
    date: Date;
    title: string;
    description: string;
    tags: string[];
    categories: string[];
    image: {
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
}

interface DataProps {
  allMdx: {
    nodes: Node[];
  };
}

const mdxToBlogPost = (node: Node): BlogPost => {
  return {
    id: node.id,
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    slug: node.slug,
    date: node.frontmatter.date,
    image: node.frontmatter.image.childImageSharp.gatsbyImageData,
    tags: node.frontmatter.tags,
    categories: node.frontmatter.categories,
    timeToRead: node.timeToRead,
  };
};

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
  query MdxBlogPost($tag: String) {
    allMdx(
      filter: { frontmatter: { tags: { eq: $tag } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        frontmatter {
          date
          description
          tags
          categories
          title
          image {
            childImageSharp {
              gatsbyImageData(width: 700, height: 350)
            }
          }
        }
        id
        slug
        excerpt
        timeToRead
      }
    }
  }
`;

export default Tags;
