import { Link } from 'gatsby';
import slugger from 'github-slugger';
import { useEffect, useRef, useState } from 'react';

type Heading = {
  value: string;
  depth: number;
};

interface TableOfContentsProps {
  headings: Heading[];
}

const useIntersectionObserver = (setActiveId: any) => {
  const headingElementsRef = useRef({});
  useEffect(() => {
    const callback = (headings: any) => {
      headingElementsRef.current = headings.reduce(
        (map: any, headingElement: any) => {
          map[headingElement.target.id] = headingElement;
          return map;
        },
        headingElementsRef.current,
      );

      const visibleHeadings: any = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id: string) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id),
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
    });

    const headingElements = Array.from(document.querySelectorAll('h2, h3'));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState();
  useIntersectionObserver(setActiveId);

  return (
    <ul className="sticky top-4">
      <li className="text font-bold">Table of Contents</li>
      {headings.map((h: Heading) => (
        <li
          key={h.value}
          className={`text-sm py-1 border-l-indigo-600 
          ${
            slugger.slug(h.value) === activeId
              ? ' text-indigo-600 border-l-2 font-semibold'
              : ''
          }
          ${h.depth === 3 ? ' pl-4' : h.depth === 4 ? 'pl-6' : ' pl-2'}
          `}
        >
          <Link to={'#' + slugger.slug(h.value)}>{h.value}</Link>
        </li>
      ))}
    </ul>
  );
};
export default TableOfContents;
