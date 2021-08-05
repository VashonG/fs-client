/*
This is the login/register page. 
You have 2 components, the "AuthComponent" that handle the logic, 
and the "AuthText" that will show the description on the left of the screen
*/

import AuthComponent from "components/Auth";
import AuthText from "components/AuthText";
import Layout from "components/Layout";
import { NextSeo } from "next-seo";

const AuthPage = () => {
  return (
    <>
      <NextSeo
        title={`${process.env.NEXT_PUBLIC_TITLE} | Auth`}
        description={`This is the auth page for ${process.env.NEXT_PUBLIC_TITLE}`}
      />

      <Layout>
        <div className='flex flex-wrap justify-evenly w-full'>
          <AuthText />
          <div>
            <AuthComponent />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AuthPage;
