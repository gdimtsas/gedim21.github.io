import { BlogPost, SearchResult } from "@/model";
import { graphql, useStaticQuery } from "gatsby";
import { useFlexSearch } from "react-use-flexsearch";
import { PostCard } from "./blog/post";

const Search = ({ query, setQuery }: { query: string; setQuery: any }) => {
  const data = useStaticQuery(graphql`
    query {
      localSearchPosts {
        index
        store
      }
    }
  `);

  const { index, store } = data.localSearchPosts;
  const results = useFlexSearch(query, index, store);

  const toBlogPost = (result: SearchResult): BlogPost => {
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      excerpt: result.excerpt,
      slug: result.slug,
      date: result.date,
      timeToRead: result.timeToRead,
      tags: result.tags,
      categories: result.categories,
      image: result.image,
    };
  };

  return (
    <div className="my-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter you search term..."
        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
      />
      {query && (
        <>
          {results.length === 1 ? (
            <div className="my-2">{results.length} result found</div>
          ) : (
            <div className="my-2">{results.length} results found</div>
          )}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {results.map((result: SearchResult) => (
              <PostCard key={result.id} post={toBlogPost(result)}></PostCard>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default Search;
