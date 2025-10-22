export default {
  expo: {
    name: "YourAppName",
    slug: "your-app-slug",
    scheme: "yourapp",
    orientation: "portrait",
    icon: "./assets/icon.png",            // base app icon
    splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#ffffff" },

    web: {
      bundler: "metro",                   // or "webpack" if you prefer
      favicon: "./assets/favicon.png",
      themeColor: "#0ea5e9",
      backgroundColor: "#ffffff",
      display: "standalone",              // key PWA setting
      lang: "en",
      // Optional shortcuts shown in OS-level app menus
      // meta: { apple: { webAppCapable: true, statusBarStyle: "default" } }
    },

    // Good practice: define appId for web push or auth redirects later
    extra: { }
  }
}
