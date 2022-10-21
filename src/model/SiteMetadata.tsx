import { Person } from './Person';

export interface SiteMetadataNode {
  title: string;
  titleTemplate: string;
  description: string;
  headline: string;
  owner: Person;
  siteUrl: string;
  language: string;
  siteImage: string;
}

export interface SiteMetadata {
  title: string;
  titleTemplate: string;
  description: string;
  headline: string;
  language: string;
  siteUrl: string;
  imageUrl: string;
  owner: Person;
}

export const toSiteMetadata = (
  siteMetadata: SiteMetadataNode,
): SiteMetadata => {
  return {
    title: siteMetadata.title,
    titleTemplate: siteMetadata.titleTemplate,
    description: siteMetadata.description,
    headline: siteMetadata.headline,
    language: siteMetadata.language,
    siteUrl: siteMetadata.siteUrl,
    imageUrl: `${siteMetadata.siteUrl}${siteMetadata.siteImage}`,
    owner: siteMetadata.owner,
  };
};
