export interface GitHubUser {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUserItem[];
}

export interface GitHubUserItem {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
  isSelected: boolean;
}

export interface UserListProps {
  loading: boolean;
  error: string | null | undefined;
  userItems: GitHubUserItem[];
  handleProfilSelection: (userItem: GitHubUserItem) => void;
  lastCardElementRef: (node: HTMLLIElement | null) => void;
}

export interface GithubUserItemProps {
  userItem: GitHubUserItem;
  handleProfilSelection: (userItem: GitHubUserItem) => void;
  debugEditMode?: boolean;
}

export interface EditModeContextType {
  editMode: boolean;
  setEditMode?: () => void;
  toggleEditMode: () => void;
}
