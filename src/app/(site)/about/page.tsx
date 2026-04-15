import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <section className="bg-white dark:bg-[#0a0a0a] py-16 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-4 py-1 text-sm font-medium mb-6">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Making QR Codes Simple for Every Business
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            QuickQR helps you turn links, contacts, and Wi-Fi details into scannable codes your customers can trust — without friction or clutter.
          </p>
        </div>
      </section>

      <section className="bg-green-600 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <p className="text-2xl md:text-3xl font-bold">500K+</p>
            <p className="text-sm md:text-base text-white/90 mt-1">QR Codes Generated</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">50K+</p>
            <p className="text-sm md:text-base text-white/90 mt-1">Happy Users</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">99.9%</p>
            <p className="text-sm md:text-base text-white/90 mt-1">Uptime</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">6</p>
            <p className="text-sm md:text-base text-white/90 mt-1">QR Types</p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0a0a0a] py-16 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              We believe QR codes should be effortless to create and delightful to scan. Our mission is to give every business — from cafés to enterprises — the tools to share information instantly and securely.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We obsess over clarity, speed, and accessibility so your customers get a seamless experience on every device.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Speed", icon: "ri-flashlight-line", text: "Generate codes in seconds with a focused, minimal workflow." },
              { title: "Security", icon: "ri-shield-check-line", text: "We treat your data with care and keep the surface area small." },
              { title: "Accessibility", icon: "ri-global-line", text: "Readable layouts and clear labels for every visitor." },
              { title: "Innovation", icon: "ri-lightbulb-line", text: "We ship useful QR types that match how businesses work today." },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 dark:bg-[#141414] border border-transparent dark:border-white/10 rounded-xl p-5 hover:shadow-md hover:shadow-green-500/10 transition-all duration-200"
              >
                <i className={`${item.icon} text-2xl text-green-600 mb-2`} aria-hidden />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-[#0d0d0d] py-16 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why We Built This</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            Too many QR tools feel cluttered or outdated. We built QuickQR to be fast, modern, and honest — so you can focus on your business, not on fighting the software.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Whether you are sharing a menu, a location, or a contact card, QuickQR keeps the experience consistent and professional.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-3xl transition"
          >
            Try It Free
          </Link>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0a0a0a] py-12 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-4xl mx-auto bg-black dark:bg-[#141414] dark:border dark:border-white/10 rounded-3xl px-8 py-12 md:px-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to create your first QR code?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Jump into the generator or explore plans when you need more power for your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-3xl transition"
            >
              Create QR Free
            </Link>
            <Link
              href="/pricing"
              className="inline-block border border-white/30 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-3xl transition"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
