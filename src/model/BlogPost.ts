import { IGatsbyImageData } from 'gatsby-plugin-image';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: Date;
  timeToRead: number;
  image: IGatsbyImageData;
  imageUrl: string;
  tags: string[];
  categories: string[];
}
