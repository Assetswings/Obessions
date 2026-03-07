import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./BlogPost.css";
import Footer from "../Footer/Footer";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../app/api";
import Breadcrumbs from "../Breadcum/Breadcrumbs";
import insta from '../../assets/icons/Insta.png';
import facebookimg from "../../assets/icons/facebook.png"
import youtube from '../../assets/icons/youtube.png';
import { Share2 } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { Facebook, Instagram, } from "lucide-react";
const BlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = useParams();
  const blugSlug = location.state?.blog || blog || null;
  const [data, setData] = useState("");
  const currentUrl = window.location.href;
  const [open, setOpen] = useState(false);

  const shareText = encodeURIComponent(data?.blog?.name || "Check this out");
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;
  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(
    currentUrl
  )}`;


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



  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: window.location.href,
        });
      } catch (e) {
        console.log("Share cancelled");
      }
    } else {
      alert("Sharing not supported on this browser");
    }
  };
  const handleBlogClick = (slug) => {
    navigate("/blog-details", { state: { blog: slug } });
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    const cleanUrl = url.trim();

    if (cleanUrl.includes("/embed/")) return cleanUrl;

    const match = cleanUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
    );

    return match
      ? `https://www.youtube.com/embed/${match[1]}`
      : "";
  };

  const shortTitle =
    data?.blog?.name?.length > 10
      ? data.blog.name.substring(0, 10) + "..."
      : data?.blog?.name;

  const breadcrumbPaths = [
    { label: "Blog", to: "/blog" },
    { label: shortTitle || "Loading...", to: "" },
  ];

  const encodedUrl = encodeURIComponent();
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: `https://www.instagram.com/?url=${encodedUrl}`,
  };

  return (
    <>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="blog-post">
        {/* Hero */}
        <section className="hero">
          <img
            src={data?.blog?.media}
            alt={data?.blog?.name}
            className="hero-image-blog"
          />
        </section>

        {/* Main Section */}
        <section className="post-wrapper">
          {/* Left Blog Content */}
          <div>
            <div className="post-main">
              <div className="track_share_bt">
                <div>
                  <p className="post-date">
                    Posted on{" "}
                    {new Date(data?.blog?.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <div>
                  </div>
                </div>


                <div className="share_root">
                  <div className="share_btn mobshare" onClick={handleShare}>
                    <span><Share2 size={14} /></span>
                    <span style={{ fontSize: '13px', paddingLeft: "5px" }}>SHARE</span>
                  </div>
                </div>
              </div>

                <div className="track_hole">
                <div>
                <h1 className="post-title">{data?.blog?.name}</h1>
                </div>
              </div>

              {/* Share Button or Skeleton for Web */}
              {/* Dropdown */}
              {open && (
                <>
                  <div className="relative">
                    <div
                      className="absolute left-1/2 -translate-x-1/2  shadow-lg rounded-xl p-3 mt-2 flex gap-3 z-999999  track_bound2"
                      onMouseLeave={() => setOpen(false)}
                      onMouseEnter={() => setOpen(true)}>
                      {/* WhatsApp */}
                      <a
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100 transition">
                        <BsWhatsapp size={16} className="text-green-600" />
                      </a>

                      {/* Facebook */}
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <Facebook size={16} className="text-blue-600" />
                      </a>
                      {/* Instagram */}
                      <a
                        href={shareLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <Instagram size={16} className="text-pink-500" />
                      </a>
                    </div>
                  </div>
                </>
              )}
              {/* <div className="post-subtitle">
                <div dangerouslySetInnerHTML={{ __html: data.blog?.description }} />
              </div>
              <div className="track_social-mlb">
                <div className="track-flex-social"> Connect With Us : <div> <img src={insta} /></div> <div> <img src={facebookimg} /></div>  <div> <img src={youtube} /></div></div>
              </div>
              <h1 className="post-title">{data?.blog?.name}</h1> */}
              <div className="sector_image">
                <div>
                  <img
                    src={data.blog?.media_1}
                    alt="Chair and Plants"
                    className="main-img"
                  />
                  <p className="img-credit">Credits : {data?.blog?.admin?.name}</p>
                </div>
              </div>
            </div>

            <p className="post-subtitle">
              {/* A cozy blend of boho and vintage natural cane chair, tropical
              greens, and woven textures come together to create a warm, grounded
              corner full of character. */}
              {data?.blog?.other_desc_1}
            </p>

            <h3 className="post-subheading">
              {/* Looking to refresh your space without overwhelming it? Start with a
              corner. */}
              {data?.blog?.other_head_1}
            </h3>
            <p className="post-text">
              {data.blog?.other_desc_2}
            </p>
            <p className="post-text">{data.blog?.other_head_2}</p>

            <img
              src={data?.blog?.media_2}
              alt="Chair and Plants"
              className="main-img_2_blog"
              style={{ marginBottom: '25px', width: '100%' }}
            />
            <ol className="how-to-list">
              {data.blog?.content.map((data, i) => (
                <li>
                  <p className="item-to-list">{data?.heading}</p>
                  <p className="item_track_des_blog">{data?.description} </p>

                </li>
              ))}
            </ol>

            <div className="youtube-video">
              {/* <iframe
                width="100%"
                height="400"
                src={getYoutubeEmbedUrl(data.blog?.video)}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              /> */}
              <iframe
                width="100%"
                height="400"
                src={`${data.blog?.video}?autoplay=1&mute=1&playsinline=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ width: "100%", height: "400" }}
              ></iframe>
            </div>
            <p className="post-text">
              {data.blog?.description}
            </p>

            <div className="connect-footer">
              <div className="social-icons-blog">
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-youtube"></i>
              </div>
            </div>
          </div>
          {/* Right Sidebar */}
          <div style={{ position: "sticky", top: "1px" }}>
            <aside className="post-sidebar web">
              <h4 className="sidebar-title">Related Posts</h4>
              <ul className="related-list">
                {data?.related?.map((post, index) => (
                  <li key={index}>
                    <Link to={`/blog-details/${post?.action_url}`}>
                      <div className="finder_track">
                        <div>
                          <img src={post?.media} alt="Related 1" className="pointer-crusser" />
                        </div>

                        <div className="pointer-crusser">
                          <p>{post?.name}</p>
                          <span>
                            {post?.description?.split(" ").slice(0, 15).join(" ")}
                            {post?.description?.split(" ").length > 15 ? "..." : ""}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <div className="track_social">
          <div className="track-flex-social">
            Connect With Us :

            <a
              href={instagramShareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={insta} />
            </a>

            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={facebookimg} />
            </a>


          </div>

        </div>
        {/* Recommended Posts Mobile */}
        <section on className="flat_overview mob">
          <h4 className="releted-head">Recommended Posts</h4>
          <div className="promo-section relet-blog-sec">
            {data?.recommended?.map((post, index) => (
              <div
                className="promo-card"
                key={index.id} >
                <img
                  src={post?.media}
                  alt={post?.name}
                  className="promo-image pointer-crusser relet-blog-img-sec"
                />
                <div >
                  <p className="relatedpost-mob">
                    {post?.name
                      ? post?.name.substring(0, 40) + (post?.name.length > 40 ? "..." : "")
                      : ""}
                  </p>
                </div>

                <div className="txt_btn_recomend">
                  <p className="reletepost-mob-poston">
                    Posted on{" "}
                    {new Date(post?.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <Link to={`/blog-details/${post?.action_url}`} className="releted-readmore">
                    <u>Read More</u>
                  </Link>
                </div>
              </div >
            ))}
          </div >
        </section>
        {/* Recommended Posts */}
        <section className="recommended-posts web">
          <h2 className="recommended-title">Recommended Posts</h2>
          <div className="recommended-grid">
            {data?.recommended?.map((post, index) => (
              <div className="recommended-card pointer-crusser" key={index}>
                <Link to={`/blog-details/${post?.action_url}`}>
                  <img src={post?.media} alt="Post 1" />
                </Link>
                <p className="relet-post-name">{post?.name}</p>
                <div className="txt_btn_recomend">
                  <p>
                    Posted on{" "}
                    {new Date(post?.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <Link to={`/blog-details/${post?.action_url}`}>
                    <u>Read More</u>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Releted Posts Mobile*/}
        <section className="recommended-posts mob">
          <h2 className="recommended-title">Related Posts</h2>
          <div className="recommended-grid">
            {data?.related?.map((post, index) => (
              <div className="recommended-card pointer-crusser" key={index}>
                <Link to={`/blog-details/${post?.action_url}`}>
                  <img src={post?.media} alt="Post 1" />
                </Link>
                <p className="relet-post-name">{post?.name}</p>
                {/* <div className="txt_btn_recomend">
                  <p>
                    Posted on{" "}
                    {new Date(post?.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <Link to={`/blog-details/${post?.action_url}`}>
                    <u>Read More</u>
                  </Link>
                </div> */}
                <div className="txt_btn_recomend">
                  <p className="reletepost-mob-poston">
                    Posted on{" "}
                    {new Date(post?.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <Link to={`/blog-details/${post?.action_url}`} className="releted-readmore">
                    <u>Read More</u>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
