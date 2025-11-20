// Instagram Graph API utility functions

export interface InstagramInsights {
  follower_count: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
  total_interactions: number;
  accounts_engaged: number;
}

export interface InstagramMediaInsights {
  id: string;
  media_type: string;
  like_count: number;
  comments_count: number;
  reach: number;
  impressions: number;
  saved: number;
  shares?: number;
  views?: number;
  permalink?: string;
  timestamp: string;
}

export interface InstagramAccountInfo {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  followers_count: number;
  follows_count: number;
}

export interface ThreadsInsights {
  threads_followers: number;
  threads_likes: number;
  threads_replies: number;
  threads_views: number;
  threads_clicks: number;
  threads_reposts: number;
}

/**
 * Get Instagram Business Account information
 */
export async function getInstagramAccountInfo(accessToken: string): Promise<InstagramAccountInfo> {
  // Validate token format
  if (!accessToken || accessToken.trim().length === 0) {
    throw new Error('Instagram access token is missing. Please provide a valid access token.');
  }

  const response = await fetch(
    `https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count,follows_count&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    
    // Handle specific OAuth errors
    if (error.error?.code === 190 || error.error?.type === 'OAuthException') {
      if (error.error?.message?.includes('Cannot parse access token') || 
          error.error?.message?.includes('Invalid OAuth access token')) {
        throw new Error('Invalid or expired Instagram access token. Please generate a new access token from Facebook Developer Console.');
      }
      throw new Error(`OAuth Error: ${error.error.message || 'Invalid access token. Please check your token and try again.'}`);
    }
    
    throw new Error(`Instagram API error: ${response.status} - ${error.error?.message || JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Get Instagram account insights/metrics
 */
export async function getInstagramInsights(
  accessToken: string,
  accountId: string
): Promise<InstagramInsights> {
  // Get account insights for the last 30 days using valid metrics
  const metrics = [
    'follower_count',
    'reach',
    'profile_views',
    'website_clicks',
    'total_interactions',
    'accounts_engaged'
  ].join(',');

  const period = 'day';
  const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000); // 30 days ago
  const until = Math.floor(Date.now() / 1000); // now

  const response = await fetch(
    `https://graph.instagram.com/${accountId}/insights?metric=${metrics}&period=${period}&since=${since}&until=${until}&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    
    // Handle specific OAuth errors
    if (error.error?.code === 190 || error.error?.type === 'OAuthException') {
      if (error.error?.message?.includes('Cannot parse access token') || 
          error.error?.message?.includes('Invalid OAuth access token')) {
        throw new Error('Invalid or expired Instagram access token. Please generate a new access token from Facebook Developer Console.');
      }
      throw new Error(`OAuth Error: ${error.error.message || 'Invalid access token. Please check your token and try again.'}`);
    }
    
    throw new Error(`Instagram API error: ${response.status} - ${error.error?.message || JSON.stringify(error)}`);
  }

  const data = await response.json();
  
  // Aggregate the daily data
  const aggregated: Partial<InstagramInsights> = {
    follower_count: 0,
    reach: 0,
    profile_views: 0,
    website_clicks: 0,
    total_interactions: 0,
    accounts_engaged: 0,
  };
  
  if (data.data && Array.isArray(data.data)) {
    data.data.forEach((item: { name: string; values: Array<{ value: number }> }) => {
      const total = item.values.reduce((sum, val) => sum + (val.value || 0), 0);
      if (item.name in aggregated) {
        aggregated[item.name as keyof InstagramInsights] = total;
      }
    });
  }

  return aggregated as InstagramInsights;
}

/**
 * Get recent media posts with insights
 */
export async function getInstagramMedia(
  accessToken: string,
  accountId: string,
  limit: number = 10
): Promise<InstagramMediaInsights[]> {
  // First get media list
  const mediaResponse = await fetch(
    `https://graph.instagram.com/${accountId}/media?fields=id,media_type,like_count,comments_count,timestamp,permalink&limit=${limit}&access_token=${accessToken}`
  );

  if (!mediaResponse.ok) {
    const error = await mediaResponse.json();
    throw new Error(`Instagram API error: ${mediaResponse.status} ${JSON.stringify(error)}`);
  }

  const mediaData = await mediaResponse.json();
  const mediaItems = mediaData.data || [];

  // Get insights for each media item
  const mediaWithInsights = await Promise.all(
    mediaItems.map(async (media: any) => {
      try {
        // Use valid metrics for media insights
        const mediaMetrics = media.media_type === 'VIDEO' 
          ? 'impressions,reach,saved,shares,views'
          : 'impressions,reach,saved,shares';
        
        const insightsResponse = await fetch(
          `https://graph.instagram.com/${media.id}/insights?metric=${mediaMetrics}&access_token=${accessToken}`
        );

        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          const insights: any = {};
          
          if (insightsData.data && Array.isArray(insightsData.data)) {
            insightsData.data.forEach((item: { name: string; values: Array<{ value: number }> }) => {
              // For media insights, values is usually a single object, not an array
              if (item.values && Array.isArray(item.values)) {
                const total = item.values.reduce((sum, val) => sum + (val.value || 0), 0);
                insights[item.name] = total;
              } else if (item.values && typeof item.values === 'object' && 'value' in item.values) {
                insights[item.name] = item.values.value || 0;
              }
            });
          }

          // Calculate engagement as likes + comments
          const engagement = (media.like_count || 0) + (media.comments_count || 0);

          return {
            id: media.id,
            media_type: media.media_type,
            like_count: media.like_count || 0,
            comments_count: media.comments_count || 0,
            impressions: insights.impressions || 0,
            reach: insights.reach || 0,
            saved: insights.saved || 0,
            shares: insights.shares || 0,
            views: insights.views || 0,
            permalink: media.permalink,
            timestamp: media.timestamp
          };
        }
      } catch (error) {
        console.error(`Error fetching insights for media ${media.id}:`, error);
      }

      // Return basic data if insights fail
      return {
        id: media.id,
        media_type: media.media_type,
        like_count: media.like_count || 0,
        comments_count: media.comments_count || 0,
        impressions: 0,
        reach: 0,
        saved: 0,
        permalink: media.permalink,
        timestamp: media.timestamp
      };
    })
  );

  return mediaWithInsights;
}

/**
 * Get Threads analytics/metrics
 */
export async function getThreadsInsights(
  accessToken: string,
  accountId: string
): Promise<ThreadsInsights> {
  // Get Threads insights for the last 30 days using valid Threads metrics
  const metrics = [
    'threads_followers',
    'threads_likes',
    'threads_replies',
    'threads_views',
    'threads_clicks',
    'threads_reposts'
  ].join(',');

  const period = 'day';
  const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000); // 30 days ago
  const until = Math.floor(Date.now() / 1000); // now

  const response = await fetch(
    `https://graph.instagram.com/${accountId}/insights?metric=${metrics}&period=${period}&since=${since}&until=${until}&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Threads API Error:', error);
    // If Threads metrics are not available (account not connected to Threads), return zeros
    if (response.status === 400) {
      console.warn('Threads metrics not available - account may not be connected to Threads');
      console.warn('Error details:', JSON.stringify(error, null, 2));
      return {
        threads_followers: 0,
        threads_likes: 0,
        threads_replies: 0,
        threads_views: 0,
        threads_clicks: 0,
        threads_reposts: 0,
      };
    }
    throw new Error(`Instagram API error: ${response.status} ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  
  // Aggregate the daily data
  const aggregated: Partial<ThreadsInsights> = {
    threads_followers: 0,
    threads_likes: 0,
    threads_replies: 0,
    threads_views: 0,
    threads_clicks: 0,
    threads_reposts: 0,
  };
  
  if (data.data && Array.isArray(data.data)) {
    data.data.forEach((item: { name: string; values: Array<{ value: number }> }) => {
      const total = item.values.reduce((sum, val) => sum + (val.value || 0), 0);
      if (item.name in aggregated) {
        aggregated[item.name as keyof ThreadsInsights] = total;
      }
    });
  }

  return aggregated as ThreadsInsights;
}

/**
 * Get comprehensive Instagram analytics data
 */
export async function getInstagramAnalytics(accessToken: string) {
  try {
    // Get account info first
    const accountInfo = await getInstagramAccountInfo(accessToken);
    
    // Get insights
    const insights = await getInstagramInsights(accessToken, accountInfo.id);
    
    // Get media with insights
    const media = await getInstagramMedia(accessToken, accountInfo.id, 10);

    return {
      account: accountInfo,
      insights,
      media
    };
  } catch (error) {
    console.error('Error fetching Instagram analytics:', error);
    throw error;
  }
}

