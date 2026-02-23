interface AddItemFABProps {
  onClick: () => void;
}

const AddItemFAB = ({ onClick }: AddItemFABProps) => (
  <button
    onClick={onClick}
    className="fixed bottom-28 right-5 z-30 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white active:scale-90 transition-transform"
    style={{
      background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
      boxShadow: "0 6px 28px rgba(109,40,217,0.45)",
    }}
    aria-label="Add item"
  >
    +
  </button>
);

export default AddItemFAB;
