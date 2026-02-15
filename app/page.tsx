"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setBookmarks(data || []);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    const { error } = await supabase
      .from("bookmarks")
      .insert([{ title, url }]);

    if (!error) {
      setTitle("");
      setUrl("");
      fetchBookmarks();
    }
  };

  // Delete bookmark
 const deleteBookmark = async (id: string) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (!error) {
    fetchBookmarks();
  } else {
    console.log(error);
  }
};
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">

        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 Smart Bookmark App
        </h1>

        {/* Add Section */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-1/3"
          />

          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded w-2/3"
          />

          <button
            onClick={addBookmark}
            className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>

        {/* List Section */}
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded border"
            >
              <div>
                <h3 className="font-semibold">{bookmark.title}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  className="text-blue-500 text-sm hover:underline"
                >
                  {bookmark.url}
                </a>
              </div>

              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="text-red-500 text-xl hover:text-red-700"
              >
                ✖
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}