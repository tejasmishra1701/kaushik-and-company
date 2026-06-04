"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FIRM } from "@/lib/content";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    matter: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const getAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClasses =
    "w-full bg-[#0a0a0a] border border-[#1e1e1e] px-4 py-3 text-silver text-sm font-sans placeholder:text-[#6b6965] focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 py-32"
      ref={ref}
    >
      <BackgroundBeams />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header Block */}
        <motion.div {...getAnimProps(0)}>
          <h2 className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
            Get in Touch
          </h2>
        </motion.div>

        <motion.div {...getAnimProps(0.15)} className="mt-4">
          <h3 className="font-serif text-4xl font-normal text-white md:text-5xl">
            Begin your consultation.
          </h3>
        </motion.div>

        <motion.div {...getAnimProps(0.25)} className="mt-4">
          <p className="text-sm text-silver-dim">
            Contact the firm by phone, WhatsApp, or the form below. We respond
            to all enquiries within one working day.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left Column: Contact Details */}
          <motion.div {...getAnimProps(0.3)} className="space-y-8">
            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-silver-dim">
                Office Address
              </div>
              <div className="font-serif text-sm leading-relaxed text-silver">
                {FIRM.address}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-silver-dim">
                Telephone
              </div>
              <a
                href="tel:01242222343"
                className="font-mono text-sm text-silver transition-colors hover:text-white"
              >
                {FIRM.phone}
              </a>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-silver-dim">
                WhatsApp
              </div>
              <div>
                <a
                  href="https://wa.me/911242222343"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-silver transition-colors hover:text-white"
                >
                  +91-124-2222343
                </a>
                <div className="mt-1 text-xs text-silver-dim">
                  (click to open)
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-silver-dim">
                Email
              </div>
              <a
                href={`mailto:${FIRM.email}`}
                className="font-mono text-sm text-silver transition-colors hover:text-white"
              >
                {FIRM.email}
              </a>
            </div>
          </motion.div>

          {/* Right Column: Enquiry Form */}
          <motion.div {...getAnimProps(0.4)}>
            <div className="flex min-h-[400px] flex-col justify-center border border-[#1e1e1e] bg-[#111111]/80 p-8">
              {!submitted ? (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputClasses}
                  />
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={inputClasses}
                  />
                  <select
                    value={form.matter}
                    required
                    onChange={(e) =>
                      setForm({ ...form, matter: e.target.value })
                    }
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select matter type
                    </option>
                    <option value="Civil & Property">Civil & Property</option>
                    <option value="Corporate & Commercial">
                      Corporate & Commercial
                    </option>
                    <option value="Matrimonial & Family">
                      Matrimonial & Family
                    </option>
                    <option value="Criminal">Criminal</option>
                    <option value="Debt Recovery & Arbitration">
                      Debt Recovery & Arbitration
                    </option>
                    <option value="Consumer Matter">Consumer Matter</option>
                    <option value="Other">Other</option>
                  </select>
                  <textarea
                    placeholder="Brief description (optional)"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={`${inputClasses} resize-none`}
                  />
                  <button
                    type="submit"
                    className="w-full border border-[#1e1e1e] bg-[#111111] py-3 text-sm uppercase tracking-widest text-silver transition-all duration-300 hover:border-[#c9a84c] hover:text-white"
                  >
                    Send Enquiry &rarr;
                  </button>
                  <p className="mt-3 text-center text-xs text-silver-dim">
                    This form is for general enquiries only and does not
                    constitute legal advice.
                  </p>
                </form>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <div className="mb-6 h-[1px] w-12 bg-gold-line" />
                  <h3 className="text-center font-serif text-2xl text-white">
                    Enquiry received.
                  </h3>
                  <p className="mt-2 text-center text-sm text-silver-dim">
                    We will respond within one working day. For urgent matters
                    please call directly.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
