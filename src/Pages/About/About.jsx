import React, { useState } from "react";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const About = () => {
  const [activeTab, setActiveTab] = useState("Story");

  const tabs = [
    {
      name: "Our Story",
      content:
        "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
    },
    {
      name: "Mission",
      content:
        "Our mission is to revolutionize the logistics industry in Bangladesh by integrating cutting-edge technology with local expertise. We strive to provide 100% safe, fast, and transparent delivery services that empower merchants and satisfy customers at every step of the journey.",
    },
    {
      name: "Success",
      content:
        "Since our inception, we have successfully delivered over 1 million parcels across 64 districts. Our growth is fueled by our dedication to security and speed, maintaining a 99.8% success rate in on-time deliveries and building long-term trust with our merchant partners.",
    },
    {
      name: "Team & Others",
      content:
        "Behind TradeCen is a dedicated team of logistics experts, developers, and support professionals available 24/7. We work tirelessly to manage complex supply chains and provide you with a zero-hassle experience, ensuring your business never stops moving forward.",
    },
  ];

  return (
    <>
      <DynamicTitle title="About Us" />
      <section className="bg-[#F2F4F7] pt-8 pb-16 font-sans">
        <div className="bg-white rounded-[30px] p-4 md:p-12 lg:p-20">
          {/* 1. Header Section */}
          <div className="mb-10">
            <h2 className="text-[#02312A] text-4xl md:text-5xl font-extrabold mb-6">
              About Us
            </h2>
            <p className="text-[#5F7180] text-sm md:text-base max-w-2xl leading-relaxed">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>
          </div>

          <div className="w-full h-[2px] bg-[linear-gradient(to_right,#B0BCC8_50%,transparent_0%)] bg-[length:15px_1.2px] bg-repeat-x mb-12 opacity-30" />

          {/* 3. Tab Navigation */}
          <div className="flex flex-wrap items-center gap-x-8 md:gap-x-12 gap-y-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`text-xl font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === tab.name
                    ? "text-[#02312A] scale-105" // Matching active color from image
                    : "text-[#9AA6B2] hover:text-[#02312A]"
                }`}
              >
                {/* Special styling for the active tab indicator (the green highlight) */}
                <span
                  className={activeTab === tab.name ? "text-[#8DB600]" : ""}
                >
                  {tab.name}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-8 animate-fadeIn">
            <div className="transition-opacity duration-500">
              <p className="text-[#5F7180] text-[15px] md:text-[17px] leading-[1.8] mb-6">
                {tabs.find((t) => t.name === activeTab).content}
              </p>
              <p className="text-[#5F7180] text-[15px] md:text-[17px] leading-[1.8] mb-6">
                {tabs.find((t) => t.name === activeTab).content}
              </p>
              <p className="text-[#5F7180] text-[15px] md:text-[17px] leading-[1.8]">
                {tabs.find((t) => t.name === activeTab).content}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
