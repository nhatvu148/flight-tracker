import { useState, useEffect } from "react";
import "styles/globals.css";
import Layout from "@/layout";
import { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import store from "redux/store";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { isProd } from "helpers";

function MyApp({ Component, pageProps }: AppProps) {
  // useState to not share cache between users, create per life cycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // = 0 -> refetch every time changing tab focus
          },
        },
      })
  );

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isProd) {
        // @ts-ignore
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
        });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // @ts-ignore
  if (Component.getLayout) {
    // @ts-ignore
    return Component.getLayout(<Component {...pageProps} />);
  }
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
