/* eslint-disable no-undef */
import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { GitHubUserItem } from '../utils/types';

import EditModeContext from '../component/context/editModeContext';
import UserCard from '..//component/userCard';

describe('UserCard render', () => {
  test('should display the information of the user', () => {
    const { getByText, getByRole, getByAltText } = renderUserCard(userItem, mockHandleProfilSelection);
    const loginElement = getByText(userItem.login);
    expect(loginElement).toBeInTheDocument();

    const profilLink = getByRole('link', { name: 'Consulter le profil' });
    expect(profilLink).toBeInTheDocument();
    expect(profilLink).toHaveAttribute('href', userItem.html_url);

    const avatarImage = getByAltText('Profile Image');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', userItem.avatar_url);
  });

  test('undefined checkbox with edit mode set to false', () => {
    const { queryByRole } = renderUserCard(userItem, mockHandleProfilSelection);

    const checkboxElement = queryByRole('checkbox');
    expect(checkboxElement).not.toBeInTheDocument();
  });

  test('visible checkbox with edit mode is on', () => {
    const { queryByRole } = renderUserCard(userItem, mockHandleProfilSelection, true);

    const checkboxElement = queryByRole('checkbox');
    expect(checkboxElement).toBeInTheDocument();
  });

  test('when checkbox is checked fire handleProfilSelection', () => {
    const { getByRole } = renderUserCard(userItem, mockHandleProfilSelection, true);

    const checkboxElement = getByRole('checkbox');
    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement).not.toBeChecked();

    fireEvent.click(checkboxElement);

    expect(mockHandleProfilSelection).toHaveBeenCalledWith(userItem);
  });
});

function renderUserCard(userItem: GitHubUserItem, mockHandleProfilSelection: jest.Mock, debugEditMode?: boolean) {
  return render(
    <EditModeContext>
      <UserCard userItem={userItem} handleProfilSelection={mockHandleProfilSelection} debugEditMode={debugEditMode} />
    </EditModeContext>
  );
}

const mockHandleProfilSelection = jest.fn();

const userItem: GitHubUserItem = {
  login: 'KinderrKill',
  id: 4605033,
  node_id: 'MDQ6VXNlcjQ2MDUwMzM=',
  avatar_url: 'https://avatars.githubusercontent.com/u/4605033?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/KinderrKill',
  html_url: 'https://github.com/KinderrKill',
  followers_url: 'https://api.github.com/users/KinderrKill/followers',
  following_url: 'https://api.github.com/users/KinderrKill/following{/other_user}',
  gists_url: 'https://api.github.com/users/KinderrKill/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/KinderrKill/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/KinderrKill/subscriptions',
  organizations_url: 'https://api.github.com/users/KinderrKill/orgs',
  repos_url: 'https://api.github.com/users/KinderrKill/repos',
  events_url: 'https://api.github.com/users/KinderrKill/events{/privacy}',
  received_events_url: 'https://api.github.com/users/KinderrKill/received_events',
  type: 'User',
  site_admin: false,
  score: 1.0,
  isSelected: false,
};
