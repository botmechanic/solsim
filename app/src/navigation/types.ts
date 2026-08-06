export type PlansStackParamList = {
  PlansList: undefined;
  PlanDetail: { planId: string };
  Purchasing: { planId: string; demoMode?: boolean };
};

export type MyEsimsStackParamList = {
  MyEsimsList: undefined;
  EsimQr: { mint: string };
  InstallGuide: undefined;
};

export type RootTabParamList = {
  Plans: undefined;
  MyEsims: undefined;
  Wallet: undefined;
};
