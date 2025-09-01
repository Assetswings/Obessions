import React from "react";
import "./Terms.css"; // import css file
import Footer from "../../components/Footer/Footer";

export default function TermsAndConditions() {
  return (
    <>
    <div className="terms-container">
      {/* Heading */}
      <h1 className="terms-title">Terms & Condition</h1>

      {/* Subtitle */}
      <h2 className="terms-subtitle">Here’s how we keep things fair</h2>

      {/* Intro Paragraph */}
      <p className="terms-paragraph">
        The terms and conditions of sale as set out herein ("Terms of Sale")
        constitute an agreement between us and you and govern the terms and
        conditions on which you purchase our Products from us on our Platform.
        By placing an order for any Product on our site or making a purchase of
        the Products, you are agreeing to be bound by these Terms of Sale. These
        Terms of Sale are in addition to the Website Terms of Use, the Privacy
        Policy and the Additional Terms of Sale, if any, which may be
        applicable. These statements, notices & agreements by consumers are
        governed by consumer protection law and applicable provisions of law.
      </p>

      {/* Sections */}
      <div className="terms-sections">
        <section>
          <h3 className="terms-section-title">1. OUR CONTRACT OF SALE</h3>
          <p>
            Listing and display of a Product on our Platform is our invitation
            to you to make an offer for purchase of such Product. Likewise, the
            placement of an order on our Platform by you is your offer to buy
            the Product(s) from us.
          </p>
          <p>
            Once you have placed an order, we may verify the transaction by
            calling you on the registered mobile number or email provided by
            you. Upon receipt of your order confirmation, the contract will be
            considered final unless cancelled by us as per policy.
          </p>
        </section>

        <section>
          <h3 className="terms-section-title">2. RETURN AND REFUND</h3>
          <p>
            Returns are allowed as per the Product Return Policy displayed on
            our Platform which applies to Products sold by us.
          </p>
        </section>

        <section>
          <h3 className="terms-section-title">3. PRODUCT AVAILABILITY</h3>
          <p>
            We will list availability information for Products on the relevant
            webpage of our Platform. Beyond what we say on that webpage or
            otherwise on our Platform, we cannot be specific about availability.
            As we process your order, you will be informed by e-mail or through
            Platform notifications if any Products you order turn out to be
            unavailable.
          </p>
        </section>

        <section>
          <h3 className="terms-section-title">4. PRODUCT PRICING</h3>
          <p>
            Product prices listed on our Platform will reflect the most recent
            price as displayed on the Product’s information page on the
            Platform. Please note that this price may differ from the price in
            the Product when first added to your cart.
          </p>
        </section>

        <section>
          <h3 className="terms-section-title">5. TAXES</h3>
          <p>
            You shall be responsible for payment of all fees/costs/charges
            associated with the purchase of Products from us and agree to bear
            all applicable taxes including but not limited to GST, duties and
            cesses etc.
          </p>
        </section>

        <section>
          <h3 className="terms-section-title">6. DELIVERY</h3>
          <p>
            We endeavor but do not guarantee to deliver the Products to buyers
            within 3-14 working days from the day of close of sale depending
            upon the shipping location. Delivery may take longer due to
            unforeseen reasons.
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
