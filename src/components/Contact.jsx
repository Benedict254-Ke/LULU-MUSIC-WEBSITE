import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus("Please fill in all the fields.");
      return;
    }

    // Simulate sending message (NO backend yet)
    setStatus("Message sent successfully!");

    // Clear form
    setName("");
    setEmail("");
    setMessage("");

    // Hide success message after 5 seconds
    setTimeout(() => setStatus(""), 5000);
  };

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-neonBlue">Contact Me</h2>
        <p className="text-gray-400 mb-12 text-lg">
          Have a question, want to collaborate, or just want to say hi?  
          Fill out the form or reach me on social media!
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <form
            className="bg-gray-800 p-8 rounded-xl shadow-md flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue bg-gray-800"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue bg-gray-800"
              required
            />

            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue resize-none h-32 bg-gray-800"
              required
            />

            <button
              type="submit"
              className="bg-neonBlue text-darkBg font-semibold py-2 rounded-lg hover:shadow-lg transition"
            >
              Send Message
            </button>

            {/* Success or Error Message */}
            {status && (
              <p className="mt-3 text-center text-neonBlue font-semibold">
                {status}
              </p>
            )}
          </form>

          {/* Social Links */}
          <div className="flex flex-col justify-center items-center gap-6">
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              Or reach me on social media
            </h3>
            <div className="flex flex-col gap-4 md:flex-row md:gap-4">
              <a
                href="https://www.instagram.com/lulu_b_254/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                Instagram
              </a>

              <a
                href="https://www.facebook.com/lulua.ben"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-warmGold text-darkBg rounded-lg hover:bg-warmRed transition"
              >
                Facebook
              </a>

              <a
                href="mailto:benedict@example.com"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Email
              </a>

              <a
                href="https://wa.me/254103615042" // replace with your WhatsApp number
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
