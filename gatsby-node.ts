import type { GatsbyNode } from 'gatsby';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });
};

const path = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMdx(filter: { fileAbsolutePath: { glob: "**/blog/**/*" } }) {
        edges {
          node {
            slug
            frontmatter {
              tags
            }
          }
        }
      }
    }
  `);

  const tags = {};

  result.data.allMdx.edges
    .filter(({ node }) => node.frontmatter.tags)
    .forEach(({ node }) => {
      const tagsList = node.frontmatter.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      tagsList.forEach((tag) => {
        if (!tags[tag]) {
          tags[tag] = [];
        }
        tags[tag].push(node.slug);
      });
    });

  // Make tag pages
  const tagTemplate = path.resolve('src/templates/tags.tsx');
  
  Object.keys(tags).forEach((tag) => {
    createPage({
      path: `/blog/tags/${tag}/`,
      component: tagTemplate,
      context: {
        tag: tag,
      },
    });
  });
};
