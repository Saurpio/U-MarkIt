// pages/_app.js
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";  // Include this if you have a global CSS file, adjust the path if needed

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
