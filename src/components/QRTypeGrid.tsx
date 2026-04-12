// src/components/QRTypeGrid.tsx
"use client";
import Link from "next/link";

const qrTypes = [
  { title: "URL / Website Link", desc: "Link any website or page", icon: "🔗", param: "url" },
  { title: "Restaurant Menu QR", desc: "Link a digital menu", icon: "🍽️", param: "restaurant-menu" },
  { title: "vCard / Contact QR", desc: "Share contact details", icon: "👤", param: "vcard" },
  { title: "Social Media QR", desc: "Link social profiles", icon: "📱", param: "social-media" },
  { title: "Google Maps QR", desc: "Share location", icon: "📍", param: "google-maps" },
  { title: "Email QR", desc: "Quick email compose", icon: "✉️", param: "email" },
  { title: "Wi-Fi QR", desc: "Instant Wi-Fi login", icon: "📶", param: "wifi" },
];

export default function QRTypeGrid() {
  return (
    <section id="qr-types" className="w-full py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Choose Your QR Type
        </h2>
        <p className="text-center text-xl text-gray-600 mb-10">
          Select from our range of specialized QR codes
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow hover:shadow-md hover:scale-[1.02] hover:shadow-green-600 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">{type.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{type.desc}</p>

             
              <Link
                href={`/generate?type=${type.param}`}
                className="mt-auto block bg-black hover:bg-green-600 text-white text-center py-2 px-6 rounded-2xl text-sm transition"
              >
                Generate Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
