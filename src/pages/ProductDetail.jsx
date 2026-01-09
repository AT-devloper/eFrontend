// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productApi from '../api/productApi'; // use new instance
import Breadcrumbs from '../components/Breadcrumbs';

const ProductDetail = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.get(`/products/${productId}`);
        const data = res.data;

        // Flatten variants for easier filtering
        const mappedVariants = data.variants.map(v => ({
          id: v.id,
          sku: v.sku,
          prices: v.variantPrices,
          attributes: v.variantAttributeValues.map(vav => ({
            attributeId: vav.attribute.id,
            attributeName: vav.attribute.name,
            valueId: vav.attributeValue.id,
            valueName: vav.attributeValue.value,
          })),
          discount: v.variantDiscount || null,
        }));

        setProduct({
          id: data.id,
          name: data.name,
          category: data.category?.name || '',
          description: data.description,
          images: data.productImages || [],
          attributes: data.attributes?.map(attr => ({
            ...attr,
            attributeValues: attr.attributeValues || []
          })) || [],
        });

        setVariants(mappedVariants);
        setFilteredVariants(mappedVariants);
        setSelectedVariant(mappedVariants[0] || null);
        setMainImage(data.productImages?.[0]?.url || null);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAttributeChange = (attributeId, valueId) => {
    const newSelected = { ...selectedAttributes, [attributeId]: valueId };
    setSelectedAttributes(newSelected);

    // Filter variants based on selection
    const filtered = variants.filter(variant =>
      Object.entries(newSelected).every(([attrId, valId]) =>
        variant.attributes.find(a => a.attributeId.toString() === attrId && a.valueId.toString() === valId)
      )
    );

    setFilteredVariants(filtered);
    setSelectedVariant(filtered[0] || null);
  };

  const getPrice = () => {
    if (!selectedVariant) return null;
    const basePrice = selectedVariant.prices[0]?.price || 0;
    const discount = selectedVariant.discount?.amount || 0;
    return basePrice - discount;
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs categoryName={product.category} productName={product.name} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded"
          />
          <div className="flex mt-4 gap-2">
            {product.images?.length > 0 &&
              product.images.map(img => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded cursor-pointer border-2 border-gray-200 hover:border-blue-500"
                  onClick={() => setMainImage(img.url)}
                />
              ))
            }
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>

          {product.attributes.map(attr => (
            <div key={attr.id} className="mt-2">
              <h3 className="font-semibold">{attr.name}</h3>
              <div className="flex gap-2 flex-wrap mt-1">
                {attr.attributeValues.map(av => (
                  <button
                    key={av.id}
                    className={`px-3 py-1 border rounded ${
                      selectedAttributes[attr.id] === av.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                    onClick={() => handleAttributeChange(attr.id, av.id)}
                  >
                    {av.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 text-2xl font-bold text-gray-900">
            Price: ${getPrice()?.toFixed(2) || 'N/A'}
          </div>

          {selectedVariant && (
            <div className="mt-2 text-sm text-gray-600">
              SKU: {selectedVariant.sku}
            </div>
          )}

          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
