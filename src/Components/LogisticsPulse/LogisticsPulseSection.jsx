import React from 'react';
import { LogisticsNetwork } from './LogisticsNetwork';
import { ShieldCheck, PackageCheck, Rotate3D } from 'lucide-react';

export function LogisticsPulseSection() {
  return (
    <section
      id="logistics-pulse"
      aria-label="The Parcel — A Journey of Trust"
      className="mt-14 relative min-h-[560px] md:min-h-[600px] w-full overflow-hidden select-none rounded-[28px] border border-[#397565]/30 border-t-[#CAEB66]/40 bg-[#02312A] shadow-2xl"
    >
      {/* 3D Parcel Scene Container */}
      <div className="absolute inset-0 z-0">
        <LogisticsNetwork />
      </div>      
    </section>
  );
}