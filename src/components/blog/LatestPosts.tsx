import { BlogPost } from '@/model';
import { useState } from 'react';
import Search from '../Search';
import { PostCard } from './post';

const LatestPosts = ({ blogPosts }: { blogPosts: BlogPost[] }) => {
  const [query, setQuery] = useState('');

  return (
    <>
      <Search query={query} setQuery={setQuery} />
      {!query && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {blogPosts.map((blogPost) => (
            <PostCard key={blogPost.id} post={blogPost} />
          ))}
        </section>
      )}
    </>
  );
};

export default LatestPosts;
