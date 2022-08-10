import { graphql, PageProps } from 'gatsby';

import { GiscusComments } from '@/components/blog/comments/Giscus';
import { Sharing } from '@/components/blog/post/Sharing';
import ArticleSEO from '@/components/seo/SEO';
import PostCard from '@/components/blog/post/PostCard';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import { BlogPost } from '@/model/BlogPost';
import TableOfContents from '@/components/blog/post/TableOfContents';
import AuthorBar from '@/components/blog/post/AuthorBar';
import Layout from '@/components/Layout';
import PostHeader from '@/components/blog/post/PostHeader';
import PostBody from '@/components/blog/post/PostBody';
import PostTags from '@/components/blog/post/PostTags';
import PostCategories from '@/components/blog/post/PostCategories';
import { Person } from '@/model/Person';

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

type DataProps = {
  mdx: MdxNode;
  site: {
    siteMetadata: {
      owner: Person;
      siteUrl: string;
    };
  };
  relatedMdxs: {
    posts: MdxNode[];
  };
};

const mdxToBlogPost = (node: MdxNode, site: any): BlogPost => {
  return {
    id: node.id,
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    slug: node.slug,
    date: node.frontmatter.date,
    timeToRead: node.timeToRead,
    image: node.frontmatter.image.childImageSharp.gatsbyImageData,
    imageUrl: `${site.siteMetadata.siteUrl}${node.frontmatter.image.publicURL}`,
    tags: node.frontmatter.tags,
    categories: node.frontmatter.categories,
  };
};

const PostPage = ({ data }: PageProps<DataProps>) => {
  const post: BlogPost = mdxToBlogPost(data.mdx, data.site);
  const author: Person = data.site.siteMetadata.owner;

  return (
    <Layout author={author} post={post}>
      <div className="container mx-auto pt-4 flex flex-col md:flex-row">
        <aside className="flex-initial md:w-32 min-w-0 md:block md:basis-1/4 md:px-4">
          <AuthorBar />
        </aside>
        <main className="flex-grow min-w-0 sm:basis-full md:basis-3/4 md:px-4">
          <article className="blog-post">
            <header>
              <PostHeader post={post} />
            </header>

            <section>
              <PostBody body={data.mdx.body} />
            </section>

            <footer className="mt-10">
              <section className="flex flex-wrap">
                <PostTags post={post} />
              </section>

              <section className="flex flex-row">
                <PostCategories post={post} />
              </section>

              <section className="my-8">
                <Sharing
                  siteUrl={data.site.siteMetadata.siteUrl}
                  slug={data.mdx.slug}
                  title={data.mdx.frontmatter.title}
                  tags={data.mdx.frontmatter.tags}
                />
              </section>

              <section>
                <GiscusComments />
              </section>

              <h3>You may also enjoy</h3>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {data.relatedMdxs.posts.slice(0, 3).map((post) => (
                  <PostCard
                    key={post.id}
                    post={mdxToBlogPost(post, data.site)}
                  />
                ))}
              </section>
            </footer>
          </article>
        </main>
        <aside className="flex-initial w-32 min-w-0 hidden md:block md:basis-1/4 md:px-4">
          <TableOfContents headings={data.mdx.headings}></TableOfContents>
        </aside>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        description
        date
        tags
        categories
        image {
          publicURL
          childImageSharp {
            gatsbyImageData(width: 500, height: 250)
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
    site {
      siteMetadata {
        owner {
          name
          surname
          twitter
          facebook
        }
        siteUrl
      }
    }
    relatedMdxs(parent: { id: { eq: $id } }) {
      posts {
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

export default PostPage;
