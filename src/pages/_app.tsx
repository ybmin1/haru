import { AppProps } from "next/app";
import "@/styles/globals.css";

import GlobalLayout from "@/layouts/GlobalLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalLayout>
      <Component {...pageProps} />
    </GlobalLayout>
  );
}
