"use client";
import React, { useEffect, useState } from "react";

type Grievance = {
  studentName: string;
  rollNo: string;
  issueId: string;
  programid: number;
  campusid: number;
  subject: string;
  description: string;
  attachment: string | null;
};

type ProgramCampusMap = Record<
  string,
  { programName: string; campusName: string }
>;

const NewGrievance = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [programCampusMap, setProgramCampusMap] = useState<ProgramCampusMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setLoading(true);
        const res = await fetch("/admin/api/new-grev"); // ✅ FIXED path
        const data = await res.json();
        setGrievances(data.grievances);

        // Extract unique program-campus pairs
        const uniquePairs = Array.from(
          new Set(data.grievances.map((g: Grievance) => `${g.programid}-${g.campusid}`))
        ) as string[];

        const map: ProgramCampusMap = {};

        await Promise.all(
          uniquePairs.map(async (pair) => {
            const [programid, campusid] = pair.split("-");
            const infoRes = await fetch(
              `/api/program-campus-info?programid=${programid}&campusid=${campusid}`
            );
            const info = await infoRes.json();
            map[pair] = {
              programName: info.programName,
              campusName: info.campusName,
            };
          })
        );

        setProgramCampusMap(map);
      } catch (error) {
        console.error("Error loading grievances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">New Grievances</h2>
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-slate-500 py-8">Loading...</div>
        ) : grievances.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No new grievances found.</div>
        ) : (
          grievances.map((g) => {
            const key = `${g.programid}-${g.campusid}`;
            const programName = programCampusMap[key]?.programName || g.programid;
            const campusName = programCampusMap[key]?.campusName || g.campusid;

            return (
              <div
                key={g.issueId}
                className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border border-slate-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="font-semibold text-blue-800 text-lg">{g.subject}</div>
                  <div className="text-xs text-slate-500">Issue ID: {g.issueId}</div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Student:</span>{" "}
                    {g.studentName} ({g.rollNo})
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Program:</span>{" "}
                    {programName}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Campus:</span>{" "}
                    {campusName}
                  </div>
                </div>
                <div className="mt-2 text-slate-700">
                  <span className="font-medium">Description:</span> {g.description}
                </div>
                <div className="mt-2">
                  <span className="font-medium text-slate-700">Attachment:</span>{" "}
                  {g.attachment ? (
                    <a
                      href={g.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NewGrievance;