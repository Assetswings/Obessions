import React, { useEffect, useState } from "react";
import "./Blog.css";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";

const Blog = () => {
  const [data, setData] = useState(null);

  const BlogList = async () => {
    try {
      const res = await API.get("/blogs");
      if (res.data.status === 200) {
        setData(res.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.title = "Obsessions - Blog List";
    BlogList();
  }, []);

  const breadcrumbPaths = [{ label: "Blog", to: "" }];

  return (
    <>
      <Breadcrumbs paths={breadcrumbPaths} />

      <div className="blog-container">
        {/* BLOG HEADER */}
        <header className="blog-header">
          <h1>BLOG</h1>
          <p style={{ color: "#625E55" }}>
            Insights, stories, and updates from our world.
          </p>
        </header>

        {/* FEATURED POST */}
        {data?.top_first && (
          <section className="featured-post">
            <div className="blog_image_trcak">
              <Link to={`/blog-details/${data?.top_first?.slug}`}>
                <img
                  src={data?.top_first?.media}
                  alt={data?.top_first?.slug}
                />
              </Link>
            </div>

            <div className="featured-info">
              <div style={{ position: "relative", top: "4%" }}>
                <div>
                  <span className="read-time">3min Read</span>
                </div>

                <div>
                  <span className="post-date">
                    Posted on{" "}
                    {new Date(
                      data?.top_first?.created_at
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div>
                  <Link to={`/blog-details/${data?.top_first?.slug}`}>
                    <h2>{data?.top_first?.name}</h2>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LATEST POSTS */}
        <section className="latest-posts">
          <h3>Latest Posts</h3>

          <div className="posts-grid">
            {data?.latest_blogs?.data?.map((post, index) => (
              <div className="post-card" key={index}>
                {/* Image Clickable */}
                <Link to={`/blog-details/${post?.action_url}`}>
                  <img src={post?.media} alt={post?.name} />
                </Link>

                <div className="post-info">
                  <div className="post-meta">
                    <span className="post-date">
                      Posted on{" "}
                      {new Date(post?.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span>{post?.readTime}</span>
                  </div>

                  {/* Title Clickable */}
                  <Link to={`/blog-details/${post?.action_url}`}>
                    <h4>{post?.name}</h4>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Blog;
