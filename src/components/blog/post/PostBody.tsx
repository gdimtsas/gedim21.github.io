import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Link } from 'gatsby';
import CodeBlock from '@/components/CodeBlock';
import { MDXProvider } from '@mdx-js/react';

const components = {
  pre: CodeBlock,
  Link,
};

const PostBody = ({ body }: { body: string }) => {
  return (
    <>
      <MDXProvider components={components}>
        <MDXRenderer>{body}</MDXRenderer>
      </MDXProvider>
    </>
  );
};

export default PostBody;
