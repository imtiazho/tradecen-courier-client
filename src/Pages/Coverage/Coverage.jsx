import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Coverage = () => {
  const serviceCenters = useLoaderData();
  const position = [23.685, 90.3563]; // Bangladesh Center
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const loc = e.target.location.value.toLowerCase();
    const district = serviceCenters.find((c) =>
      c.district.toLowerCase().includes(loc),
    );
    if (district) {
      const coordinate = [district.latitude, district.longitude];
      mapRef.current.flyTo(coordinate, 12);
    }
  };

  return (
    <>
      <DynamicTitle title="Coverage Area" />
      <section className="bg-[#F2F4F7] mt-8 mb-12 font-sans">
        <div className="bg-white rounded-[25px] p-8 md:p-16">
          {/* Header Section */}
          <div className="space-y-8 mb-10">
            <h1 className="text-[#02312A] text-3xl md:text-5xl font-extrabold tracking-tight">
              We are available in 64 districts
            </h1>

            <form onSubmit={handleSearch} className="max-w-md">
              <div className="relative flex items-center bg-[#F2F4F7] rounded-full p-1 border border-transparent focus-within:border-[#CAEB66] transition-all">
                <div className="pl-4 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  name="location"
                  type="text"
                  className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 grow px-3 text-[#02312A] font-medium placeholder:text-gray-400"
                  placeholder="Search here"
                />
                <button
                  type="submit"
                  className="bg-[#CAEB66] hover:bg-[#b8d65a] text-[#02312A] font-bold py-3 px-8 rounded-full transition-colors leading-none"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="w-full h-[2px] bg-[linear-gradient(to_right,#B0BCC8_50%,transparent_0%)] bg-[length:15px_1.2px] bg-repeat-x mb-10 opacity-40" />

          {/* Sub-heading */}
          <h3 className="text-[#02312A] text-xl md:text-2xl font-bold mb-8">
            We deliver almost all over Bangladesh
          </h3>

          {/* Map Container */}
          <div className="rounded-2xl overflow-hidden border-4 border-[#F2F4F7] shadow-inner h-[400px] md:h-[550px]">
            <MapContainer
              ref={mapRef}
              center={position}
              zoom={7}
              scrollWheelZoom={false}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {serviceCenters.map((center) => (
                <Marker
                  key={center._id}
                  position={[center.latitude, center.longitude]}
                >
                  <Popup>
                    <div className="font-sans max-w-[200px]">
                      {" "}
                      {/* Optional: set a reasonable max-width if needed */}
                      <h4 className="font-bold text-[#02312A] mb-1">
                        {center.district}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {center.covered_area.map((item, index) => (
                          <span
                            key={index}
                            className="text-xs text-gray-500 uppercase"
                          >
                            {item}
                            {index < center.covered_area.length - 1 && ","}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>
    </>
  );
};

export default Coverage;
