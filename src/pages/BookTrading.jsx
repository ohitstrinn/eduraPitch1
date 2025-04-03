import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

// Reuse the university book list for lookup
const BOOKS = [
  {
    title: "Introduction to Psychology",
    author: "David Myers",
    isbn: "9781319132101",
    format: "Digital + Physical",
  },
  {
    title: "Biology: Concepts & Connections",
    author: "Campbell",
    isbn: "9780134296012",
    format: "Physical",
  },
  {
    title: "Calculus for Scientists",
    author: "James Stewart",
    isbn: "9780538497817",
    format: "Digital",
  },
  {
    title: "They Say / I Say",
    author: "Gerald Graff",
    isbn: "9780393617436",
    format: "Physical",
  },
  {
    title: "A History of the Modern World",
    author: "R.R. Palmer",
    isbn: "9780073196586",
    format: "Digital",
  },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BookTrading() {
  const [step, setStep] = useState("overview");
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();
  const query = useQuery();

  // Load selected book from URL param (if present)
  useEffect(() => {
    const isbnFromQuery = query.get("book");
    if (isbnFromQuery) {
      const found = BOOKS.find((b) => b.isbn === isbnFromQuery);
      if (found) {
        setSelectedBook(found);
        setStep("sendPhysical");
      }
    }
  }, [query]);

  const goTo = (target) => () => setStep(target);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📚 Book Trading</h1>

      {step === "overview" && (
        <>
          <Card>
            <CardContent className="space-y-2">
              <CardTitle>Have a book collecting dust?</CardTitle>
              <p>
                Trade in your used textbook (physical or digital) and get Edura
                credits to use toward your next one.
              </p>
              <Button onClick={goTo("choose")}>Start a Trade-In</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <CardTitle>Need a Book Immediately?</CardTitle>
              <p>
                Select “Digital Add-On” to access the eBook temporarily while your
                physical one ships.
              </p>
              <Button onClick={goTo("getDigital")}>Browse Available Books</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <CardTitle>Get Both: Digital + Physical</CardTitle>
              <p>
                Buy the bundle and get instant access to the digital version while
                your physical copy is on the way.
              </p>
              <Button onClick={goTo("bundle")}>Shop Bundles</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <CardTitle>📦 How Trading Works</CardTitle>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                <li>We send you a prepaid envelope to mail your book.</li>
                <li>Once received, you earn Edura Credits.</li>
                <li>Use credits to get your next textbook from another student.</li>
                <li>Add optional digital access if you need it now.</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {step === "choose" && (
        <Card>
          <CardContent className="space-y-3">
            <CardTitle>What would you like to do?</CardTitle>
            <Button onClick={goTo("sendPhysical")}>📦 Trade a Physical Book</Button>
            <Button onClick={goTo("getDigital")}>💻 Trade a Digital Book</Button>
            <Button onClick={goTo("overview")}>← Back</Button>
          </CardContent>
        </Card>
      )}

      {step === "sendPhysical" && (
        <Card>
          <CardContent className="space-y-3">
            <CardTitle>📬 Trade Your Physical Book</CardTitle>
            {selectedBook ? (
              <>
                <p className="text-sm text-gray-600">
                  <strong>Selected Book:</strong> {selectedBook.title}
                </p>
                <p className="text-sm text-gray-600">
                  ISBN: {selectedBook.isbn}
                </p>
              </>
            ) : (
              <p>No book selected — choose from Library or start here.</p>
            )}
            <p>You’ll receive a prepaid envelope to mail your textbook to us.</p>
            <p>Once scanned into inventory, you’ll earn Edura credits.</p>
            <Button onClick={() => navigate("/delivery")}>📦 Proceed to Delivery</Button>
            <Button onClick={goTo("choose")}>← Back</Button>
          </CardContent>
        </Card>
      )}

      {step === "getDigital" && (
        <Card>
          <CardContent className="space-y-3">
            <CardTitle>⚡ Need It Now?</CardTitle>
            <p>We’ll give you temporary digital access to the textbook.</p>
            <p>This expires once your physical book arrives (unless bundled).</p>
            <div className="space-x-2">
              <Button onClick={goTo("bundle")}>📦💻 Buy Bundle</Button>
              <Button onClick={goTo("choose")}>← Back</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "bundle" && (
        <Card>
          <CardContent className="space-y-3">
            <CardTitle>📦 + 💻 Bundle Confirmed</CardTitle>
            <p>You now have full digital access and a physical copy will be shipped!</p>
            <Button onClick={goTo("overview")}>← Back to Start</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
