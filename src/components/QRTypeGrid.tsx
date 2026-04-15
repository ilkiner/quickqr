// src/components/QRTypeGrid.tsx
"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLanguage } from "src/contexts/LanguageContext";

const qrParams = ["url", "restaurant-menu", "vcard", "social-media", "google-maps", "email", "wifi"];
const qrIcons = ["🔗", "🍽️", "👤", "📱", "📍", "✉️", "📶"];

function QRCard({ title, desc, icon, param, generateNow }: {
  title: string; desc: string; icon: string; param: string; generateNow: string;
}) {
  return (
    <div
      className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/10 p-8 rounded-xl shadow hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col"
      style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">{desc}</p>
      <Link
        href={`/generate?type=${param}`}
        className="block bg-black dark:bg-white/10 hover:bg-green-600 dark:hover:bg-green-600 text-white text-center py-2 px-6 rounded-2xl text-sm transition-all duration-200"
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        {generateNow}
      </Link>
    </div>
  );
}

export default function QRTypeGrid() {
  const { t } = useLanguage();

  return (
    <section id="qr-types" className="w-full py-16 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          {t.qrTypes.title}
        </h2>
        <p className="text-center text-xl text-gray-600 dark:text-gray-400 mb-10">
          {t.qrTypes.sub}
        </p>

        {/* Mobile: Swiper carousel */}
        <div className="block sm:hidden">
          <style>{`
            .qr-swiper .swiper-button-next,
            .qr-swiper .swiper-button-prev {
              color: #16a34a;
            }
            .qr-swiper .swiper-pagination-bullet-active {
              background: #16a34a;
            }
          `}</style>
          <Swiper
            className="qr-swiper"
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            style={{ paddingBottom: "40px" }}
          >
            {t.qrTypes.types.map((type, index) => (
              <SwiperSlide key={index}>
                <QRCard
                  title={type.title}
                  desc={type.desc}
                  icon={qrIcons[index]}
                  param={qrParams[index]}
                  generateNow={t.qrTypes.generateNow}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop/Tablet: Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {t.qrTypes.types.map((type, index) => (
            <QRCard
              key={index}
              title={type.title}
              desc={type.desc}
              icon={qrIcons[index]}
              param={qrParams[index]}
              generateNow={t.qrTypes.generateNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
