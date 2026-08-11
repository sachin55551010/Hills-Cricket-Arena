import { useState } from "react";

export const GenerateInviteLinkModal = ({
  setAddPlayerModal,
  inviteLinkUrl,
  inviteLinkLoading,
  data,
}) => {
  const [copyLink, setCopyLink] = useState(false);
  const handleCloseBtn = () => {
    setAddPlayerModal(false);
  };

  //handle copy link button
  const copyLinkBtn = () => {
    navigator.clipboard.writeText(
      `${data?.myTeamPlayers?.createdBy?.playerName} invites you join ${data?.myTeamPlayers?.teamName} ${inviteLinkUrl} (The link is secured and will be expires in 5 days)`
    ); // this will copy the link to the clipboard
    setCopyLink(true);
  };

  return (
    <div className="fixed z-[999] inset-0 h-dvh w-auto flex items-center justify-center backdrop-blur-md">
      <div className="border border-base-content/20 p-3 rounded-md w-[95%] md:w-[70%] flex flex-col items-center h-auto gap-6 ">
        <h1 className="font-bold text-xl">Team Join Link</h1>
        <h4 className="text-[.7rem] font-bold">
          Copy this url and share with your team mates to join your team
        </h4>

        <div className="flex flex-col items-center w-full">
          {inviteLinkLoading ? (
            <span className="loading loading-dots loading-x"></span>
          ) : (
            <div className="flex gap-2">
              <p className="break-all p-1 rounded-md text-sm">
                {inviteLinkUrl}
              </p>
              <button
                onClick={copyLinkBtn}
                className={`${!copyLink ? "btn btn-info" : "btn"}`}
              >
                {copyLink ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {!inviteLinkLoading && (
          <h1 className="text-error bg-error/5 px-2 py-1 rounded-lg text-[.8rem] italic font-bold">
            This link will expire in 7 days
          </h1>
        )}

        <div className="w-full flex justify-end">
          <button onClick={handleCloseBtn} className="btn btn-accent">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
