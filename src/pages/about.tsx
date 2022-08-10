import {
  faGithub,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import Layout from '../components/Layout';

const HomePage = () => {
  const { allFile } = useStaticQuery(graphql`
    query AboutQuery {
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
    <Layout>
      <div className="md:flex md:flex-row">
        <div className="flex-none self-center rounded-full overflow-hidden outline outline-offset-2 outline-indigo-500 shadow w-48 md:w-64">
          <GatsbyImage
            image={allFile.nodes[0].childImageSharp.gatsbyImageData}
            alt="profile image"
          />
        </div>

        <div className="grow md:ml-8">
          <h1>Hey there! 🎉</h1>
          <p>
            My name is <strong>Giorgos Dimtsas</strong>. I am a Software
            Engineer with a passion for anything programmable. I specialize in
            web apps developments using Java in the backend and React and
            Angular in the front.
          </p>

          <p>
            You can find me on
            <FontAwesomeIcon
              icon={faLinkedin}
              className="mx-2"
            ></FontAwesomeIcon>
            <strong>
              <a href="https://www.linkedin.com/in/giorgosdimtsas">LinkedIn</a>
            </strong>
            , follow me on
            <FontAwesomeIcon
              icon={faTwitter}
              className="mx-2"
            ></FontAwesomeIcon>
            <strong>
              <a href="https://twitter.com/gedim21" className="mr-1">
                Twitter
              </a>
            </strong>
            and keep track of what I&apos;m doing on
            <FontAwesomeIcon icon={faGithub} className="mx-2"></FontAwesomeIcon>
            <strong>
              <a href="https://github.com/gedim21">Github</a>
            </strong>
            . Also feel free to leave your comments in the blog posts with your
            feedback or your insights.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
