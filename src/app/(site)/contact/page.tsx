"use client";

import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setSuccess(false);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!emailRegex.test(email.trim())) next.email = "Enter a valid email address";
    if (!message.trim()) next.message = "Message is required";
    else if (message.trim().length < 10) next.message = "Message must be at least 10 characters";
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 600);
  };

  const inputClass = (key: string) =>
    `w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-[#1e1e1e] dark:text-gray-200 dark:placeholder-gray-500 transition-colors ${
      errors[key] ? "border-red-500" : "border-gray-300 dark:border-white/10"
    }`;

  return (
    <section className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16 px-4 md:px-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Get in Touch</h1>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                <i className="ri-mail-line text-xl text-green-600 dark:text-green-400" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">support@quickqr.com</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                <i className="ri-phone-line text-xl text-green-600 dark:text-green-400" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Phone</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">+48 123 456 789</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                <i className="ri-time-line text-xl text-green-600 dark:text-green-400" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Response Time</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Usually within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#141414] border border-transparent dark:border-white/10 rounded-2xl p-8 shadow-sm">
          {success ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-3xl text-green-600 dark:text-green-400" aria-hidden />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Message Sent!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thanks {name.trim()}, we&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="text-green-600 font-semibold hover:text-green-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClass("name")}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  autoComplete="off"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className={inputClass("message")}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-xl" aria-hidden />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
