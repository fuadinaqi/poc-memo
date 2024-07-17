export default function Add(props: { onClick?: (type: 'numbering') => void }) {
  const { onClick = () => null } = props;
  return (
    <div className="absolute -bottom-6 right-0 flex items-center border border-orange-700">
      <button
        className="p-1 border flex items-center justify-center w-6 h-6 bg-teal-700 text-white border-black cursor-pointer"
        onClick={(event) => {
          event.preventDefault();
          onClick('numbering');
        }}
      >
        +
      </button>
    </div>
  );
}
