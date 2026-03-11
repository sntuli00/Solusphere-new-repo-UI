import React, { useState } from "react";
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

export default function HelpDesk() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/helpdesk",
        { subject, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data && res.data.ticket) {
        setTicket(res.data.ticket);
        setSubject("");
        setDescription("");
      } else {
        setError("Unexpected server response.");
      }
    } catch (err) {
      console.error("Helpdesk submission error:", err);
      setError(
        err.response?.data?.error || err.message || "Submission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="card bg-gradient-to-r from-primary to-accent-purple text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Help Desk</h2>
              <p className="text-white/90 mt-1">
                Get instant AI analysis and solutions for your issues
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Form */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Submit a Support Ticket
          </h3>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[150px] resize-y"
                placeholder="Provide detailed information about your issue..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                The more details you provide, the better our AI can help you.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* Ticket Result */}
        {ticket && (
          <div className="space-y-4">
            {/* Success Message */}
            <div className="card bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900">
                    Ticket Submitted Successfully!
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Our AI has analyzed your issue and provided recommendations below.
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Ticket #{ticket.id}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <ClockIcon className="w-4 h-4" />
                  {ticket.status}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                <p className="text-gray-900">{ticket.description}</p>
              </div>

              {/* AI Analysis Section */}
              <div className="space-y-4">
                {/* Analysis */}
                <div className="border-l-4 border-primary pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SparklesIcon className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-gray-900">AI Analysis</h4>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.aiAnalysis}</p>
                  </div>
                </div>

                {/* Solution */}
                <div className="border-l-4 border-secondary pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-secondary" />
                    <h4 className="font-semibold text-gray-900">Suggested Solution</h4>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.aiSolution}</p>
                  </div>
                </div>

                {/* Approach */}
                <div className="border-l-4 border-accent-purple pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-5 h-5 text-accent-purple" />
                    <h4 className="font-semibold text-gray-900">Step-by-Step Approach</h4>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.aiApproach}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Info */}
        {!ticket && (
          <div className="card bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              How our AI Help Desk works:
            </h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Submit your issue with as much detail as possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Our AI analyzes your problem using advanced language models</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Receive instant analysis, solutions, and step-by-step guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>If needed, our support team will follow up with you</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}