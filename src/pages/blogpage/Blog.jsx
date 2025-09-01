import React from "react";
import "./Blog.css";
import Footer from "../../components/Footer/Footer";

  const Blog = () => {
  const posts = [
    {
      img: "https://i.ibb.co/Q1Jdj72/image-23.png",
      title: "How to Style Shelves Like a Pro",
      date: "2 May",
      readTime: "10min Read",
    },
    {
      img: "https://i.ibb.co/Q1Jdj72/image-23.png",
      title: "5 Luxurious Bathroom Accessories That Redefine…",
      date: "2 May",
      readTime: "5min Read",
    },
    {
      img: "https://i.ibb.co/mVcf39xN/image-25.png",
      title: "How the Right Carpet Transforms Any Room",
      date: "2 May",
      readTime: "6min Read",
    },
  ];

  return (
    <>
      <div className="blog-container">
        {/* BLOG HEADER */}
        <header className="blog-header">
          <h1>BLOG</h1>
          <p>Insights, stories, and updates from our world.</p>
        </header>

        {/* FEATURED POST */}
        <section className="featured-post">
          <div>
            <img
              src="https://i.ibb.co/ZR4HyPrb/room-decor-with-potted-monstera-plant-1.jpg"
              alt="Featured"
            />
          </div>

          <div className="featured-info">
            <div>
              <div>
                <span className="read-time">3min Read</span>
              </div>
              <div>
                <span className="post-date">Posted on 02 May 2025</span>
              </div>
              <div>
                <h2>
                  Natural Accents: Creating a Calming Corner with Earthy
                  Elements
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST POSTS */}
        <section className="latest-posts">
          <h3>Latest Posts</h3>
          <div className="posts-grid">
            {posts.concat(posts).map((post, index) => (
              <div className="post-card" key={index}>
                <img src={post.img} alt={post.title} />
                <div className="post-info">
                  <div className="post-meta">
                    <span>Posted on {post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4>{post.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recommended Posts */}
      <section className="recommended-posts">
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
      </section>
      <Footer />
    </>
  );
};

export default Blog;
