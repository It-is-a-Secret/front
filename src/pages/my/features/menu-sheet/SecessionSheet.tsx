interface SecessionSheetProps {
  onClose: () => void;
}

export const SecessionSheet = ({onClose}: SecessionSheetProps) => {
  void onClose;

  return <section>SecessionSheet</section>;
};
