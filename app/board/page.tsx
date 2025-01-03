"use client";

import { useState, useEffect } from "react";
import { fetchSubmissions, updateStatus } from "../../lib/utils";

export type Submission = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  level: string;
  dateOfFlight: string;
  timeOfArrival: string;
  status: string;
  location: string;
};

export default function Board() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const getSubmissions = async () => {
      const data = await fetchSubmissions();
      setSubmissions(data);

      const savedData = localStorage.getItem("formSubmission");
      if (savedData) {
        const storedSubmission = JSON.parse(savedData) as Submission;
        const user = data.find(
          (submission) => submission.id === storedSubmission.id
        );
        setUserSubmission(user || storedSubmission);
      }

      setFilteredSubmissions(data); // Set initial list
    };

    getSubmissions();
  }, []);

  const handleFilter = () => {
    const filtered = submissions.filter((submission) => {
      const submissionDate = new Date(submission.dateOfFlight);
      const submissionLocalDate = new Date(
        submissionDate.getTime() - submissionDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      const matchesDate = filterDate
        ? submissionLocalDate === filterDate
        : true;
      const matchesTime = filterTime
        ? submission.timeOfArrival === filterTime
        : true;

      return matchesDate && matchesTime;
    });

    setFilteredSubmissions(filtered);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (userSubmission) {
      const updatedSubmission = { ...userSubmission, status: newStatus };

      // Update the backend
      await updateStatus(userSubmission.id, newStatus);

      // Update the local state for the user's submission
      setUserSubmission(updatedSubmission);

      // Update the local list of submissions
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === userSubmission.id ? updatedSubmission : submission
        )
      );

      // Update localStorage
      localStorage.setItem("formSubmission", JSON.stringify(updatedSubmission));
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Submissions</h1>

      {/* Display the user's submission card if available */}
      {userSubmission && (
        <div className="p-4 mb-4 border rounded-lg shadow-md bg-green-50">
          <h2 className="text-lg font-bold mb-2">Your Submission</h2>
          <p>
            <strong>Name:</strong> {userSubmission.name}
          </p>
          <p>
            <strong>Level:</strong> {userSubmission.level}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(userSubmission.dateOfFlight).toDateString()}
          </p>
          <p>
            <strong>Time:</strong> {userSubmission.timeOfArrival}
          </p>
          <p>
            <strong>Status:</strong> {userSubmission.status}
          </p>

          <div className="mt-2">
            <label className="block mb-1">Update Status:</label>
            <select
              value={userSubmission.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="found">Found</option>
              <option value="still looking">Still looking</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-4 flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded"
            placeholder="Filter Time"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="border p-2 rounded"
            placeholder="Filter Time"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-8 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {/* List of Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="p-4 border rounded-lg shadow-md bg-white flex flex-col gap-4"
          >
            <div className="flex justify-between">
              <p>
                <strong>Name:</strong> {submission.name}
              </p>
              <p>
                <strong>Level:</strong> {submission.level}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(submission.dateOfFlight).toDateString()}
              </p>
              <p>
                <strong>Time:</strong> {submission.timeOfArrival}
              </p>
            </div>
            <div className="flex justify-between flex-col gap-4">
              <p>
                <strong>Phone Number:</strong> {submission.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {submission.email}
              </p>
              <p>
                <strong>Location:</strong> {submission.location}
              </p>
            </div>
            <p>
              <strong>Status:</strong> {submission.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
