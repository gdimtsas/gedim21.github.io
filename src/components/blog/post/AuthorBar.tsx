import { SocialLink } from '@/model';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import { OutboundLink } from 'gatsby-plugin-google-gtag';
import { GatsbyImage } from 'gatsby-plugin-image';

const AuthorBar = () => {
  const { site, allFile } = useStaticQuery(graphql`
    query MyQuery {
      site {
        siteMetadata {
          owner {
            name
            surname
            title
            location
            social {
              label
              uri
              icon
            }
          }
        }
      }
      allFile(filter: { name: { eq: "profile" } }) {
        nodes {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: CONSTRAINED)
          }
        }
      }
    }
  `);

  return (
    <div className="sticky top-4 flex flex-row items-center md:flex-col space-x-2 md:space-x-0">
      <div className="md:text-center flex-initial">
        <GatsbyImage
          className="rounded-full outline-indigo-500 shadow outline outline-offset-1 md:outline-offset-2 w-12 md:w-32"
          image={allFile.nodes[0].childImageSharp.gatsbyImageData}
          alt="profile image"
        />
      </div>
      <div className="md:mt-2 grow">
        <span>{`${site.siteMetadata.owner.name} ${site.siteMetadata.owner.surname}`}</span>
      </div>
      <div className="md:mt-2 grow hidden md:inline">
        <span>{site.siteMetadata.owner.title}</span>
      </div>
      <div className="md:mt-2 grow text-right md:text-left">
        <ul className="space-x-2 md:space-x-0 space-y-1 sm:inline md:block">
          <li className="hidden md:block">
            <FontAwesomeIcon icon={faLocationPin} className="mr-2" />
            {site.siteMetadata.owner.location}
          </li>
          {site.siteMetadata.owner.social != null &&
            site.siteMetadata.owner.social.map((social: SocialLink) => (
              <li key={social.label} className="inline md:block">
                <OutboundLink target={'_blank'} href={social.uri}>
                  <FontAwesomeIcon icon={social.icon} className="mr-2" />
                  <span className="hidden md:inline">{social.label}</span>
                </OutboundLink>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AuthorBar;
