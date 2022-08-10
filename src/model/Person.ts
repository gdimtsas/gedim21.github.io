import { IGatsbyImageData } from 'gatsby-plugin-image';

export type SocialLink = {
  label: string;
  uri: string;
  icon: [string, string];
};

export interface Person {
  name: string;
  surname: string;
  title?: string;
  location?: string;
  twitter?: string;
  facebook?: string;
  social?: SocialLink[];
  image?: IGatsbyImageData;
}
