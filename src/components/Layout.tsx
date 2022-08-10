import Header from './Header';
import Footer from './Footer';
import { BlogPost } from '@/model/BlogPost';
import { Person } from '@/model/Person';
import SEO from './seo/SEO';
import { graphql, useStaticQuery } from 'gatsby';
import { SiteMetadata } from '@/model';

const Layout = ({
  post,
  author,
  children,
}: {
  post?: BlogPost;
  author?: Person;
  children: any;
}) => {
  const { site } = useStaticQuery(query);

  const siteMetadata: SiteMetadata = {
    title: site.siteMetadata.title,
    titleTemplate: site.siteMetadata.titleTemplate,
    description: site.siteMetadata.description,
    headline: site.siteMetadata.headline,
    language: site.siteMetadata.language,
    siteUrl: site.siteMetadata.siteUrl,
    imageUrl: `${site.siteMetadata.siteUrl}${site.siteMetadata.siteImage}`,
    owner: site.siteMetadata.owner,
  };

  return (
    <>
      <SEO siteMetadata={siteMetadata} post={post} author={siteMetadata.owner} />
      <div className="text-gray-600 dark:text-gray-100 transition-all duration-300">
        <Header />
        <div className="container mx-auto pt-4 px-4">
          <main>{children}</main>
        </div>
        <div className="container mx-auto pt-4 px-4">
          <Footer />
        </div>
      </div>
    </>
  );
};

const query = graphql`
  query ArticleSEO {
    site {
      siteMetadata {
        title
        titleTemplate
        description
        headline
        owner {
          name
          surname
          twitter
          facebook
          social {
            uri
          }
        }
        siteUrl
        language
        siteImage
      }
    }
  }
`;

export default Layout;
