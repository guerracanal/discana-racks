import { Rack } from "./rack";

export interface HomePageProps {
    useFetchAlbumsHook: (albums_collection: string, endpoint: string, random: boolean) => any;
    useFetchRacksHook: (racks_collection: string) => { racks: Rack[]; loading: boolean; error: any };
}
