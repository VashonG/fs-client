import Landing from "components/Landing";
import Layout from "components/Layout";
import { NextSeo } from "next-seo";

const Home = () => {
  return (
    <>
      <NextSeo
        title={`Welcome to ${process.env.NEXT_PUBLIC_TITLE} 👋`}
        description={`SupaNexTail is a boilerplate for your website, based on Next.js, Supabase, and TailwindCSS`}
      />
      <Layout>
        <Landing />
      </Layout>
    </>
  );
};
export default Home;
