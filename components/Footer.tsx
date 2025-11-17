export default function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6">
        
        <div>
          <h3 className="font-semibold">LMS Platform</h3>
          <p className="text-sm text-neutral-600">
            Belajar tanpa batas.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Tautan Cepat</h4>
          <p className="text-sm">Katalog Kursus</p>
          <p className="text-sm">Tentang Kami</p>
          <p className="text-sm">Hubungi Kami</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Kontak</h4>
          <p>support@lms.com</p>
          <p>(021) 123-4567</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Ikuti Kami</h4>
          <p>Twitter</p>
          <p>Instagram</p>
        </div>

      </div>

      <p className="text-center text-sm text-neutral-500 mt-6">
        © 2024 LMS Platform. All rights reserved.
      </p>
    </footer>
  );
}
