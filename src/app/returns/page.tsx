import Link from "next/link";
import { ArrowLeft, RefreshCcw, PackageX, Headset } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-20 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Our Policy</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            We want you to be completely satisfied with your purchase. Read our policy below to understand how we handle returns and exchanges for our spiritual products.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <RefreshCcw className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">7-Day Return Window</h3>
            <p className="text-sm text-gray-500">Initiate a return within 7 days of receiving your order.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <PackageX className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Condition Requirements</h3>
            <p className="text-sm text-gray-500">Items must be unused and in their original packaging.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Headset className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Dedicated Support</h3>
            <p className="text-sm text-gray-500">Our team is here to help you through the process.</p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm prose prose-gray max-w-none">
          <h3>General Return Policy</h3>
          <p>
            Due to the sacred and energetic nature of our products (Gemstones, Rudrakshas, Sacred Powders), we have strict guidelines for returns to maintain the purity and intention of the items. We accept returns within 7 days of delivery only if the product is damaged upon arrival, defective, or if you received an incorrect item.
          </p>

          <h3>Items Not Eligible for Return</h3>
          <ul>
            <li>Products that have been worn, used, or altered in any way.</li>
            <li>Customized or personalized items (e.g., custom malas).</li>
            <li>Sacred powders or soaps that have been opened or unsealed.</li>
            <li>Items purchased during a sale or promotional event.</li>
          </ul>

          <h3>How to Initiate a Return</h3>
          <ol>
            <li>Contact our support team at <a href="mailto:info.shivcosmic@gmail.com">info.shivcosmic@gmail.com</a> within 48 hours of delivery.</li>
            <li>Include your order number, a brief description of the issue, and clear photographs of the product and packaging.</li>
            <li>Wait for our team to review your request. We typically respond within 24 hours.</li>
            <li>If approved, we will provide you with a return shipping address and instructions.</li>
          </ol>

          <h3>Refunds</h3>
          <p>
            Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days. Please note that shipping costs are non-refundable.
          </p>

          <h3>Exchanges</h3>
          <p>
            We only replace items if they are defective or damaged. If you need to exchange an item for the same product, please follow the return initiation process outlined above.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 m-0">Still have questions?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors no-underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
