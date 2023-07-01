import { Highlight, themes } from "prism-react-renderer";
import Prism from "prismjs";

export const CodeBlock = (props: any) => {
  const className = props.children.props.className || "";
  const matches = className.match(/language-(?<lang>.*)/);

  return (
    <Highlight
      prism={Prism}
      theme={themes.duotoneDark}
      code={props.children.props.children.trim()}
      language={
        matches && matches.groups && matches.groups.lang
          ? matches.groups.lang
          : ""
      }
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
