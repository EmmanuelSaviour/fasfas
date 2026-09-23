import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;

    setForm((current) => ({
      ...current,
      [id]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError("Please complete all fields before sending.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to send your message right now."
        );
      }

      setForm({
        name: "",
        email: "",
        message: "",
      });

      setSuccess("Your message has been sent successfully.");
    } catch (submitError) {
      console.error("CONTACT FORM ERROR:", submitError);

      setError(
        submitError.message ||
          "Unable to send your message right now."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Contact FasFas
          </p>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Let's keep moving
            <br />
            together.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-emerald-100 md:text-xl">
            Have a question, suggestion, or idea?
            We'd love to hear from you.
          </p>

        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">

          {/* Contact Information */}
          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Get In Touch
            </p>

            <h2 className="mt-3 text-4xl font-bold leading-tight text-gray-900">
              We're here to help.
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Have a question, complaint, technical issue, or feedback about
              FasFas? Reach out to us and we'll be happy to help.
            </p>

            <div className="mt-10 space-y-6">

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  📧
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Support & Contact
                  </h3>

                  <a
                    href="mailto:fasfasrunning@gmail.com"
                    className="mt-1 inline-block text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    fasfasrunning@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  🌱
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Keep Growing
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Every message helps us make FasFas better.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-10">

            <h3 className="text-2xl font-bold text-gray-900">
              Send us a message
            </h3>

            <p className="mt-2 text-gray-600">
              We'd love to hear from you.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {sending ? "Sending..." : "🌱 Send Message"}
              </button>

              {/* Status */}
              {success && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </p>
              )}

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

            </form>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-emerald-600 px-8 py-14 text-center text-white shadow-xl">

          <h2 className="text-4xl font-bold">
            Ready to start your journey?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-emerald-100">
            You don't have to wait. Take your first step with FasFas today.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-emerald-600 shadow-md transition-all duration-300 hover:scale-105 hover:bg-emerald-50"
          >
            🌱 Plant Your Tree
          </Link>

        </div>
      </section>

    </main>
  );
}

export default Contact;