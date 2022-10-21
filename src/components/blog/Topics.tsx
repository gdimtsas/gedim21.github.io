import { graphql, useStaticQuery } from 'gatsby';
import Tag from './Tag';

const Topics = () => {
  const result = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          frontmatter {
            tags
          }
        }
      }
    }
  `);

  const tags: string[] = [];

  result.allMdx.nodes
    .filter((node) => node.frontmatter.tags)
    .forEach((node) => {
      const tagsList = node.frontmatter.tags
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

      tagsList.forEach((tag: string) => {
        tags.push(tag);
      });
    });

  const uniqueTags = [...new Set(tags)];

  return (
    <>
      {uniqueTags.map((tag) => (
        <Tag key={tag} tag={tag}></Tag>
      ))}
    </>
  );
};

export default Topics;
