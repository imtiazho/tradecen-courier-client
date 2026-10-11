import React from 'react';

// My mom said to always use good data structure!
const servicesData = [
  {
    iconUrl: "https://cdn-icons-png.flaticon.com/128/1167/1167993.png", // Delivery bike icon
    title: "Express & Standard Delivery",
    description: "We deliver parcels within 24-72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4-6 hours from pick-up to drop-off.",
  },
  {
    iconUrl: "https://cdn-icons-png.flaticon.com/128/2002/2002166.png", // Map pin icon
    title: "Nationwide Delivery",
    description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48-72 hours.",
  },
  {
    iconUrl: "https://cdn-icons-png.flaticon.com/128/1554/1554401.png", // Warehouse icon
    title: "Fulfillment Solution",
    description: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    iconUrl: "https://cdn-icons-png.flaticon.com/128/2331/2331716.png", // Cash in hand icon
    title: "Cash on Home Delivery",
    description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3305/3305141.png", // Contract handshake icon
    title: "Corporate Service / Contract In Logistics",
    description: "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3514/3514491.png", // Return box icon
    title: "Parcel Return",
    description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];

const OurServices = () => {
  return (
    // This is the big dark background for the whole thing
    <div className="bg-[#02312A] min-h-screen py-16 px-4 md:px-10 mt-24 rounded-[25px]">
      <div className="max-w-7xl mx-auto">
        
        {/* Here's the title and text at the top! */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-white text-[38px] font-extrabold mb-4">
            Our Services
          </h1>
          <p className="text-[#DADADA] text-[15px] leading-relaxed">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* This is the grid where all the cards go! */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicesData.map((service, index) => (
            // This is each card. Look at that hover color!
            <div 
              key={index}
              className="bg-white rounded-[15px] pt-8 pb-6 px-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl group
              hover:bg-[#CAEB66]" // This is the hover color magic trick!
            >
              {/* This makes the picture in a circle */}
              <div className="bg-[#E4F1FE] rounded-full w-20 h-20 flex items-center justify-center mb-5 shadow-inner">
                <img src={service.iconUrl} alt={service.title} className="w-10 h-10" />
              </div>

              {/* Title, it turns a different color on hover! */}
              <h3 className="text-[#0A2521] group-hover:text-black text-[23px] font-bold mb-3 tracking-tight">
                {service.title}
              </h3>
              
              {/* Description, it also gets a cool black color! */}
              <p className="text-[#0A2521] text-[15px] group-hover:text-black/90 font-medium leading-[23px]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurServices;