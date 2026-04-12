"use client";

export default function Hero() {
  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-12 md:py-20 transition-colors duration-200">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 items-center gap-6">

        {/* Left: Text */}
        <div className="md:col-span-7 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-gray-900 dark:text-gray-100">
            Generate Smart <br />
            <span className="animated-gradient-text">QR Codes</span>{" "}
            <span className="text-gray-900 dark:text-gray-100">Instantly</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-7">
            Create professional QR codes for your business in seconds. Fast, secure, and incredibly easy to use.
          </p>
          <a
            href="#qr-types"
            className="btn-pulse inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-7 rounded-3xl transition-all duration-200 cubic-bezier(0.4,0,0.2,1)"
          >
            Create QR Now
          </a>
        </div>

        {/* Right: Image */}
        <div className="md:col-span-5 flex justify-center md:justify-end">
          <img
            src="/hero.png"
            alt="QR Code Illustration"
            className="w-[220px] md:w-[290px] rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.3)]"
          />
        </div>

      </div>
    </section>
  );
}
