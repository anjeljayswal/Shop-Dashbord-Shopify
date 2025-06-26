import {
  Layout,
  LegacyCard,
  Page,
} from "@shopify/polaris";
import { Card, OrderDetails, Ordersgraphs } from "../components";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [product, setProduct] = useState(0)
  async function fetchData() {
    // Fetch data or perform side effects here
    try {
      const request = await fetch("/api/products/count");
      let response = await request.json();
      setProduct(response.count);
      console.log("Product count:", response.count);
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  }

  useEffect(async () => {
    // Fetch data or perform side effects here
    fetchData();
  }, []);
  return (
    <Page fullWidth>
      <div className="home-section">
        <div className="graphs-section">
          <Ordersgraphs />
        </div>
        <div className="cards-section">
          <Layout>
            <Card title="Total Order" />
            <Card title="Fulfilled Order" />
            <Card title="Remains Order" />
            <Card title="Total Order" data={product} productsCard />
            <Card title="Total collection" />
          </Layout>
        </div>
        <div className="order-details-section">
          <OrderDetails />
        </div>
      </div>
    </Page>
  );
}






{/* <TitleBar title={t("HomePage.title")} /> */ }
// <Layout>
//   <Layout.Section>
//     <Card sectioned>
//       <Stack
//         wrap={false}
//         spacing="extraTight"
//         distribution="trailing"
//         alignment="center"
//       >
//         <Stack.Item fill>
//           <TextContainer spacing="loose">
//             <Text as="h2" variant="headingMd">
//               {t("HomePage.heading")}
//             </Text>
//             <p>
//               <Trans
//                 i18nKey="HomePage.yourAppIsReadyToExplore"
//                 components={{
//                   PolarisLink: (
//                     <Link url="https://polaris.shopify.com/" external />
//                   ),
//                   AdminApiLink: (
//                     <Link
//                       url="https://shopify.dev/api/admin-graphql"
//                       external
//                     />
//                   ),
//                   AppBridgeLink: (
//                     <Link
//                       url="https://shopify.dev/apps/tools/app-bridge"
//                       external
//                     />
//                   ),
//                 }}
//               />
//             </p>
//             <p>{t("HomePage.startPopulatingYourApp")}</p>
//             <p>
//               <Trans
//                 i18nKey="HomePage.learnMore"
//                 components={{
//                   ShopifyTutorialLink: (
//                     <Link
//                       url="https://shopify.dev/apps/getting-started/add-functionality"
//                       external
//                     />
//                   ),
//                 }}
//               />
//             </p>
//           </TextContainer>
//         </Stack.Item>
//         <Stack.Item>
//           <div style={{ padding: "0 20px" }}>
//             <Image
//               source={trophyImage}
//               alt={t("HomePage.trophyAltText")}
//               width={120}
//             />
//           </div>
//         </Stack.Item>
//       </Stack>
//     </Card>
//   </Layout.Section>
//   <Layout.Section>
//     <ProductsCard />
//   </Layout.Section>
// </Layout>