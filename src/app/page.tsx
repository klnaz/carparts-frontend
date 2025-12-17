import bestSellersDataRaw from "../data/bestSellers.json";
import type { Product } from "./components/ProductCard";
import HomePageContent from "./HomePageContent";

const mapBestSellers = (data: any[]): Product[] =>
  data.map((item) => ({
    BRANDCODE: item.BRANDCODE,
    name: item.NAME,
    STOCK_QUANTITY: item.STOCK_QUANTITY,
    price: item.price,
    image: item.image,
    BRAND: item.BRAND,
    CAR_BRAND: item.CAR_BRAND,
  }));

const HomePage = () => {
  const bestSellers = mapBestSellers(bestSellersDataRaw as any[]);
  const topBestSellers = bestSellers.slice(0, 8);

  return (
    <HomePageContent
      bestSellers={bestSellers}
      topBestSellers={topBestSellers}
    />
  );
};

export default HomePage;
