import { IGatsbyImageData } from 'gatsby-plugin-image';

export interface  SearchResult {
    id: string;
    slug: string;
    title: string;
    description: string;
    tags: string[];
    categories: string[];
    date: Date;
    timeToRead: number;
    excerpt: string;
    image: IGatsbyImageData;
  };