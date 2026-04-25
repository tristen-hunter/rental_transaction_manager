import { Link } from "react-router-dom";


export default function SidebarLink({ to, label }: any) {
  return (
    <Link 
      to={to} 
      className="block px-4 py-2.5 rounded transition-colors hover:bg-gray-800 text-gray-300 hover:text-white"
    >
      {label}
    </Link>
  );
}