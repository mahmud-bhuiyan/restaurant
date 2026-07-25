import { useEffect } from "react";

const SITE_NAME = "Epicurean Haven";

type PageMetaProps = {
  title: string;
  description?: string;
};

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      setMeta("description", description);
      setMeta("og:title", fullTitle, "property");
      setMeta("og:description", description, "property");
      setMeta("twitter:title", fullTitle);
      setMeta("twitter:description", description);
    }
  }, [title, description]);

  return null;
}

export { SITE_NAME };
