import Giscus from '@giscus/react';
import { graphql, useStaticQuery } from 'gatsby';

export const GiscusComments = () => {
  const { site } = useStaticQuery(
    graphql`
      query CommentsConfig {
        site {
          siteMetadata {
            comments {
              giscus {
                repo
                repoId
                category
                categoryId
                mapping
                reactions
                emitMetadata
                inputPosition
                theme
                lang
                loading
              }
            }
          }
        }
      }
    `,
  );

  const config = site.siteMetadata.comments.giscus;

  return (
    <Giscus
      id="comments"
      repo={config.repo}
      repoId={config.repoId}
      category={config.category}
      categoryId={config.categoryId}
      mapping={config.mapping}
      reactionsEnabled={config.reactions}
      emitMetadata={config.emitMetadata}
      inputPosition={config.inputPosition}
      theme={config.theme}
      lang={config.lang}
      loading={config.loading}
    ></Giscus>
  );
};
