"use client";

import { useState } from "react";

const qrTypes = [
  { id: "restaurant", label: "Restaurant Menu" },
  { id: "vcard", label: "vCard / Contact" },
  { id: "social", label: "Social Media" },
  { id: "location", label: "Google Maps" },
  { id: "email", label: "Email" },
  { id: "wifi", label: "Wi-Fi" },
];

export default function GeneratePage() {
  const [activeType, setActiveType] = useState("restaurant");
  const [menuUrl, setMenuUrl] = useState("");
  const [qrImage, setQrImage] = useState(""); 
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold text-green-600">
          <i className="ri-qr-code-line text-2xl" />
          QuickQR
        </div>

        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-600 hover:text-green-600 flex items-center gap-1"
          >
            <i className="ri-time-line text-lg" />
            View History
          </button>

          <button className="text-gray-600 hover:text-red-600 flex items-center gap-1">
            <i className="ri-logout-box-r-line text-lg" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
      
        <div className="space-y-2">
          {qrTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeType === type.id
                  ? "bg-green-600 text-white font-semibold"
                  : "bg-white border hover:bg-gray-50 text-gray-700"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

       
        <div className="lg:col-span-2 space-y-8">
         
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">
              Create {qrTypes.find((q) => q.id === activeType)?.label} QR Code
            </h2>

            {activeType === "restaurant" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQrImage(
                    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
                      menuUrl
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Menu URL
                  </label>
                  <input
                    type="url"
                    value={menuUrl}
                    onChange={(e) => setMenuUrl(e.target.value)}
                    placeholder="https://yourrestaurant.com/menu"
                    className="mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  Generate QR Code
                </button>
              </form>
            )}
          </div>

         
          {qrImage && (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-lg font-bold mb-4">Your QR Code</h2>
              <img src={qrImage} alt="QR Code" className="mx-auto w-48 h-48" />
              <div className="mt-4 flex justify-center gap-4">
                <a
                  href={qrImage}
                  download={`qrcode-${activeType}-${Date.now()}.png`}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Download
                </a>
                <button
                  onClick={() => setQrImage("")}
                  className="px-4 py-2 border rounded-md"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}

          {/* HISTORY */}
          {showHistory && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">QR Code History</h2>
              <p className="text-gray-500">No history data yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
