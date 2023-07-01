import { IconStyle } from '@fortawesome/fontawesome-svg-core';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { IGatsbyImageData } from 'gatsby-plugin-image';

export type SocialLink = {
  label: string;
  uri: string;
  iconPrefix: IconPrefix;
  iconName: IconName;
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
