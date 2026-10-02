import React from "react";

import WaveHeaderImg from "../../assets/be-a-merchant-bg.png"; // Recommend SVG for sharp lines
import LogisticsIllustrationImg from "../../assets/location-merchant.png";

const SatisfactionBanner = () => {
  return (
    <section className="py-16 md:py-20 px-4 md:px-10 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-secondary rounded-[48px] p-16 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-full h-auto opacity-70">
            <img
              src={WaveHeaderImg}
              alt="Abstract wave pattern"
              className="w-full h-auto object-contain object-top-right"
            />
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[50%] md:w-[55%] lg:w-[50%] h-auto pr-6 md:pr-10 lg:pr-16 hidden md:block">
            <img
              src={LogisticsIllustrationImg}
              alt="Continuous line logistics illustration"
              className="w-full h-auto object-contain object-center-right"
            />
          </div>

          <div className="relative z-10 w-full lg:w-[60%] space-y-6 flex flex-col items-start text-left">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.001em] leading-tight">
              Merchant and Customer Satisfaction is Our First Priority
            </h1>

            <p className="text-[#DADADA] text-[18px] leading-[1.6]">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
              <button className="btn border-0 bg-[#CAEB66] text-[#000] hover:bg-[#A9CE4D] rounded-full px-8 md:px-10 text-base font-bold capitalize shadow-[0px_4px_12px_rgba(202,235,102,0.15)]">
                Become a Merchant
              </button>

              <button className="btn shadow-none border border-[#CAEB66] bg-transparent text-[#CAEB66] rounded-full px-8 md:px-10 text-base font-bold capitalize hover:bg-[#CAEB66]/10 hover:border-[#CAEB66]">
                Earn with TradeCen Courier
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SatisfactionBanner;
