import { useProfileState } from '@/context/ProfileContext';
import { SessionLayout } from '@/layout/SessionLayout';
import { getAddressFromSigner } from '@/lens/ethers.service';
import { Profile, profiles } from '@/lens/profile';
import { ConnectorList } from '@/web3/components/ConnectorList';
import { Button } from '@chakra-ui/react';
import { UserCircleIcon } from '@heroicons/react/solid';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { useWeb3React } from '@web3-react/core';
import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';


export function ProfilePage() {
  const { chainId, account, deactivate, library } = useWeb3React();
  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="SessionScheduled transition-all duration-500 ease-in-out">
            <div className="flex flex-col text-center p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border min-h-[356px] min-w-[480px]">

              <div className="flex flex-row items-center my-4 mx-4">
                <UserCircleIcon className="text-green-500 mx-auto -mt-1 inline-block h-12 w-12" />
                <h2 className="ml-4 text-left flex-1 font-bold text-2xl text-gray-700 dark:text-gray-200">
                  Profiles
                </h2>
              </div>

              <div className="flex flex-col h-full px-4">
                {(!chainId || !account) ? (
                  <div>
                    <div className="text-lg font-medium mb-4">Connect Wallet</div>
                    <ConnectorList />
                  </div>
                ) : (
                  <ProfileListView />
                )}

              </div>
            </div>
          </div>
          <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
        </div>
      </div>
    </SessionLayout>
  );
}

function getProfileSrc(profile: Profile | undefined) {
  if (!profile || !profile.picture) {
    return undefined;
  }
  if ((profile.picture as { uri?: string }).uri) {
    return (profile.picture as { uri?: string }).uri;
  }
  return (profile.picture as { original: { url: string }}).original?.url;
}

const ProfileListView: FunctionComponent = () => {
  const [profileState, setProfileState] = useProfileState();

  const { isLoading: isLoadingProfiles, error: loadProfilesError, data: profilesData } = useQuery('Profile:list', async () => {
      const address = await getAddressFromSigner();
      return await profiles({ ownedBy: address });
    }
  );

  const navigate = useNavigate();

  const onClickProfile = (profile: Profile) => {
    setProfileState({ profile });
    navigate(`/session-types`);
  };

  return (
    <>
      <div className="my-10 grid">
        {loadProfilesError && (
          <p className="px-5 text-left text-red-500">
            {String(loadProfilesError)}
          </p>
        )}
        {!isLoadingProfiles ? (
          // profile list content
          profilesData && profilesData?.items?.length > 0 ? (
            profilesData.items.map((profile) => (
              <a key={profile.id}  onClick={() => onClickProfile(profile)}>
                <div className="items-center my-2 grid grid-cols-5 border-t border-b text-left text-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                  <img className="h-12 w-12 rounded-full" src={getProfileSrc(profile)} />
                  <div className="col-span-3">
                    <div className="mb-6">{profile.name}</div>
                    <div className="mb-6">@{profile.handle}</div>
                  </div>
                  <div className="flex justify-end items-center h-12 w-12">
                    {profileState.profile?.id === profile.id && (<CheckCircleIcon className="mx-auto text-green-500 -mt-1 inline-block h-6 w-6" />)}
                  </div>
                </div>
              </a>
            ))
          ) : (
            // TODO empty: No profiles yet
            <>
              <div className="items-center my-2 grid grid-cols-5 border-t border-b text-left text-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                <div className="h-12 w-12 rounded-rounded-full bg-gray-300 animate-pulse" />
                <div className="col-span-3">
                  <div className="flex-1 mb-2 h-3 bg-gray-300 animate-pulse"/>
                  <div className="flex-1 h-2 bg-gray-300 animate-pulse"/>
                </div>
                <div className="flex justify-end items-center h-12 w-12"/>
              </div>
              <div className="text-center">
                <p className="text-2xl font-cal text-gray-600">
                  {'No profiles yet. Click "Create New Profile" to create one.'}
                </p>
              </div>
            </>
          )
        ) : (
          // loading
          [0, 1].map((i) => (
            <div key={i}>
              <div className="items-center my-2 grid grid-cols-5 border-t border-b text-left text-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                <div className="h-12 w-12 rounded-rounded-full bg-gray-300 animate-pulse" />
                <div className="col-span-3">
                  <div className="flex-1 mb-2 h-3 bg-gray-300 animate-pulse"/>
                  <div className="flex-1 h-2 bg-gray-300 animate-pulse"/>
                </div>
                <div className="flex justify-end items-center h-12 w-12"/>
              </div>
            </div>
          ))
        )}
      </div>

      <Button isFullWidth colorScheme={"green"} onClick={() => navigate("/profile/create")}>Create New Profile</Button>
    </>
  );
};
