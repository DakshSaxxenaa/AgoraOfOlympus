const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p>
          © {new Date().getFullYear()} Agora of Olympus —
          A Mythical Trading Marketplace
        </p>
      </div>
    </footer>
  );
};

export default Footer;
