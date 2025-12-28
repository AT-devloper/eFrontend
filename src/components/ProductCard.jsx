const ProductCard = ({ image, name, price }) => {
  return (
    <div className="product-card fade-in">
      <div className="image-wrapper shimmer">
        <img src={image} alt={name} />
      </div>
      <h3>{name}</h3>
      <p className="price">{price}</p>
    </div>
  );
};

export default ProductCard;
