import { useLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
import Twitter from './Twitter';
import OpenGraph from './OpenGraph';
import {
  BreadcrumbList,
  Article,
  Person as SchemaPerson,
  WebPage,
  Graph,
  WebSite,
} from 'schema-dts';
import moment from 'moment';
import { SiteMetadata, Person, BlogPost, SocialLink } from '@/model';

type Props = {
  siteMetadata: SiteMetadata;
  post?: BlogPost;
  author: Person;
};

const SEO = ({ siteMetadata, post, author }: Props) => {
  const { pathname } = useLocation();

  const me: SchemaPerson = {
    '@type': 'Person',
    '@id': 'https://giorgosdimtsas.net/#giorgosdimtsas',
    name: `${author.name} ${author.surname}`,
    sameAs: author.social?.map((social: SocialLink) => social.uri),
  };

  const meRef = {
    '@id': 'https://giorgosdimtsas.net/#giorgosdimtsas',
  };

  const website: WebSite = {
    '@type': 'WebSite',
    '@id': 'https://giorgosdimtsas.net/#website',
    url: siteMetadata.siteUrl,
    name: siteMetadata.title,
    description: siteMetadata.description,
    inLanguage: siteMetadata.language,
    author: meRef,
    creator: meRef,
    publisher: meRef,
    copyrightHolder: meRef,
    copyrightYear: new Date().getFullYear(),
  };

  const webpage: WebPage = {
    '@type': 'WebPage',
    '@id': 'https://giorgosdimtsas.net/#webpage',
    url: `${siteMetadata.siteUrl}${pathname}`,
    name: siteMetadata.title,
    description: siteMetadata.description,
    headline: siteMetadata.headline,
    inLanguage: siteMetadata.language,
    author: meRef,
    creator: meRef,
    publisher: meRef,
    copyrightHolder: meRef,
    copyrightYear: new Date().getFullYear(),
    image: {
      '@type': 'ImageObject',
      url: siteMetadata.imageUrl,
    },
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: post ? 'article.blog-post' : 'body main',
    },
    isPartOf: {
      '@id': 'https://giorgosdimtsas.net/#website',
    },
    breadcrumb: {
      '@id': 'https://giorgosdimtsas.net/#breadcrump',
    },
  };

  const article: Article = {
    '@type': 'Article',
    url: `${siteMetadata.siteUrl}${pathname}`,
    name: post?.title,
    description: siteMetadata.description,
    headline: siteMetadata.title,
    inLanguage: siteMetadata.language,
    datePublished: moment(post?.date).toISOString(),
    dateModified: moment(post?.date).toISOString(),
    author: meRef,
    creator: meRef,
    publisher: meRef,
    copyrightHolder: meRef,
    copyrightYear: new Date().getFullYear(),
    image: {
      '@type': 'ImageObject',
      url: `${post?.imageUrl}`,
    },
    mainEntityOfPage: {
      '@id': 'https://giorgosdimtsas.net/#webpage',
    },
  };

  const breadcrumb: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': 'https://giorgosdimtsas.net/#breadcrump',
    name: 'Breadcrumbs',
    description: 'Breadcrumbs list',
    itemListElement: [
      {
        '@type': 'ListItem',
        item: {
          '@id': siteMetadata.siteUrl,
          name: 'Homepage',
        },
        position: 1,
      },
      {
        '@type': 'ListItem',
        item: {
          '@id': `${siteMetadata.siteUrl}/blog`,
          name: 'Blog',
        },
        position: 2,
      },
      {
        '@type': 'ListItem',
        item: {
          '@id': `${siteMetadata.siteUrl}${pathname}`,
          name: `${post?.title}`,
        },
        position: 3,
      },
    ],
  };

  const graphSchema: Graph = {
    '@context': 'https://schema.org',
    '@graph': [me, website, webpage, breadcrumb, post && article],
  };

  return (
    <>
      <Helmet
        title={post ? post.title : siteMetadata.title}
        titleTemplate={siteMetadata.titleTemplate}
      >
        <html lang={siteMetadata.language} />
        <meta name="description" content={siteMetadata.description} />
        <meta name="image" content={post ? post.imageUrl : siteMetadata.imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify(graphSchema)}
        </script>
      </Helmet>

      <OpenGraph
        title={post ? post.title : siteMetadata.title}
        description={post ? post.description : siteMetadata.description}
        imageUrl={post ? post.imageUrl : siteMetadata.imageUrl}
        type={'article'}
        url={pathname}
        locale={'en_US'}
        author={{
          name: author.name,
          surname: author.surname,
        }}
        name={author.facebook}
      />

      <Twitter
        title={post ? post.title : siteMetadata.title}
        desc={post ? post.description : siteMetadata.description}
        imageUrl={post ? post.imageUrl : siteMetadata.imageUrl}
        type={'summary_large_image'}
        username={author.twitter}
      />
    </>
  );
};

export default SEO;
