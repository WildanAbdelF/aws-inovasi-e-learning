export default function Footer() {
  return (
    <footer className="bg-rose-600 py-10 text-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6">
        
        <div>
          <h3 className="font-semibold">AWS E-Learning</h3>
          <p className="text-sm text-rose-100">
            Belajar tanpa batas.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Kontak</h4>
          <p className="text-rose-100">awsinovasiglobal@gmail.com</p>
          <p className="text-rose-100">(+62) 888 8888 8888</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <p className="text-sm">
            <a href="/terms-and-conditions" className="text-rose-100 hover:text-white">Syarat & Ketentuan</a>
          </p>
          <p className="text-sm">
            <a href="/privacy-policy" className="text-rose-100 hover:text-white">Kebijakan Privasi</a>
          </p>
          <p className="text-sm">
            <a href="/refund-policy" className="text-rose-100 hover:text-white">Kebijakan Refund</a>
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Ikuti Kami</h4>
          <p className="text-rose-100">Twitter</p>
          <p className="text-rose-100">Instagram</p>
        </div>

      </div>

      <p className="text-center text-sm text-rose-100 mt-6 pt-12">
        © 2025 AWS E-Learning. All rights reserved.
      </p>
    </footer>
  );
}
