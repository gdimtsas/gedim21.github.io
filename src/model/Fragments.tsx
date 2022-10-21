import { graphql } from 'gatsby';

export const BlogPostFragment = graphql`
  fragment BlogPost on Mdx {
    frontmatter {
      title
      description
      date(formatString: "MMMM D, YYYY")
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
    excerpt
    fields {
      slug
      timeToRead {
        minutes
        text
        time
        words
      }
    }
    headings {
      value
      depth
    }
  }
`;

export const SiteSiteMetadataOwnerFragment = graphql`
  fragment SiteSiteMetadataOwnerFragment on SiteSiteMetadataOwner {
    name
    surname
    twitter
    facebook
    social {
      uri
      label
    }
    location
    title
  }
`;

export const SiteMetadataFragment = graphql`
  fragment SiteMetadata on Site {
    siteMetadata {
      title
      titleTemplate
      description
      headline
      owner {
        ...SiteSiteMetadataOwnerFragment
      }
      siteUrl
      language
      siteImage
    }
  }
`;
