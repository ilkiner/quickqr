"use client";

import { useEffect, useState } from "react";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { createClient } from "src/lib/supabase/client";

const qrTypes = [
  "Restaurant Menu",
  "vCard",
  "Social Media",
  "Google Maps",
  "Email",
  "Wi-Fi",
  "Other",
];

export default function CustomDesignPage() {
  const [userEmail, setUserEmail] = useState("");
  const [plan, setPlan] = useState<string>("free");
  const [authChecked, setAuthChecked] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [qrType, setQrType] = useState(qrTypes[0]);
  const [brandColors, setBrandColors] = useState("");
  const [notes, setNotes] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setContactEmail(user.email ?? "");
        setUserEmail(user.email ?? "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .maybeSingle();
        setPlan(profile?.plan ?? "free");
      }
      setAuthChecked(true);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/custom-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          qrType,
          brandColors,
          notes,
          contactEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const notEligible = authChecked && (plan !== "pro" && plan !== "business");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Get a Custom QR Design
            </h1>
            <p className="text-gray-600 text-lg">
              Tell us about your business and we&apos;ll create a professional QR code
              tailored just for you.
            </p>
          </div>

          {notEligible ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
              <p className="text-gray-700">
                Custom design requests are available for{" "}
                <span className="font-semibold text-green-600">Pro</span> and{" "}
                <span className="font-semibold text-green-600">Business</span> members.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-md font-medium transition"
              >
                Upgrade Now
              </a>
            </div>
          ) : success ? (
            <div className="bg-white rounded-xl border border-green-200 shadow-sm p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-check-line text-2xl text-green-600" aria-hidden />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Request Submitted!</h2>
              <p className="text-gray-600">
                We&apos;ll get back to you within 24 hours!
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessName"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label htmlFor="qrType" className="block text-sm font-medium text-gray-700 mb-1">
                  QR Type
                </label>
                <select
                  id="qrType"
                  value={qrType}
                  onChange={(e) => setQrType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  {qrTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="brandColors" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Colors
                </label>
                <input
                  id="brandColors"
                  type="text"
                  value={brandColors}
                  onChange={(e) => setBrandColors(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder='e.g. #16a34a, #ffffff'
                />
              </div>

              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Upload <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe your needs, preferred style, etc."
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="you@example.com"
                />
                {userEmail && contactEmail === userEmail && (
                  <p className="text-xs text-gray-400 mt-1">Auto-filled from your account.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
