import React from "react";
import { Row, Col, Button } from "antd";

// Import assets
import step1 from "../../assets/step1.png";
import step2 from "../../assets/step2.png";
import step3 from "../../assets/step3.png";
import step4 from "../../assets/step4.png";
import bottomStrip from "../../assets/bottom-strip.png";
import image01 from "../../assets/image01.png";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      image: step1,
      title: "Select Pooja or Product",
      description: "Browse and pick Pooja kits & items",
    },
    {
      number: "02",
      image: step2,
      title: "Customize & Book",
      description: "Choose date, time & purpose (for pooja)",
    },
    {
      number: "03",
      image: step3,
      title: "Easy Payment",
      description: "Secure online transactions",
    },
    {
      number: "04",
      image: step4,
      title: "Experience the Divine",
      description: "Pandit Ji performs rituals or products reach home",
    },
  ];

  const buttons = [
    "Get Prasad",
    "Book Pandit ji",
    "Order Pooja Kit",
    "Vastu Consultation",
  ];

  return (
    <section style={{ background: "#fff" }}>
      <div style={{ textAlign: "center", padding: "60px 20px 40px 20px" }}>
      {/* Heading */}
      <h2
        style={{
          fontSize: "36px",
          fontWeight: "600",
          color: "#6B1E1E",
          marginBottom: "20px",
          fontFamily: "Bastoni",
        }}
      >
        How It works
      </h2>

      {/* Image below heading */}
      <img
        src={image01}
        alt="How it works"
        style={{ marginBottom: "40px", maxWidth: "100%", height: "auto" }}
      />

      {/* Steps */}
      <Row gutter={[32, 32]} justify="center" style={{ marginBottom: "40px" }}>
        {steps.map((step, index) => (
          <Col xs={24} md={6} key={index} style={{ textAlign: "center" }}>
            <div>
              <img
                src={step.image}
                alt={step.title}
                style={{ height: "90px", marginBottom: "10px" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3
                  style={{
                    fontSize: "50px",
                    fontWeight: "700",
                    color: "#691B19",
                    margin: 0,
                    fontFamily: "Bastoni",
                  }}
                >
                  {step.number}
                </h3>
                <div
                  style={{
                    backgroundColor: "#F4E2C9",
                    padding: "15px",
                    borderRadius: "8px",
                    flex: 1,
                  }}
                >
                  <h4 style={{ fontWeight: "500", color: "#691B19", fontFamily: "Poppins" }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: "10px", color: "#444", margin: 0, fontFamily: "Poppins" }}>{step.description}</p>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Buttons */}
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "40px" }}>
        {buttons.map((btn, i) => (
          <Col xs={12} sm={8} md={6} lg={6} key={i}>
            <Button
              style={{
                borderRadius: "10px",
                padding: "20px 44px",
                fontWeight: "500",
                border: "1px solid #6B1E1E",
                color: "#6B1E1E",
                fontFamily: "Poppins",
                width: "100%",
                fontSize: "14px",
                marginTop: "10px"
              }}
            >
              {btn}
            </Button>
          </Col>
        ))}
      </Row>

      </div>

      {/* Bottom Decorative Strip - Full Width */}
      <img
        src={bottomStrip}
        alt="Decorative Strip"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </section>
  );
};

export default HowItWorks;
