// src/hooks/useMeta.js
import { useEffect } from "react";
import axios from "axios";
import API from "./api";

export default function useMeta(pageSlug) {
  useEffect(() => {
    if (!pageSlug) return;

    const fetchMeta = async () => {
      try {
        const encodedSlug = encodeURIComponent(pageSlug);
        const res = await API.get(`/meta?page_slug=${encodedSlug}`);
        const meta = res.data?.data;
        if (meta?.success &&!meta?.success) return;
        applyMeta(meta);
      } catch (error) {
        console.error("Error fetching meta:", error);
      }
    };

    fetchMeta();
  }, [pageSlug]);
}

const applyMeta = (meta) => {
  const head = document.head;
  const { meta_content, meta_tags, analytics } = meta || {};

  if (!meta_content) return;

  const {
    title,
    description,
    keywords,
    og_title,
    og_description,
    og_image,
    og_url,
  } = meta_content;

  // Set document title
  document.title = title || "Obsessions";

  // Remove existing meta tags (avoid duplicates)
  const selectors = [
    "meta[name='description']",
    "meta[name='keywords']",
    "meta[property^='og:']",
    "meta[name^='twitter:']",
  ];
  selectors.forEach((selector) =>
    document.querySelectorAll(selector).forEach((el) => el.remove())
  );

  // Add basic meta tags
  const metaList = [
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { property: "og:title", content: og_title },
    { property: "og:description", content: og_description || description },
    { property: "og:image", content: og_image },
    { property: "og:url", content: og_url },
  ];

  metaList.forEach(({ name, property, content }) => {
    if (!content) return;
    const tag = document.createElement("meta");
    if (name) tag.setAttribute("name", name);
    if (property) tag.setAttribute("property", property);
    tag.setAttribute("content", content);
    head.appendChild(tag);
  });

  // Inject raw meta tags (like Twitter card)
  if (meta_tags) {
    const temp = document.createElement("div");
    temp.innerHTML = meta_tags;
    temp.childNodes.forEach((node) => head.appendChild(node.cloneNode(true)));
  }

  // Inject Google Analytics
  if (analytics?.google_analytics) {
    const temp = document.createElement("div");
    temp.innerHTML = analytics.google_analytics;
    temp.childNodes.forEach((node) => head.appendChild(node.cloneNode(true)));
  }
};
