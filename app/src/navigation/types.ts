export type PlansStackParamList = {
  PlansList: undefined;
  PlanDetail: { planId: string };
  Purchasing: { planId: string; demoMode?: boolean };
};

export type MyEsimsStackParamList = {
  MyEsimsList: undefined;
  EsimQr: { mint: string };
  InstallGuide: undefined;
  SellLeftover: { mint: string };
};

export type MarketplaceStackParamList = {
  MarketplaceList: undefined;
  ListingDetail: { listingId: string };
};

export type RootTabParamList = {
  Marketplace: undefined;
  Plans: undefined;
  MyEsims: undefined;
  Wallet: undefined;
};
