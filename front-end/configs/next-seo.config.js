const NextSeoConfig = {
  title: null,
  titleTemplate: "%s | Macau Casino - Nhà cái số 1 Châu Á",
  defaultTitle: "Macau Casino - Nhà cái số 1 Châu Á",
  description: "Macau Casino - Nhà cái số 1 Châu Á",
  additionalMetaTags: [
    {
      property: "keywords",
      content: "megalott, xo so, xoso, keno, keno 1p, keno 3p, keno 5p, keno online",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/assets/images/logo.png",
    },
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXTAUTH_URL,
    siteName: "Macau Casino - Nhà cái số 1 Châu Á",
    description: "Macau Casino - Nhà cái số 1 Châu Á",
    images: [
      {
        url: "https://i.ibb.co/NjRrxf8/Sands-Macao-5-e1400157658494.jpg",
        width: 1200,
        height: 628,
      },
    ],
  },
  facebook: {
    appId: process.env.FACEBOOK_APPID,
  },
  twitter: {
    handle: "@SandSGP",
    site: "@SandSGP",
    cardType: "summary_large_image",
  },
};
export default NextSeoConfig;
