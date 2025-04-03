import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function DeliverySimulator() {
  const [delivered, setDelivered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDelivered(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 space-y-6 relative overflow-hidden min-h-screen">
      <Card>
        <CardContent className="space-y-4">
          <CardTitle>
            {delivered ? "🎉 Delivered!" : "📦 Delivery In Progress"}
          </CardTitle>

          <img
            src="https://i.imgur.com/0BSpnhL.gif" //The gif link
            alt="Cute Delivery Van"
            className="w-full max-w-md mx-auto"
          />

          <p className="text-center text-gray-600">
            {delivered
              ? "Thanks for trading! Your book has been delivered."
              : "Hang tight! Your book is on its way..."}
          </p>
        </CardContent>
      </Card>

      {/* Token Shower */}
      {delivered && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 text-yellow-400 text-2xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              💰
            </div>
          ))}
        </div>
      )}

      {/* Credit Confirmation + Button */}
      {delivered && (
        <div className="text-center mt-8">
          <p className="text-green-600 font-bold text-xl">
            +15 Edura Credits Earned!
          </p>
          <Button onClick={() => navigate("/book-trading")} className="mt-4">
            ← Back to Book Trading
          </Button>
        </div>
      )}
    </div>
  );
}
