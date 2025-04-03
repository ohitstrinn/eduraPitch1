import { Button } from "../components/ui/button";
import { Card, CardContent, CardTitle } from "../components/ui/card";

export default function Subscription({ onSelectPremium }) {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">📚 Choose Your Plan</h1>

      <Card>
        <CardContent>
          <CardTitle>Freemium</CardTitle>
          <p className="text-sm text-gray-600">
            Ad-supported, basic access to previews and rewards.
          </p>
          <Button className="mt-2" onClick={() => alert("Freemium has limited access.")}>
            Select Freemium
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle>Student Plan</CardTitle>
          <p className="text-sm text-gray-600">
            4 downloads/month, avatar, basic help, daily rewards.
          </p>
          <Button className="mt-2" onClick={onSelectPremium}>
            Select Student
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle>Pro Plan</CardTitle>
          <p className="text-sm text-gray-600">
            AI tools, 10 downloads, quizzes, group study, no ads.
          </p>
          <Button className="mt-2" onClick={onSelectPremium}>
            Select Pro
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle>Platinum Plan</CardTitle>
          <p className="text-sm text-gray-600">
            All features + .edu tools, daily prizes, referrals.
          </p>
          <Button className="mt-2" onClick={onSelectPremium}>
            Select Platinum
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
