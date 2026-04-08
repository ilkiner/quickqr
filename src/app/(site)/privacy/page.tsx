export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gray-900 py-16 px-4 text-center">
        <span className="inline-block bg-green-600/20 text-green-400 rounded-full px-4 py-1 text-sm font-medium mb-4">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Last updated: April 8, 2026
        </p>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-14 space-y-10 text-gray-700 leading-relaxed">

        <div>
          <p>
            QuickQR ("we", "us", or "our") operates the website{" "}
            <span className="font-medium text-gray-900">qrfast.dev</span>. This
            Privacy Policy explains what data we collect, how we use it, and
            your rights regarding that data. By using our service, you agree to
            this policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Data We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Email address</span> — collected
              when you register or sign in.
            </li>
            <li>
              <span className="font-medium">QR code history</span> — we store
              the QR codes you generate while signed in so you can access them
              from your dashboard.
            </li>
            <li>
              <span className="font-medium">Payment information</span> — billing
              details are processed by Stripe and are never stored on our
              servers. We only receive a subscription status and customer ID.
            </li>
            <li>
              <span className="font-medium">Usage data</span> — basic analytics
              such as page visits and feature interactions to improve the
              product.
            </li>
            <li>
              <span className="font-medium">Cookies</span> — session cookies
              required for authentication and preference cookies to remember your
              settings (see Section 4).
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. How We Use Your Data
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, maintain, and improve the QuickQR service.</li>
            <li>To authenticate your account and keep it secure.</li>
            <li>
              To process payments and manage your subscription via Stripe.
            </li>
            <li>
              To send transactional emails (e.g., email confirmation, password
              reset). We do not send unsolicited marketing emails.
            </li>
            <li>To comply with legal obligations.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. Data Storage — Supabase
          </h2>
          <p>
            Your account data and QR history are stored on{" "}
            <span className="font-medium text-gray-900">Supabase</span>, a
            managed PostgreSQL platform. Data is encrypted at rest and in
            transit. Supabase infrastructure is hosted on AWS and complies with
            SOC 2 Type II standards. We do not sell or share your data with
            third parties except as described in this policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Cookies
          </h2>
          <p className="mb-2">We use the following types of cookies:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Essential cookies</span> — required
              for login sessions and security. Cannot be disabled.
            </li>
            <li>
              <span className="font-medium">Preference cookies</span> — remember
              your theme or language choices.
            </li>
            <li>
              <span className="font-medium">Analytics cookies</span> — anonymous
              usage data to help us improve the product. You may opt out via your
              browser settings.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            5. Stripe Payment Processing
          </h2>
          <p>
            All payment transactions are handled by{" "}
            <span className="font-medium text-gray-900">Stripe, Inc.</span> We
            never see or store your full card number, CVV, or bank details.
            Stripe is PCI-DSS Level 1 certified. By subscribing to a paid plan
            you also agree to{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Stripe's Privacy Policy
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            6. Your Rights
          </h2>
          <p className="mb-2">
            Depending on your location you may have the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Access</span> — request a copy of
              the personal data we hold about you.
            </li>
            <li>
              <span className="font-medium">Correction</span> — ask us to update
              inaccurate information.
            </li>
            <li>
              <span className="font-medium">Deletion</span> — request that we
              delete your account and associated data. You can also delete your
              account directly from the dashboard.
            </li>
            <li>
              <span className="font-medium">Portability</span> — receive your
              data in a structured, machine-readable format.
            </li>
            <li>
              <span className="font-medium">Objection</span> — object to
              processing where we rely on legitimate interests.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at{" "}
            <a
              href="mailto:support@qrfast.dev"
              className="text-green-600 hover:underline"
            >
              support@qrfast.dev
            </a>
            . We will respond within 30 days.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Data Retention
          </h2>
          <p>
            We retain your data for as long as your account is active. After
            account deletion, personal data is purged within 30 days, except
            where retention is required by law (e.g., financial records for 7
            years).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Material
            changes will be communicated via email or a prominent notice on the
            site at least 14 days before they take effect.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Contact Us
          </h2>
          <p className="text-sm">
            QuickQR &mdash;{" "}
            <a
              href="mailto:support@qrfast.dev"
              className="text-green-600 hover:underline"
            >
              support@qrfast.dev
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
