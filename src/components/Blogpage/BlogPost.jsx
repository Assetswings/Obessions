import React from "react";
import "./BlogPost.css";
import Footer from "../Footer/Footer";

const BlogPost = () => {
  return (
    <div className="blog-post">
      {/* Hero */}
      <section className="hero">
        <img
          src="https://i.ibb.co/352NqkXJ/room-decor-with-potted-monstera-plant.png"
          alt="Natural Decor Hero"
          className="hero-image"
        />
      </section>

      {/* Main Section */}
      <section className="post-wrapper">
        {/* Left Blog Content */}
        <div className="post-main">
          <p className="post-date">Posted on 02 May 2025</p>
          <h1 className="post-title">
            Natural Accents: Creating a Calming Corner with Earthy Elements
          </h1>
          <div className="sector_image">
             <div>
            <img
            src="https://i.ibb.co/cV6M9j4/image-396.png"
            alt="Chair and Plants"
            className="main-img"
          />
 <p className="img-credit">Credits : respective owner</p>
           </div> 
       
            </div> 
           
          <p className="post-subtitle">
            A cozy blend of boho and vintage natural cane chair, tropical greens, and woven textures come together
            to create a warm, grounded corner full of character.
          </p>

          <h3 className="post-subheading">
            Looking to refresh your space without overwhelming it? Start with a corner.
          </h3>
          <p className="post-text">
            This cozy setup celebrates natural textures, earthy tones, and organic shapes, making it the perfect
            retreat inside your home. The deep green of the Monstera plant brings life and freshness, while woven
            baskets double as elegant storage and grounding decor.
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
              Indoor plants like the Monstera deliciosa or bonsai trees add structure and tranquility. Their lush, sculptural leaves
              become a visual focal point, instantly energizing neutral interiors.
            </li>
            <li>
              <p className="item-to-list">Embrace Natural Storage</p>
              Replace synthetic containers with woven rattan or wicker baskets. They not only keep clutter out of sight but
              introduce warmth and handmade charm to the room.
            </li>
            <li >
              <p className="item-to-list">Add a Timeless Seat</p>
              A simple velvet or fabric armchair in muted green tones pairs beautifully with plants, blending seamlessly into the
              natural theme while providing a cozy reading spot or relaxation area.
            </li>
            <li>
              <p className="item-to-list">Keep It Minimal</p>
              Leave negative space around your setup. A clean, plaster-textured wall allows the greens and browns to shine. The
              result? A balanced, calming atmosphere that feels effortlessly chic.
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
            Incorporating natural accents like lush green plants, woven baskets, and timeless wooden furniture is a simple yet
            powerful way to infuse your home with depth, warmth, and character. These elements not only enhance visual
            appeal but also promote a calming, grounded atmosphere. Start by styling just one corner — a quiet reading nook,
            an entryway, or a forgotten hallway — and let that space inspire the flow and energy of your entire home. With
            thoughtful touches and a connection to nature, your space can truly become a sanctuary of comfort and style.
          </p>

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
            <li>
              <img src="https://i.ibb.co/YBxRhW0g/image-11.png" alt="Related 1" />
              <div>
                <p>How to Style Shelves Like a Pro</p>
                <span>Balancing beauty and function is key to a great shelf design. Learn the art of layering books, plants, and personal items for a Pinterest-worthy look.</span>
              </div>
            </li>
            <li>
              <img src="https://i.ibb.co/LWdPJmp/image-12.png" alt="Related 2" />
              <div>
                <p>5 Luxurious Bathroom Accessories That Redefine Everyday Living</p>
                <span>Balancing beauty and function is key to a great shelf design. Learn the art of layering books, plants, and personal items for a Pinterest-worthy look.</span>
              </div>
            </li>
            <li>
              <img src="https://i.ibb.co/Jjb3scKG/image-13.png" alt="Related 3" />
              <div>
                <p>How the Right Carpet Transforms Any Room</p>
                <span>Balancing beauty and function is key to a great shelf design. Learn the art of layering books, plants, and personal items for a Pinterest-worthy look.</span>
              </div>
            </li>
            <li>
              <img src="https://i.ibb.co/HL50G1p7/image-14.png" alt="Related 4" />
              <div>
                <p>How Stylish Waste Bins Upgrade Your Space</p>
                <span>Balancing beauty and function is key to a great shelf design. Learn the art of layering books, plants, and personal items for a Pinterest-worthy look.</span>
              </div>
            </li>
            <li>
              <img src="https://i.ibb.co/SDgkBf3s/image-15.png" alt="Related 5" />
              <div>
                <p>From Chaos to Calm: Must-Have Organizers for Every Room</p>
                <span>Balancing beauty and function is key to a great shelf design. Learn the art of layering books, plants, and personal items for a Pinterest-worthy look.</span>
              </div>
            </li>
          </ul>
        </aside>
      </section>
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
      <h4>5 Luxurious Bathroom Accessories That Redefine Everyday Living</h4>
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
 {/* Footer */}
 <Footer />
    </div>
       
  );
};

export default BlogPost;
