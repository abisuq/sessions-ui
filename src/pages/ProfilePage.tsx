import { useProfileState } from '@/context/ProfileContext';
import { getAddressFromSigner } from '@/lens/ethers.service';
import { createProfile, Profile, profiles } from '@/lens/profile';
import { SessionBookFlow } from '@/partials/Book/components/SessionBookFlow';
import { ConnectorList } from '@/web3/components/ConnectorList';
import { useWeb3React } from '@web3-react/core';
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/app/Layout";
import BlurImage from "@/components/BlurImage";
import Modal from "@/components/Modal";
import LoadingDots from "@/components/app/loading-dots";
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from "use-debounce";

// import { server } from "config";
const dev = process.env.NODE_ENV !== "production";
export const rootname = dev ? "localhost:3000" : "punk3.xyz";
export const server = (subdomain?: string | null): string => {
  if (subdomain) {
    return dev
      ? `http://${subdomain}.${rootname}`
      : `https://${subdomain}.${rootname}`;
  }
  return dev ? `http://${rootname}` : `https://${rootname}`;
};

import toast, { Toaster } from "react-hot-toast";

export function ProfilePage() {
  const { chainId, account, deactivate, library } = useWeb3React()

  const [profileState, setProfileState] = useProfileState();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [creatingSite, setCreatingSite] = useState<boolean>(false);
  const [subdomain, setSubdomain] = useState<string>("");
  const [debouncedSubdomain] = useDebounce(subdomain, 1500);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const profileNameRef = useRef<HTMLInputElement | null>(null);
  const siteSubdomainRef = useRef<HTMLInputElement | null>(null);
  const siteDescriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const { isLoading: isLoadingProfiles, error: loadProfilesError, data: profilesData } = useQuery('Profile:list', async () => {
      const address = await getAddressFromSigner();
      return await profiles({ ownedBy: address });
    }
  );


  useEffect(() => {
    async function checkSubDomain() {
      if (debouncedSubdomain.length > 0) {
        const response = await fetch(
          `/api/domain/check?domain=${debouncedSubdomain}&subdomain=1`
        );
        const available = await response.json();
        if (available) {
          setError(null);
        } else {
          setError(`${server(debouncedSubdomain)}`);
        }
      }
    }
    checkSubDomain();
  }, [debouncedSubdomain]);

  const navigate = useNavigate();

  /*const { data: session }: any = useSession();
  const sessionId = session?.user.id;

  const { data: sites } = useSWR<Array<Site>>(
    sessionId && `/api/site`,
    fetcher
  );*/


  async function onSubmitProfile() {
    let profileId: string;
    try {
      if (!profileNameRef.current) {
        throw new Error("Missing required siteName");
      }
      // create profile
      const res = await createProfile(profileNameRef.current?.value)
      console.log("profile created", res);
      // query profile
      const profile = (await profiles(
        { handles: [profileNameRef.current?.value] },
      )).items[0];
      setProfileState({ profile });
    } catch (e: any) {
      console.log("create profile error", e);
      if (e.message === "HANDLE_TAKEN") {
        setProfileError(name);
        setCreatingSite(false);
      } else {
        toast.error("Failed to Create Profile", e.message);
        setCreatingSite(false);
      }

      return;
    }

    // TODO delete example code
    /*const res = await fetch("/api/site", {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileId,
        userId: sessionId,
        name: profileNameRef.current?.value,
        subdomain: siteSubdomainRef.current?.value,
        description: siteDescriptionRef.current?.value,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      navigate(`/site/${data.siteId}`);
    }*/
  }

  return (
    <Layout>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setCreatingSite(true);
            onSubmitProfile();
          }}
          className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
        >
          <h2 className="font-cal text-2xl mb-6">Create a New Profile</h2>
          <div className="grid gap-y-5 w-5/6 mx-auto">
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
              <span className="pl-5 pr-1">📌</span>
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                name="name"
                placeholder="Profile Name"
                ref={profileNameRef}
                type="text"
                onInput={() => setName(profileNameRef.current!.value)}
              />
            </div>
            {profileError && (
              <p className="px-5 text-left text-red-500">
                Profile <b>{profileError}</b> has already been taken, please try
                another one.
              </p>
            )}
            {/*TODO delete example code*/}
            {/*<div className="border border-gray-700 rounded-lg flex flex-start items-center">
              <span className="pl-5 pr-1">🪧</span>
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-l-lg placeholder-gray-400"
                name="subdomain"
                onInput={() => setSubdomain(siteSubdomainRef.current!.value)}
                placeholder="Subdomain"
                ref={siteSubdomainRef}
                type="text"
              />
              <span className="px-5 bg-gray-100 h-full flex items-center rounded-r-lg border-l border-gray-600">
                .punk3.xyz
              </span>
            </div>
            {error && (
              <p className="px-5 text-left text-red-500">
                <b>{error}</b> is not available. Please choose another
                subdomain.
              </p>
            )}
            <div className="border border-gray-700 rounded-lg flex flex-start items-top">
              <span className="pl-5 pr-1 mt-3">✍️</span>
              <textarea
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                name="description"
                placeholder="Description"
                ref={siteDescriptionRef}
                required
                rows={3}
              />
            </div>*/}
          </div>
          <div className="flex justify-between items-center mt-10 w-full">
            <button
              type="button"
              className="w-full px-5 py-5 text-sm text-gray-600 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
              onClick={() => {
                setError(null);
                setShowModal(false);
              }}
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={creatingSite || error !== null}
              className={`${creatingSite || error
                ? "cursor-not-allowed text-gray-400 bg-gray-50"
                : "bg-white text-gray-600 hover:text-black"
              } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
            >
              {creatingSite ? <LoadingDots /> : "CREATE PROFILE"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border">
        {(!chainId || !account) && (
          <div>
            <div className="text-lg font-medium mb-4">Connect Wallet</div>
            <ConnectorList />
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 justify-between items-center">
          <h1 className="font-cal text-5xl">My Profiles</h1>
          <button
            onClick={() => setShowModal(true)}
            className="font-cal text-lg w-3/4 sm:w-44 tracking-wide text-white bg-black border-black border-2 px-5 py-3 hover:bg-white hover:text-black transition-all ease-in-out duration-150"
          >
            New Profile <span className="ml-2">＋</span>
          </button>
        </div>

        <div className="my-10 grid gap-y-10">
          {!isLoadingProfiles ? (
            profilesData && profilesData?.items?.length > 0 ? (
              profilesData.items.map((profile) => (
                <a key={profile.id}  onClick={() => setProfileState({ profile })}>
                  <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                    {/*<div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none">
                        {profile.image ? (
                          <BlurImage
                            src={profile.image}
                            layout="fill"
                            objectFit="cover"
                            alt={profile.name ?? "Site thumbnail"}
                          />
                        ) : (
                          <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-4xl select-none">
                            ?
                          </div>
                        )}
                      </div>*/}
                    <div className="relative p-10">
                      <h2 className="font-cal text-3xl">{profile.handle}</h2>
                      {/*<p className="text-base my-5 line-clamp-3">
                          {profile.description}
                        </p>
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={server(site.subdomain)}
                          target="_blank"
                          className="font-cal px-3 py-1 tracking-wide rounded bg-gray-200 text-gray-600 absolute bottom-5 left-10 whitespace-nowrap"
                        >
                          {server(site.subdomain)} ↗
                        </a>*/}
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                  <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300" />
                  <div className="relative p-10 grid gap-5">
                    <div className="w-28 h-10 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-cal text-gray-600">
                    No profiles yet. Click "New Profile" to create one.
                  </p>
                </div>
              </>
            )
          ) : (
            [0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300 animate-pulse" />
                <div className="relative p-10 grid gap-5">
                  <div className="w-28 h-10 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
