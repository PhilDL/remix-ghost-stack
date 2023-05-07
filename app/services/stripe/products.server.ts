import { stripe } from "./config.server";

export const getAllProductsAndPrice = async () => {
  const [products, prices] = await Promise.all([
    stripe.products.list({ active: true }),
    stripe.prices.list({ active: true }),
  ]);

  const productsAndPrices = products.data.map((product) => {
    const productPrices =
      prices.data.filter((price) => price.product === product.id) || [];
    return {
      product,
      prices: productPrices,
    };
  });

  return productsAndPrices;
};

export const getProductAndPriceByName = async (productName: string) => {
  const product = await stripe.products.search({
    query: `name:'${productName}'`,
    limit: 1,
  });
  const prices = await stripe.prices.list({
    active: true,
    product: product.data[0].id,
  });
  return {
    product: product.data[0],
    prices: prices.data,
  };
};
