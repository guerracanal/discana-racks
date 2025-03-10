import { Rack } from "./rack";

export interface HomePageProps {
    useFetchAlbumsHook: (endpoint: string) => any;
    useFetchRacksHook: () => { racks: Rack[]; loading: boolean; error: any };
  }
  