const Footer = () => {
  return (
    <footer className="border-t border-calm-100 bg-white py-6">
      <div className="mx-auto max-w-5xl px-6 text-center text-sm text-calm-600">
        <p>
          This tool offers a developmental screening, not a medical
          diagnosis. Always discuss results with your child's pediatrician
          or a qualified healthcare provider.
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} Early Steps Screening
        </p>
      </div>
    </footer>
  );
};

export default Footer;
