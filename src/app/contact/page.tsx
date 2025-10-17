"use client";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-white py-20 px-4 md:px-10">
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-10 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Contact Us
        </h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
