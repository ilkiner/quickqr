export default function TermsPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gray-900 py-16 px-4 text-center">
        <span className="inline-block bg-green-600/20 text-green-400 rounded-full px-4 py-1 text-sm font-medium mb-4">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Terms of Service
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Last updated: April 8, 2026
        </p>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-14 space-y-10 text-gray-700 leading-relaxed">

        <div>
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            the QuickQR service operated by QuickQR ("we", "us", or "our"). By
            creating an account or using our service, you agree to these Terms.
            If you do not agree, please do not use QuickQR.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Use of the Service
          </h2>
          <p className="mb-2">
            You agree to use QuickQR only for lawful purposes. You must not:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Generate QR codes that link to illegal, harmful, or deceptive
              content.
            </li>
            <li>
              Attempt to reverse-engineer, scrape, or abuse the platform.
            </li>
            <li>
              Use automated bots or scripts to generate QR codes in bulk without
              prior written permission.
            </li>
            <li>
              Impersonate another person or entity in any QR code content.
            </li>
          </ul>
          <p className="mt-3">
            We reserve the right to suspend or terminate access for violations
            of these rules.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Plan Limits
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 text-gray-900 font-semibold">
                <tr>
                  <th className="text-left px-4 py-3">Feature</th>
                  <th className="text-left px-4 py-3">Free</th>
                  <th className="text-left px-4 py-3">Pro</th>
                  <th className="text-left px-4 py-3">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3">QR codes / month</td>
                  <td className="px-4 py-3">10</td>
                  <td className="px-4 py-3">Unlimited</td>
                  <td className="px-4 py-3">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">QR history</td>
                  <td className="px-4 py-3">Last 5</td>
                  <td className="px-4 py-3">Full history</td>
                  <td className="px-4 py-3">Full history</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Custom colors & frames</td>
                  <td className="px-4 py-3">Limited</td>
                  <td className="px-4 py-3">Full</td>
                  <td className="px-4 py-3">Full</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Priority support</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Plan limits may change. Current limits are always shown on the{" "}
            <a href="/pricing" className="text-green-600 hover:underline">
              Pricing
            </a>{" "}
            page.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. Payment & Cancellation
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Paid plans are billed monthly or annually depending on the option
              you choose at checkout.
            </li>
            <li>
              All payments are processed securely by Stripe. By subscribing you
              authorise Stripe to charge your payment method on a recurring
              basis.
            </li>
            <li>
              You may cancel your subscription at any time from your account
              settings. Cancellation takes effect at the end of the current
              billing period — you retain access until then.
            </li>
            <li>
              We do not offer refunds for partial billing periods unless
              required by applicable law.
            </li>
            <li>
              If a payment fails, we will notify you by email. Access may be
              downgraded to the Free plan after a 7-day grace period.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Content Responsibility
          </h2>
          <p>
            You are solely responsible for the content embedded in the QR codes
            you create. QuickQR does not review or moderate QR code content. We
            disclaim all liability for any harm arising from QR codes generated
            by users. If you believe a QR code generated via our service links
            to harmful content, contact us at{" "}
            <a
              href="mailto:support@qrfast.dev"
              className="text-green-600 hover:underline"
            >
              support@qrfast.dev
            </a>{" "}
            and we will investigate.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            5. Intellectual Property
          </h2>
          <p>
            All QuickQR branding, design, and software are owned by us. You
            retain ownership of the content you embed in your QR codes. By using
            the service you grant us a limited licence to store and process that
            content solely to provide the service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            6. Account Suspension & Termination
          </h2>
          <p className="mb-2">
            We may suspend or permanently terminate your account if:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You violate any of these Terms.</li>
            <li>
              Your account is used to distribute malware, phishing links, or
              illegal content.
            </li>
            <li>
              You attempt to access other users' data or disrupt the service.
            </li>
            <li>
              We receive a valid legal order requiring us to do so.
            </li>
          </ul>
          <p className="mt-3">
            Where possible, we will notify you before taking action and give you
            an opportunity to address the issue.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Disclaimer of Warranties
          </h2>
          <p>
            The service is provided "as is" without warranties of any kind,
            express or implied. We do not guarantee uninterrupted or error-free
            service. To the fullest extent permitted by law, we disclaim all
            warranties including fitness for a particular purpose.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, QuickQR's total liability
            for any claim arising out of or relating to these Terms or the
            service is limited to the amount you paid us in the 12 months
            preceding the claim, or $50, whichever is greater.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            9. Changes to These Terms
          </h2>
          <p>
            We may revise these Terms at any time. We will notify you of
            material changes via email or an in-app notice at least 14 days
            before the new Terms take effect. Continued use of the service after
            that date constitutes acceptance of the updated Terms.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Questions?
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
