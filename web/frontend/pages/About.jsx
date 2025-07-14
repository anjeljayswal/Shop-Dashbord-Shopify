import React, { useEffect, useState } from "react";

function About() {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const response = await fetch("/api/page/about");
        if (!response.ok) {
          throw new Error("Failed to fetch About page");
        }
        const data = await response.json();
        setAboutContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{aboutContent.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: aboutContent.body_html }}
      />
    </div>
  );
}

export default About;
