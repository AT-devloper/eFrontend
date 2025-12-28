export default function Home() {
  return (
    <section className="hero-carousel">
      <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">

        <div className="carousel-inner">

          <div className="carousel-item active">
            <div className="hero-slide slide1">
              <h1>Wedding Jewellery</h1>
              <p>Crafted for your most sacred moments</p>
              <a href="/products" className="btn btn-gold mt-3">
                Explore Collections
              </a>
            </div>
          </div>

          <div className="carousel-item">
            <div className="hero-slide slide2">
              <h1>Bridal Collections</h1>
              <p>Inspired by tradition & elegance</p>
              <a href="/products" className="btn btn-gold mt-3">
                Explore Collections
              </a>
            </div>
          </div>

          <div className="carousel-item">
            <div className="hero-slide slide3">
              <h1>Festive Gold</h1>
              <p>Celebrate every sparkle</p>
              <a href="/products" className="btn btn-gold mt-3">
                Explore Collections
              </a>
            </div>
          </div>

        </div>

        <div className="scroll-indicator"></div>

      </div>
    </section>
  );
}
