import "@fontsource/open-sans";
import "@fontsource/inter"

// custom typefaces
import './src/styles/global.css';
import './src/styles/typography.css';

import Prism from "prismjs";
(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-solidity");
require("prismjs/components/prism-csharp");
// require("prismjs/components/prism-cpp");
require("prismjs/components/prism-yaml");
require("prismjs/components/prism-java");

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
library.add(faGithub, faLinkedin, faTwitter, faEnvelope, faMoon, faSun)
