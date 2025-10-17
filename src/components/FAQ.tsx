"use client";

const faqs = [
  {
    question: "Do I need to register to use QuickQR?",
    answer:
      "Yes. You need to create a free account to generate and manage your QR codes securely.",
  },
  {
    question: "Is the Free plan really free?",
    answer:
      "Absolutely. You can generate up to 5 QR codes per month with no cost, no credit card required.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes, you can change your subscription plan at any time from your account settings.",
  },
  {
    question: "What types of QR codes can I generate?",
    answer:
      "You can create menu, social, vCard, email, location, Wi-Fi, and many more QR types — depending on your plan.",
  },
  {
    question: "Is there an API for developers?",
    answer:
      "Yes! Our Business plan includes secure API access for QR code generation and management.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-lg p-6 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <i className="ri-question-line text-green-600 text-2xl pt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.question}
                  </h4>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
