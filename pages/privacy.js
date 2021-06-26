// To modify the privacy policy, check the PrivacyPolicy.js component

import Layout from "components/Layout";
import { NextSeo } from "next-seo";
import PrivacyPolicy from "components/PrivacyPolicy";

const PrivacyPage = () => {
  return (
    <>
      <NextSeo
        title={`${process.env.NEXT_PUBLIC_TITLE} | Privacy Policy`}
        description={`SupaNexTail is a boilerplate for your website, based on Next.js, Supabase, and TailwindCSS`}
      />
      <Layout>
        <PrivacyPolicy />
      </Layout>
    </>
  );
};
export default PrivacyPage;