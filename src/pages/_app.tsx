import { AppProps } from "next/app";

import GlobalLayout from "@/layouts/GlobalLayout";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalLayout>
      <Component {...pageProps} />
    </GlobalLayout>
  );
}
