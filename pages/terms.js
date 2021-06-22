import Layout from "components/Layout";
import { NextSeo } from "next-seo";
import Terms from "components/Terms";

const TermsPage = () => {
  return (
    <>
      <NextSeo
        title={`${process.env.NEXT_PUBLIC_TITLE} | Terms and conditions`}
        description={`SupaNexTail is a boilerplate for your website, based on Next.js, Supabase, and TailwindCSS`}
      />
      <Layout>
        <Terms />
      </Layout>
    </>
  );
};
export default TermsPage;
