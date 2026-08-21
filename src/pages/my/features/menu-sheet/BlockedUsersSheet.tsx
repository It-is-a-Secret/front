interface BlockedUsersSheetProps {
  onClose: () => void;
}

export const BlockedUsersSheet = ({onClose}: BlockedUsersSheetProps) => {
  void onClose;

  return <section>BlockedUsersSheet</section>;
};
