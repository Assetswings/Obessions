import React from "react";
import "./SizeGuide.css";
import Footer from "../../components/Footer/Footer";
import heroImg from "../../assets/images/sizehero.png";
import shape from "../../assets/icons/noun-room.png";
import mesure from "../../assets/icons/tabler_ruler.png";
import decode from "../../assets/icons/noun-paint-brush.png";
import chose from "../../assets/icons/noun-cursor.png";
import setone from "../../assets/images/image_set1.png";
import settwo from "../../assets/images/image_set2.png";


// image for trackelt
import newset1 from "../../assets/images/img_b1.png"; 
import newset2 from "../../assets/images/img_b2.png"; 
import newset3 from "../../assets/images/img_b3.png"; 
import newset4 from "../../assets/images/img_b5.png"; 
import newset5 from "../../assets/images/image_b4.png"; 


  const SizeGuide = () => {
  const stylesData = [
    {
      id: 1,
      title: "BOHEMIAN",
      description:
        "A Bohemian home feels like a personal art gallery layered with stories, colours, and textures. Your living room might have a macramé wall hanging, a jute pouffe, and a mix of wooden and wicker furniture. The bedroom could feature block-printed bedcovers, patterned cushions, and plants in every corner. Even the balcony feels like an urban jungle with fairy lights and a low table for evening chai. A carpet here ties everything together—the more layered and artisanal, the better.",
      image: setone,
      recommendations: [
        { img: newset1, label: "Ethnic" },
        { img: newset2, label: "Floral" },
        { img: newset3, label: "Moroccan" },
        { img: newset4, label: "Printed" },
        { img: newset5, label: "Textured" },
      ],
      buttonText: "EXPLORE BOHEMIAN CARPETS",
    },
    {
      id: 2,
      title: "MAXIMALIST",
      description:
        "Maximalism is not about clutter — it’s about curated abundance. Picture a living room with bold sofas, patterned wallpaper, and statement art pieces. The dining room might have a mismatched set of chairs and a gallery wall full of family photos. The home office has vibrant bookshelves and colourful stationery that keep inspiration alive. A carpet in such a home can go wild with colour and design — geometric, zig-zag, or even a playful floral. It adds one more joyful layer to the story.",
      image: settwo,
      recommendations: [
        { img: newset3, label: "Geometric" },
        { img:newset5, label: "Floral" },
        { img: newset2, label: "Abstract" },
        { img:newset1 , label: "Striped" },
      ],
      buttonText: "EXPLORE MAXIMALIST CARPETS",
    },
    {
      id: 3,
      title: "MAXIMALIST",
      description:
        "Maximalism is not about clutter — it’s about curated abundance. Picture a living room with bold sofas, patterned wallpaper, and statement art pieces. The dining room might have a mismatched set of chairs and a gallery wall full of family photos. The home office has vibrant bookshelves and colourful stationery that keep inspiration alive. A carpet in such a home can go wild with colour and design — geometric, zig-zag, or even a playful floral. It adds one more joyful layer to the story.",
      image: setone,
      recommendations: [
        { img: newset1, label: "Ethnic" },
        { img: newset2, label: "Floral" },
        { img: newset3, label: "Moroccan" },
        { img: newset4, label: "Printed" },
        { img: newset5, label: "Textured" },
      ],
        buttonText: "EXPLORE MAXIMALIST CARPETS",
    },
    {
      id: 4,
      title: "BOHEMIAN",
      description:
        "A Bohemian home feels like a personal art gallery layered with stories, colours, and textures. Your living room might have a macramé wall hanging, a jute pouffe, and a mix of wooden and wicker furniture. The bedroom could feature block-printed bedcovers, patterned cushions, and plants in every corner. Even the balcony feels like an urban jungle with fairy lights and a low table for evening chai. A carpet here ties everything together—the more layered and artisanal, the better.",
      image: settwo,
      recommendations: [
        { img: newset3, label: "Geometric" },
        { img:newset5, label: "Floral" },
        { img: newset2, label: "Abstract" },
        { img:newset1 , label: "Striped" },
      ],
      buttonText: "EXPLORE BOHEMIAN CARPETS",
    },
    {
        id: 5,
        title: "MAXIMALIST",
        description:
          "Maximalism is not about clutter — it’s about curated abundance. Picture a living room with bold sofas, patterned wallpaper, and statement art pieces. The dining room might have a mismatched set of chairs and a gallery wall full of family photos. The home office has vibrant bookshelves and colourful stationery that keep inspiration alive. A carpet in such a home can go wild with colour and design — geometric, zig-zag, or even a playful floral. It adds one more joyful layer to the story.",
        image: setone,
        recommendations: [
          { img: newset1, label: "Ethnic" },
          { img: newset2, label: "Floral" },
          { img: newset3, label: "Moroccan" },
          { img: newset4, label: "Printed" },
          { img: newset5, label: "Textured" },
        ],
          buttonText: "EXPLORE MAXIMALIST CARPETS",
      },
      {
        id: 6,
        title: "BOHEMIAN",
        description:
          "A Bohemian home feels like a personal art gallery layered with stories, colours, and textures. Your living room might have a macramé wall hanging, a jute pouffe, and a mix of wooden and wicker furniture. The bedroom could feature block-printed bedcovers, patterned cushions, and plants in every corner. Even the balcony feels like an urban jungle with fairy lights and a low table for evening chai. A carpet here ties everything together—the more layered and artisanal, the better.",
        image: settwo,
        recommendations: [
          { img: newset3, label: "Geometric" },
          { img:newset5, label: "Floral" },
          { img: newset2, label: "Abstract" },
          { img:newset1 , label: "Striped" },
        ],
        buttonText: "EXPLORE BOHEMIAN CARPETS",
      },
  ];
  return (
    <>
      <div className="sizeguide-container">
        {/* ---------- HERO SECTION ---------- */}
        <section className="hero-section">
          <img src={heroImg} alt="Carpet Style" className="hero-image" />
          <div className="hero-text-sz">
            <h1>Carpet Style Guide</h1>
            <p>
              A complete guide designed to make carpet selection simple and
              stress-free covering styles, care tips, and inspiration to help
              you find the perfect fit for every room in your home.
            </p>
          </div>
        </section>

        {/* ---------- STEPS SECTION ---------- */}
        <section className="steps-section">
          <h2>Steps to Find Your Perfect Carpet</h2>

          <div className="steps-grid">
            <div className="step-item">
              <div className="track_sub_ot">
                <div className="img_buster">
                  <img
                    src={shape}
                    alt="Understand Space"
                    className="img_icon_fcar"
                  />
                </div>

                <div>
                  <h3>UNDERSTAND YOUR SPACE</h3>
                  <p>
                    Before picking a carpet, visualize the room in your head.
                    Analyze the room that you want to place your carpet. Is it
                    your living room? Is it your Bedroom? Or are you doing your
                    children’s room? Let’s start there.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="track_sub_ot">
                <div className="img_buster">
                  <img
                    src={mesure}
                    alt="Measure Area"
                    className="img_icon_fcar"
                  />
                </div>
                <div>
                  <h3>MEASURING YOUR CARPET AREA/ FLOOR SIZE</h3>
                  <p>
                    Pick patterns and colors that vibe with your space. Let your
                    Carpet either steal the spotlight or play the quiet
                    supporter so just make sure it feels like it belongs in the
                    story your room is telling.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="track_sub_ot">
                <div className="img_buster">
                  <img
                    src={decode}
                    alt="Decode Home"
                    className="img_icon_fcar"
                  />
                </div>
                <div>
                  <h3>DECODE YOUR HOME INTERIOR</h3>
                  <p>
                    After doing the above, take a look around your space and
                    notice its character. Once you understand the mood your home
                    carries, you can choose a carpet that flows.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="track_sub_ot">
                <div className="img_buster">
                  <img
                    src={chose}
                    alt="Choose Design"
                    className="img_icon_fcar"
                  />
                </div>
                <div>
                  <h3>CHOOSING THE RIGHT DESIGN</h3>
                  <p>
                    For the right size, mark out the carpet’s outline on your
                    floor with tape. It’s a quick and sure-shot way to see if
                    the size blends naturally with the room or feels out of
                    place. Access our Size Guide <a href="#">here</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="know-style-container">
          <h2 className="section-title">Know Your Style</h2>
          <p className="section-subtitle">
            Every home tells a story, and the right carpet is the finishing
            touch that ties it together adding style, comfort, and character to
            your space.
          </p>
          {stylesData.map((style, index) => (
            <div
              key={style.id}
              className={`style-block ${
                index % 2 !== 0 ? "reverse-layout" : ""
              }`}
            >
              <div className="style-image">
                <img src={style.image} alt={style.title} />
              </div>

              <div className="style-content">
                <h3 className="style-title">{style.title}</h3>
                <p className="style-description">{style.description}</p>

                <div className="recommend-title">Obsessions Recommends:</div>
                <div className="recommend-grid">
                  {style.recommendations.map((rec, i) => (
                    <div key={i} className="recommend-item">
                      <img src={rec.img} alt={rec.label} />
                      <p>{rec.label}</p>
                    </div>
                  ))}
                </div>

                <button className="explore-btn">{style.buttonText}</button>
              </div>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SizeGuide;
