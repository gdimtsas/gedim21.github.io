import { Person } from './Person';

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
