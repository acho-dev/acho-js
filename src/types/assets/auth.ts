export interface AuthHelperInfo {}

/**
 * Auth list response types
 */
export interface IOAuthClient {
  id: string;
  name: string;
  auth_url: string;
  access_token_url: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  response_type: string;
  authorization_code: string;
  creator_id: number;
  team_id: number;
  token_type: 'bearer';
  access_token: string;
  expires_in: number;
  created_at: number;
  grant_type: 'refresh_token' | 'authorization_code' | 'client_credentials';
  refresh_token: string;
  content_type: string;
  scope: string;
}
