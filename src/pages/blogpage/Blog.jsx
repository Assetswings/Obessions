import React, { useEffect, useState } from "react";
import "./Blog.css";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const BlogList = async () => {
    try {
      const res = await API.get("/blogs");
      if (res.data.status === 200) {
        setData(res.data?.data);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
  };

  useEffect(() => {
    document.title = "Obsession - Blog List";
    BlogList();
  }, []);

  const handleBlogClick = (slug) => {
    navigate("/blog-details", { state: { blog: slug } });
  };
  return (
    <>
      <div className="blog-container">
        {/* BLOG HEADER */}
        <header className="blog-header">
          <h1>BLOG</h1>
          <p style={{color:"#625E55"}}>Insights, stories, and updates from our world.</p>
        </header>

        {/* FEATURED POST */}
        <section className="featured-post pointer-crusser">
          <div onClick={() => handleBlogClick(data?.top_first?.slug)}>
            <img src={data?.top_first?.media} alt="Featured" />
          </div>

          <div className="featured-info">
            <div style={{position:"relative", top:"4%"}}>
              <div>
                <span className="read-time">3min Read</span>
              </div>
              <div>
                {/* <span className="post-date">Posted on {moment(data?.top_first?.created_at).format("DD MMM YYYY")}</span> */}
                <span className="post-date">
                  Posted on{" "}
                  {new Date(data?.top_first?.created_at).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
              <div onClick={() => handleBlogClick(data?.top_first?.slug)}>
                <h2>{data?.top_first?.name}</h2>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST POSTS */}
        <section className="latest-posts">
          <h3>Latest Posts</h3>
          <div className="posts-grid">
            {data?.latest_blogs?.data.map((post, index) => (
              <div className="post-card pointer-crusser" key={index} onClick={() => handleBlogClick(post?.action_url)}>
                <img src={post.media} alt={post.name} />
                <div className="post-info">
                  <div className="post-meta">
                    <span className="post-date">
                      Posted on{" "}
                      {new Date(post.created_at).toLocaleDateString(
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
                  <h4>{post.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recommended Posts */}
      {/* <section className="recommended-posts">
        <h2 className="recommended-title">Recommended Posts</h2>
        <div className="recommended-grid">
          <div className="recommended-card">
            <img src="https://i.ibb.co/YBxRhW0g/image-11.png" alt="Post 1" />
            <h4>How to Style Shelves Like a Pro</h4>
            <div className="txt_btn_recomend">
              <p>Posted on 2 May</p>
              <a href="#">Read More</a>
            </div>
          </div>
          <div className="recommended-card">
            <img src="https://i.ibb.co/LWdPJmp/image-12.png" alt="Post 2" />
            <h4>
              5 Luxurious Bathroom Accessories That Redefine Everyday Living
            </h4>
            <div className="txt_btn_recomend">
              <p>Posted on 2 May</p>
              <a href="#">Read More</a>
            </div>
          </div>
          <div className="recommended-card">
            <img src="https://i.ibb.co/qFCh8mYd/image-18.png" alt="Post 3" />
            <h4>How the Right Carpet Transforms Any Room</h4>
            <div className="txt_btn_recomend">
              <p>Posted on 2 May</p>
              <a href="#">Read More</a>
            </div>
          </div>
          <div className="recommended-card">
            <img src="https://i.ibb.co/HL50G1p7/image-14.png" alt="Post 4" />
            <h4>How Stylish Waste Bins Upgrade Your Space</h4>
            <div className="txt_btn_recomend">
              <p>Posted on 2 May</p>
              <a href="#">Read More</a>
            </div>
          </div>
        </div>
      </section> */}
      <Footer />
    </>
  );
};

export default Blog;
