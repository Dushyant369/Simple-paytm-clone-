import { Link } from 'react-router-dom';

export function BottomWarning({ label, buttonText, to }) {
  return (
    <div className="py-2 text-sm flex justify-center">
      <span>{label}</span>
      <Link
        className="underline pl-1 cursor-pointer font-medium text-blue-600 hover:text-blue-800"
        to={to}
      >
        {buttonText}
      </Link>
    </div>
  );
}
