import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const TermsOfService = () => {
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
              Terms of <span className="gradient-text">Service</span>
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using Ridge, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  Ridge is a customizable profile and site builder that allows users to create unique public profile pages. Our service includes profile creation, customization, analytics, and social features.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-4">
                  To use certain features of Ridge, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Take responsibility for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">4. User Content</h2>
                <p className="text-muted-foreground mb-4">
                  You retain ownership of content you create on Ridge. By posting content, you grant us a license to display and distribute your content as part of our service. You agree not to post content that:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Is illegal, harmful, or violates others' rights</li>
                  <li>Contains malware or malicious code</li>
                  <li>Impersonates another person or entity</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains explicit or inappropriate material</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">5. Prohibited Activities</h2>
                <p className="text-muted-foreground mb-4">
                  Users are prohibited from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Using automated tools to scrape or collect data</li>
                  <li>Interfering with the proper functioning of the service</li>
                  <li>Harassing, threatening, or abusing other users</li>
                  <li>Using the service for spam or fraudulent purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">6. Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion. Upon termination, your right to use the service will immediately cease.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">7. Disclaimers</h2>
                <p className="text-muted-foreground">
                  Ridge is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, Ridge and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these terms from time to time. We will notify users of significant changes by posting a notice on our website. Your continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">10. Contact</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at notacake549@gmail.com or our discord server, ridge.3n.cc/discord
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

export default TermsOfService;
