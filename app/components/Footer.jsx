export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h3 className="text-lg font-bold text-white">Young Coders</h3>
          <p className="mt-2 text-sm">Empowering learning, one course at a time.</p>
        </div>
        <div className="text-sm">
          <p>📧 info@youngcoders.com</p>
          <p>📍 Accra, Ghana</p>
        </div>
        <div className="text-sm">
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>
      </div>
      <p className="text-center mt-6 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Young Coders. All rights reserved.
      </p>
    </footer>
  );
}
