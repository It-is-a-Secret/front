interface PoliciesSheetProps {
  onClose: () => void;
}

export const PoliciesSheet = ({onClose}: PoliciesSheetProps) => {
  void onClose;

  return <section>PoliciesSheet</section>;
};
