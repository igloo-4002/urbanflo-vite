
export interface ToolBarItemProps {
    src: string;
    alt: string;
    onClick: () => void;
}

export function ToolBarItem(props: ToolBarItemProps) {

  return (
    <button onClick={props.onClick} className='hover:bg-gray-300 p-1 rounded-md duration-200'>
      <img
        src={props.src}
        alt={props.alt}
        style={{
            height: "24px",
            width: "24px",
        }}
      />
    </button>
  );
}
