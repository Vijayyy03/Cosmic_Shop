export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Last updated: October 24, 2023
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-3xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm prose prose-gray max-w-none">
          <p>
            Welcome to Cosmic Store! These terms and conditions outline the rules and regulations for the use of Cosmic Store's Website, located at cosmicshop.in.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Cosmic Store if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h3>Products and Authenticity</h3>
          <p>
            We guarantee the authenticity of our gemstones and malas to the best of our knowledge and through the certifications provided by our gemological partners. However, spiritual experiences and energetic benefits described are traditional beliefs and should not be considered medical, legal, or financial advice. We do not guarantee specific life outcomes from the use of our products.
          </p>

          <h3>Pricing and Availability</h3>
          <p>
            All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time. We shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Service.
          </p>

          <h3>User Accounts</h3>
          <p>
            If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.
          </p>

          <h3>Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </div>
      </div>
    </div>
  );
}
