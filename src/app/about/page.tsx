"use client";

export default function AboutPage() {
  return (
    <section className="relative bg-gray-50 py-20 px-4 md:px-10 overflow-hidden">
      {/* Background Blur Decorations */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" />

      <div className="max-w-5xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">About QuickQR</h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          We build smart, beautiful, and fast QR solutions for businesses who want to stand out. Simple to use, incredibly efficient, and made with care.
        </p>
      </div>

      {/* Accordion Section */}
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {accordionData.map((item, index) => (
          <details
            key={index}
            className="group border border-gray-200 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800">
              <div className="flex items-center">
                <i className={`${item.icon} text-xl mr-3 ${item.color}`} />
                {item.title}
              </div>
              <i className="ri-arrow-down-s-line group-open:rotate-180 transition duration-300 text-gray-500 text-xl" />
            </summary>
            <p className="mt-4 text-gray-600">{item.description}</p>
          </details>
        ))}
      </div>

   <div className="mt-20 flex justify-center items-center">
  <div className="bg-green-400 bg-opacity-95 text-white rounded-2xl p-10 shadow-[0_10px_40px_rgba(34,197,94,0.4)] w-full max-w-2xl text-center">
    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
      Want to work with us?
    </h3>
    <p className="text-white/90 text-md md:text-lg mb-6">
      We&apos;re always looking for collaborators and talents who love clean code and clever design.
    </p>
    <a
      href="/contact"
      className="inline-block bg-white text-green-700 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition"
    >
      Contact Us
    </a>
  </div>
</div>

    </section>
  );
}

const accordionData = [
  {
    title: "Who We Are",
    description: "We are a small team of developers, designers, and product thinkers who believe QR code technology should be accessible and beautiful.",
    icon: "ri-group-line",
    color: "text-green-500",
  },
  {
    title: "What Makes Us Different",
    description: "We focus on user experience and speed. With modern design and instant QR creation, our platform stands out from generic tools.",
    icon: "ri-star-smile-line",
    color: "text-yellow-500",
  },
  {
    title: "Our Vision",
    description: "To become the go-to platform for dynamic, beautiful, and scalable QR solutions across all industries.",
    icon: "ri-eye-2-line",
    color: "text-purple-500",
  },
  {
    title: "Core Values",
    description: "Simplicity, Security, Customer-First Approach, and Continuous Innovation.",
    icon: "ri-heart-2-line",
    color: "text-pink-500",
  },
];
