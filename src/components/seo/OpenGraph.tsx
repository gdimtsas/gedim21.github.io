import { Helmet } from 'react-helmet';

type Props = {
  url: string;
  name?: string;
  type: string;
  title: string;
  description: string;
  imageUrl?: string;
  locale: string;
  author: {
    name: string;
    surname: string;
  };
};

const OpenGraph = ({
  url,
  name,
  type,
  title,
  description,
  imageUrl,
  locale,
  author,
}: Props) => {
  return (
    <Helmet>
      {name && <meta property="og:site_name" content={name} />}
      <meta property="og:locale" content={locale} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={description} />
      <meta
        property="article:author"
        content={author.name + ' ' + author.surname}
      />
    </Helmet>
  );
};

export default OpenGraph;
