export default function CookiesPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Last updated: October 24, 2023
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-3xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm prose prose-gray max-w-none">
          <p>
            This Cookie Policy explains how Cosmic Store ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website at cosmicshop.in. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>

          <h3>What are cookies?</h3>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h3>Why do we use cookies?</h3>
          <p>We use first-party and third-party cookies for several reasons:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Some cookies are required for technical reasons in order for our website to operate. We refer to these as "essential" or "strictly necessary" cookies.</li>
            <li><strong>Performance and Functionality Cookies:</strong> These are used to enhance the performance and functionality of our website but are non-essential to their use.</li>
            <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
          </ul>

          <h3>How can I control cookies?</h3>
          <p>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>
        </div>
      </div>
    </div>
  );
}
