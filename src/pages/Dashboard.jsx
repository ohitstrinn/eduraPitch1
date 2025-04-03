import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🎓 Welcome to Edura, student!</h1>
      <p className="text-gray-600 mt-2">Here’s what you can explore today:</p>

      <ul className="mt-4 space-y-3">
        <li><Link to="/study-tools" className="text-purple-700 underline">AI Study Tools</Link></li>
        <li><Link to="/library" className="text-purple-700 underline">Campus Library</Link></li>
        <li><Link to="/book-trading" className="text-purple-700 underline">Book Trading</Link></li>
        <li><Link to="/delivery" className="text-purple-700 underline">Delivery Tracker</Link></li>
        <li><Link to="/student" className="text-purple-700 underline">Student Hub</Link></li>
      </ul>
    </div>
  );
}
