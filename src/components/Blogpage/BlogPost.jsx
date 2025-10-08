import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./BlogPost.css";
import Footer from "../Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../app/api";

const BlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blugSlug = location.state?.blog;
  const [data, setData] = useState("");
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [blugSlug]);

  useEffect(() => {
    if (blugSlug) {
      getBlogDetails(blugSlug);
    }
  }, [blugSlug]);

  const getBlogDetails = async (blugSlug) => {
    try {
      const res = await API.get("/blogs/" + blugSlug);
      if (res.data.status === 200) {
        setData(res.data?.data);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
  };

  const handleBlogClick = (slug) => {
    navigate("/blog-details", { state: { blog: slug } });
  };
  return (
    <div className="blog-post">
      {/* Hero */}
      <section className="hero">
        <img
          src={data?.blog?.media}
          alt={data?.blog?.name}
          className="hero-image"
        />
      </section>

      {/* Main Section */}
      <section className="post-wrapper">
        {/* Left Blog Content */}
        <div className="post-main">
          <p className="post-date">
            Posted on{" "}
            {new Date(data?.blog?.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          <div className="terms-container">
            <div dangerouslySetInnerHTML={{ __html: data.blog?.description }} />
          </div>

          {/* <h1 className="post-title">{data?.blog?.name}</h1> */}
          {/* <div className="sector_image">
            <div>
              <img
                src="https://i.ibb.co/cV6M9j4/image-396.png"
                alt="Chair and Plants"
                className="main-img"
              />
              <p className="img-credit">Credits : {data?.blog?.admin?.name}</p>
            </div>
          </div>

          <p className="post-subtitle">
            A cozy blend of boho and vintage natural cane chair, tropical
            greens, and woven textures come together to create a warm, grounded
            corner full of character.
          </p>

          <h3 className="post-subheading">
            Looking to refresh your space without overwhelming it? Start with a
            corner.
          </h3>
          <p className="post-text">
            This cozy setup celebrates natural textures, earthy tones, and
            organic shapes, making it the perfect retreat inside your home. The
            deep green of the Monstera plant brings life and freshness, while
            woven baskets double as elegant storage and grounding decor.
          </p>
          <p className="post-text">Here’s how you can recreate the look:</p>

          <img
            src="https://i.ibb.co/svWqjWTy/image-397.png"
            alt="Chair and Plants"
            className="main-img_2"
          />
          <ol className="how-to-list">
            <li>
              <p className="item-to-list"> Go Green with Purpose</p>
              Indoor plants like the Monstera deliciosa or bonsai trees add
              structure and tranquility. Their lush, sculptural leaves become a
              visual focal point, instantly energizing neutral interiors.
            </li>
            <li>
              <p className="item-to-list">Embrace Natural Storage</p>
              Replace synthetic containers with woven rattan or wicker baskets.
              They not only keep clutter out of sight but introduce warmth and
              handmade charm to the room.
            </li>
            <li>
              <p className="item-to-list">Add a Timeless Seat</p>A simple velvet
              or fabric armchair in muted green tones pairs beautifully with
              plants, blending seamlessly into the natural theme while providing
              a cozy reading spot or relaxation area.
            </li>
            <li>
              <p className="item-to-list">Keep It Minimal</p>
              Leave negative space around your setup. A clean, plaster-textured
              wall allows the greens and browns to shine. The result? A
              balanced, calming atmosphere that feels effortlessly chic.
            </li>
          </ol>

          <div className="youtube-video">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/whu0Ls8inVI?si=56p-ciN6fDmkF3D9"
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="post-text">
            Incorporating natural accents like lush green plants, woven baskets,
            and timeless wooden furniture is a simple yet powerful way to infuse
            your home with depth, warmth, and character. These elements not only
            enhance visual appeal but also promote a calming, grounded
            atmosphere. Start by styling just one corner — a quiet reading nook,
            an entryway, or a forgotten hallway — and let that space inspire the
            flow and energy of your entire home. With thoughtful touches and a
            connection to nature, your space can truly become a sanctuary of
            comfort and style.
          </p> */}

          {/* <div className="connect-footer">
            <p>Connect With Us :</p>
            <div className="social-icons">
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-brands fa-youtube"></i>
            </div> */}
        </div>

        {/* Right Sidebar */}
        <aside className="post-sidebar">
          <h4 className="sidebar-title">Related Posts</h4>
          <ul className="related-list">
            {data?.related?.map((post, index) => (
              <li key={index}>
                <img src={post?.media} alt="Related 1" onClick={() => handleBlogClick(post?.action_url)} className="pointer-crusser"/>
                <div className="pointer-crusser">
                  <p onClick={() => handleBlogClick(post?.action_url)}>{post?.name}</p>
                  <span>
                    {post?.description?.split(" ").slice(0, 15).join(" ")}
                    {post?.description?.split(" ").length > 15 ? "..." : ""}
                  </span>
                </div>
              </li>
            ))}
            {/* {data?.related?.map((post, index) => {
              // Remove HTML tags safely
              const plainText = post?.description?.replace(/<[^>]+>/g, "");
              const words = plainText?.split(" ") || [];

              return (
                <li key={index}>
                  <img src={post?.media} alt={`Related ${index + 1}`} />
                  <div>
                    <p onClick={() => handleBlogClick(post?.action_url)}>
                      {post?.name}
                    </p>
                    <span>
                      {words.slice(0, 15).join(" ")}
                      {words.length > 15 ? "..." : ""}
                    </span>
                  </div>
                </li>
              );
            })} */}
          </ul>
        </aside>
      </section>
      {/* Recommended Posts */}
      <section className="recommended-posts">
        <h2 className="recommended-title">Recommended Posts</h2>
        <div className="recommended-grid">
          {data?.recommended?.map((post, index) => (
            <div className="recommended-card pointer-crusser" key={index}>
              <img src={post?.media} alt="Post 1" onClick={() => handleBlogClick(post?.action_url)}/>
              <p>{post?.name}</p>
              <div className="txt_btn_recomend">
                <p>
                  Posted on{" "}
                  {new Date(post?.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <a onClick={() => handleBlogClick(post?.action_url)}>
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogPost;
