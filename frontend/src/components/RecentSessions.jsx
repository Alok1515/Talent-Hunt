import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="card bg-base-100 border-2 border-accent/20 hover:border-accent/30 mt-8">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-accent to-secondary rounded-xl">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black">Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`card relative ${
                  session.status === "active"
                    ? "bg-success/10 border-success/30 hover:border-success/60"
                    : "bg-base-200 border-base-300 hover:border-primary/30"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <div className="badge badge-success gap-1">
                      <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="card-body p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        session.status === "active"
                          ? "bg-gradient-to-br from-success to-success/70"
                          : "bg-gradient-to-br from-primary to-secondary"
                      }`}
                    >
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1 truncate">{session.problem}</h3>
                      <span
                        className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm opacity-80 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-base-300">
                    <span className="text-xs font-semibold opacity-80 uppercase">Completed</span>
                    <span className="text-xs opacity-40">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <Trophy className="w-10 h-10 text-accent/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">No sessions yet</p>
              <p className="text-sm opacity-50">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;
