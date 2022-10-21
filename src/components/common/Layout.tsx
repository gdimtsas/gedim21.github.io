import { Header, Footer } from './';
import { BlogPost } from '@/model/BlogPost';
import SEO from '../seo/SEO';

export const Layout = ({
  post,
  children,
}: {
  post?: BlogPost;
  children: any;
}) => {
  return (
    <>
      <SEO post={post} />
      <div className="text-gray-600 dark:text-gray-100 transition-all duration-300">
        <Header />
        <div className="container mx-auto pt-4 px-4">
          <main>{children}</main>
        </div>
        <div className="container mx-auto pt-4 px-4">
          <Footer />
        </div>
      </div>
    </>
  );
};
