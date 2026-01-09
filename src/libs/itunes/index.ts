// iTunes Lookup API for fetching app icons

interface iTunesApp {
  trackId: number;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl512?: string;
}

interface iTunesLookupResponse {
  resultCount: number;
  results: iTunesApp[];
}

export interface AppIcon {
  appId: string;
  iconUrl: string;
}

export async function fetchAppIcons(appIds: string[]): Promise<Map<string, string>> {
  const iconMap = new Map<string, string>();

  if (appIds.length === 0) {
    return iconMap;
  }

  try {
    const ids = appIds.join(',');
    const response = await fetch(`https://itunes.apple.com/lookup?id=${ids}`);
    const data: iTunesLookupResponse = await response.json();

    for (const app of data.results) {
      iconMap.set(String(app.trackId), app.artworkUrl100);
    }
  } catch (error) {
    console.warn('[iTunes] Failed to fetch app icons:', error);
  }

  return iconMap;
}
