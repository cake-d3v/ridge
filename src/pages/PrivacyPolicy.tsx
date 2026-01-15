import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold mb-8">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Ridge ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Account Information:</strong> Email address, username, and password</li>
                  <li><strong>Profile Information:</strong> Display name, bio, avatar, and any content you add to your profile</li>
                  <li><strong>Usage Data:</strong> Information about how you use our service</li>
                </ul>
                <p className="text-muted-foreground mt-4 mb-4">
                  We automatically collect certain information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Analytics Data:</strong> Page views, visitor counts, referrer information</li>
                  <li><strong>Device Information:</strong> Browser type, operating system</li>
                  <li><strong>Log Data:</strong> IP address, access times, pages viewed</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our service</li>
                  <li>Create and manage your account</li>
                  <li>Display your public profile to other users</li>
                  <li>Provide analytics about your profile's performance</li>
                  <li>Send you updates and notifications (if enabled)</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">4. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Public Profiles:</strong> Information you add to your public profile is visible to anyone</li>
                  <li><strong>Service Providers:</strong> We may share data with third-party services that help us operate our platform</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and associated data</li>
                  <li>Make your profile private</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">7. Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use local storage to maintain your session and preferences. We also use anonymized visitor IDs to track profile views and engagement metrics. We do not use third-party advertising cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Ridge is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it promptly.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our service, you consent to such transfers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@ridge.l5.ca.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
