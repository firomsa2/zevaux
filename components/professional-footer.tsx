import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Volume2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
  MessageSquare,
  CheckCircle,
  Shield,
  CreditCard,
  Clock,
  Users,
  ArrowRight,
  Download,
  ChevronRight,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function ProfessionalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Newsletter CTA */}
      {/* <div className="border-t border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Get AI Receptionist Insights
              </h3>
              <p className="text-gray-300">
                Join 10,000+ business leaders who receive our weekly newsletter
                with tips, case studies, and AI industry updates.
              </p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter your work email"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 py-6 rounded-xl"
                />
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white py-6 rounded-xl px-8 whitespace-nowrap">
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">Zevaux</div>
                <div className="text-gray-400">AI Receptionist</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Professional AI that handles customer calls, schedules
              appointments, captures leads, and follows up—sounding perfectly
              human while working with your existing phone system.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>1-800-ZEVAUX</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>sales@zevaux.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* App Stores */}
            {/* <div className="mb-8">
              <p className="text-gray-400 text-sm mb-3">
                Download our mobile app
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-lg">🍏</div>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-lg">▶️</div>
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div> */}
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Product</h4>
            <ul className="space-y-3">
              {[
                "Features",
                "Pricing",
                "Live Demos",
                "Voice Samples",
                "Integrations",
                "API Docs",
                "Mobile App",
                "Changelog",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Solutions</h4>
            <ul className="space-y-3">
              {[
                "Healthcare",
                "Legal Services",
                "Real Estate",
                "Financial Services",
                "Insurance",
                "Construction",
                "E-commerce",
                "Education",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {[
                "Documentation",
                "Help Center",
                "Community",
                "Blog",
                "Case Studies",
                "Webinars",
                "Support",
                "Contact Sales",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "SOC2, HIPAA, GDPR compliant",
              },
              {
                icon: CreditCard,
                title: "No Hidden Fees",
                description: "Transparent pricing, cancel anytime",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Phone, chat, and email support",
              },
              {
                icon: Users,
                title: "5,000+ Customers",
                description: "Trusted by businesses worldwide",
              },
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <badge.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold">{badge.title}</div>
                  <div className="text-sm text-gray-400">
                    {badge.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright and Legal */}
            <div className="flex flex-col md:flex-row items-center gap-6 text-gray-400 text-sm">
              <div>© {currentYear} Zevaux AI. All rights reserved.</div>
              <div className="flex flex-wrap items-center gap-6">
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Acceptable Use
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Subprocessors
                </Link>
              </div>
            </div>

            {/* Social Links and Language */}
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>

              {/* Language Selector */}
              {/* <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-4 h-4" />
                <select className="bg-transparent text-sm focus:outline-none cursor-pointer">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div> */}

              {/* Theme Toggle */}
              {/* <ModeToggle /> */}
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { text: "SOC2 Type II", color: "from-blue-500 to-blue-600" },
                {
                  text: "HIPAA Compliant",
                  color: "from-green-500 to-green-600",
                },
                { text: "GDPR Ready", color: "from-purple-500 to-purple-600" },
                { text: "PCI DSS", color: "from-orange-500 to-orange-600" },
                { text: "ISO 27001", color: "from-red-500 to-red-600" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white text-xs font-semibold flex items-center gap-2`}
                >
                  <CheckCircle className="w-3 h-3" />
                  {badge.text}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Legal */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs max-w-3xl mx-auto">
              Zevaux AI is a product of JCER LLC. All trademarks, logos and
              brand names are the property of their respective owners. All
              company, product and service names used in this website are for
              identification purposes only. Use of these names, trademarks and
              brands does not imply endorsement.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="rounded-full p-4 bg-gradient-to-r from-primary to-primary/90 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all group">
          <MessageSquare className="w-5 h-5" />
          <span className="ml-2 hidden sm:inline">Need Help?</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs animate-pulse">
            <span>!</span>
          </div>
        </Button>
      </div>
    </footer>
  );
}
