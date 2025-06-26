import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>Rent Tools From Your Neighbors</h1>
        <p>Save money and reduce waste by sharing tools in your community</p>
        <div className="hero-buttons">
          <a href="/tools" className="btn btn-primary">Browse Tools</a>
          <a href="/signup" className="btn btn-outline">Become a Lender</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;