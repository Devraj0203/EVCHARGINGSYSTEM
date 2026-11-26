import React, { useState } from 'react';
import { Star, MessageSquare, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewsView = () => {
  const { data, addReview } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(data.users[0]?.user_id || 1);
  const [stationId, setStationId] = useState(data.charging_stations[0]?.station_id || 1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) return;
    addReview(userId, stationId, rating, comment);
    setComment('');
    setShowModal(false);
  };

  const avgNetworkRating = (
    data.reviews.reduce((acc, r) => acc + r.rating, 0) / (data.reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Driver Reviews & Ratings Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            REVIEW relational table • Customer feedback, satisfaction scores, and station audit trail
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write Driver Review</span>
        </button>
      </div>

      {/* Review summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Network Average Rating</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 flex items-center gap-1.5">
            <span>{avgNetworkRating}</span>
            <span className="text-sm text-slate-500">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on {data.reviews.length} authenticated reviews</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">5-Star Experiences</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {data.reviews.filter((r) => r.rating === 5).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Highest satisfaction tier</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Station Feedback</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{data.reviews.length} Reviews</div>
          <div className="text-[11px] text-slate-500 mt-1">Linked with USER and CHARGING_STATION</div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.reviews.map((r) => {
          const user = data.users.find((u) => u.user_id === r.user_id);
          const station = data.charging_stations.find((s) => s.station_id === r.station_id);

          return (
            <div
              key={r.review_id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-sm font-bold text-white">{user ? user.name : `User #${r.user_id}`}</div>
                    <div className="text-xs text-emerald-400 font-medium">
                      {station ? station.station_name : `Station #${r.station_id}`}
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-300 italic leading-relaxed">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Review ID #{r.review_id}</span>
                <span>Verified Driver</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Post Station Review</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Driver</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {data.users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Charging Station</label>
                <select
                  value={stationId}
                  onChange={(e) => setStationId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {data.charging_stations.map((s) => (
                    <option key={s.station_id} value={s.station_id}>
                      {s.station_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Bad Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Feedback Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share feedback on charging speeds, cleanliness, cable reach..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
