import { Auth } from "@supabase/ui";
import AuthComponent from "../components/Auth";
import Layout from "components/Layout";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AuthPage = () => {
  const { user, session } = Auth.useUser();
  const router = useRouter();

  useEffect(() => {
    // If a user is already logged in, return to the homepage
    if (user) {
      router.push("/");
    }
  }, [user]);
  return (
    <>
      <NextSeo
        title={`${process.env.NEXT_PUBLIC_TITLE} | Auth`}
        description={`This is the auth page for ${process.env.NEXT_PUBLIC_TITLE}`}
      />

      <Layout>
        <div>
          <h1 className='text-4xl font-bold md:text-5xl'>Auth</h1>
          <div className='container'>
            {!session && (
              <div className='max-w-md'>
                <AuthComponent />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AuthPage;
