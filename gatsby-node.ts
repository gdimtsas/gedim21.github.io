import GithubSlugger from 'github-slugger';

// add timeToRead and slug fields to MDX nodes
const readingTime = require(`reading-time`);

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  
  const slugger = new GithubSlugger();
  
  if (node.internal.type === `Mdx`) {
    createNodeField({
      node,
      name: `timeToRead`,
      value: readingTime(node.body),
    });
    createNodeField({
      node,
      name: `slug`,
      value: `${slugger.slug(node.frontmatter.title)}`,
    });
  }
};

// Add headings to MDX nodes
const { compileMDXWithCustomOptions } = require(`gatsby-plugin-mdx`);
const { remarkHeadingsPlugin } = require(`./remark-headings-plugin`);

exports.createSchemaCustomization = async ({
  getNode,
  getNodesByType,
  pathPrefix,
  reporter,
  cache,
  actions,
  schema,
  store,
}) => {
  const { createTypes } = actions;

  const headingsResolver = schema.buildObjectType({
    name: `Mdx`,
    fields: {
      headings: {
        type: `[MdxHeading]`,
        async resolve(mdxNode) {
          const fileNode = getNode(mdxNode.parent);

          if (!fileNode) {
            return null;
          }

          const result = await compileMDXWithCustomOptions(
            {
              source: mdxNode.body,
              absolutePath: fileNode.absolutePath,
            },
            {
              pluginOptions: {},
              customOptions: {
                mdxOptions: {
                  remarkPlugins: [remarkHeadingsPlugin],
                },
              },
              getNode,
              getNodesByType,
              pathPrefix,
              reporter,
              cache,
              store,
            },
          );

          if (!result) {
            return null;
          }

          return result.metadata.headings;
        },
      },
    },
  });

  createTypes([
    `
      type MdxHeading {
        value: String
        depth: Int
      }
    `,
    headingsResolver,
  ]);
};

// Create pages for MDX nodes

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMdx {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            tags
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error loading MDX result', result.errors);
  }

  const posts = result.data.allMdx.nodes;

  const path = require('path');
  const postTemplate = path.resolve('src/templates/post.tsx');

  posts.forEach((node) => {
    createPage({
      // As mentioned above you could also query something else like frontmatter.title above and use a helper function
      // like slugify to create a slug
      path: `blog/${node.fields.slug}`,
      // Provide the path to the MDX content file so webpack can pick it up and transform it into JSX
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id , frontmatter: {}},
    });
  });

  const tags = {};
  posts
    .filter((node) => node.frontmatter.tags)
    .forEach((node) => {
      const tagsList = node.frontmatter.tags
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

      tagsList.forEach((tag: string) => {
        if (!tags[tag]) {
          tags[tag] = [];
        }
        tags[tag].push(node.slug);
      });
    });

  // Make tag pages
  const tagTemplate = path.resolve('src/templates/tag.tsx');

  Object.keys(tags).forEach((tag) => {
    createPage({
      path: `/blog/tag/${tag}/`,
      component: tagTemplate,
      context: {
        tag: tag,
      },
    });
  });
};
