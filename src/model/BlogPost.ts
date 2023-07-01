import { IGatsbyImageData } from 'gatsby-plugin-image';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  excerpt?: string
  slug: string;
  date: Date;
  timeToRead: number;
  image: IGatsbyImageData;
  imageUrl?: string;
  tags: string[];
  categories: string[];
  searchableBody?: string
}

export type BlogPostMdxNode = {
  frontmatter: {
    title: string;
    description: string;
    date: Date;
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
  excerpt: string;
  fields: {
    slug: string;
    timeToRead: {
      minutes: number;
    };
  };
  headings: [
    {
      value: string;
      depth: number;
    },
  ];
  body: string
};


export const mdxToBlogPost = (node: BlogPostMdxNode, site?: any): BlogPost => {
  return {
    id: node.id,
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    slug: node.fields.slug,
    date: node.frontmatter.date,
    timeToRead: node.fields.timeToRead.minutes,
    image: node.frontmatter.image.childImageSharp.gatsbyImageData,
    imageUrl: `${site?.siteMetadata?.siteUrl}${node.frontmatter.image.publicURL}`,
    tags: node.frontmatter.tags,
    categories: node.frontmatter.categories,
    searchableBody: node.body
  };
};