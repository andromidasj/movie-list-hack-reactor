import produce from 'immer';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Provider } from './models/tmdb/Provider';

const providers: Provider[] = [
  { name: 'Netflix', active: true, providerId: 8 },
  { name: 'Amazon Prime Video', active: true, providerId: 9 },
  { name: 'Disney Plus', active: true, providerId: 337 },
  { name: 'HBO Max', active: false, providerId: 384 },
  { name: 'Apple TV Plus', active: false, providerId: 350 },
  { name: 'Hulu', active: false, providerId: 15 },
  { name: 'Paramount Plus', active: false, providerId: 531 },
  { name: 'Starz', active: false, providerId: 43 },
];

const store = (set: any, get: any) => ({
  tab: 'toWatch',
  setTab: (input: 'toWatch' | 'watched' | 'search') => set({ tab: input }),
  searchQuery: '',
  setSearchQuery: (data: string) => set({ searchQuery: data }),
  providers: providers,
  setProviders: (i: number, name: string, active: boolean) =>
    set(
      produce((draft: any) => {
        draft.providers[i] = { name, active };
      })
    ),
});

const useStore = create(devtools(persist(store, { name: 'zustand_data' })));

export default useStore;
