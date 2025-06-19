"use client";
import React, { useEffect, useState } from "react";

//from "/api/lodged";
type Grievance = {
  roll_no: string;
  issueId: string;
  subject: string;
  description: string;
  issueType: string;
  status: string;
  date: string;
  time: string;
  attachment: boolean;
};

//from "/api/academic-info";
type StudentInfo = {
  roll_no: string;
  name: string;
  father: string;
  mother: string;
  aadhar: string;
  category: string;
  gender: string;
  lateral_entry: boolean;
  email: string;
  mobile: string;
  year: number;
};

//from "/api/academic-info";
type AcademicInfo = {
  roll_no: string;
  programid: number;
  academicyear: number;
  term: number;
  campusid: number;
  batch: number;
  status: string;
};

//from "/api/program-campus-info";
type ProgramCampus = {
  programName: string;
  campusName: string;
};
//from "/api/program-campus-info";
type ProgramCampusMap = Record<
  string,
  { programName: string; courseName: string }
>;

const NewGrievance = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  // const [programCampusMap, setProgramCampusMap] = useState<ProgramCampusMap>({});
  const [loading, setLoading] = useState(true);
  const [programName, setProgramName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");

  // useEffect(() => {
  //   const fetchGrievances = async () => {
  //     try {
  //       setLoading(true);

  //       // 1. Fetch all grievances
  //       const res = await fetch("/api/lodged");
  //       const data = await res.json();
  //       const grievances: Grievance[] = data.grievances;

  //       setGrievances(grievances);

  //       // 2. Extract roll numbers
  //       const rollNos = grievances.map((g: Grievance) => g.roll_no);

  //       // 3. Fetch academic info in bulk via POST
  //       const academicRes = await fetch("/api/academic-info", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ roll_nos: rollNos }),
  //       });

  //       const academicData: AcademicInfo[] = await academicRes.json();

  //       // 4. Map roll_no to academic info
  //       const rollNoToAcademic: Record<string, AcademicInfo> = {};
  //       academicData.forEach((a) => {
  //         rollNoToAcademic[a.roll_no] = a;
  //       });

  //       // 5. Extract unique program-campus pairs from academic info
  //       const uniquePairs = Array.from(
  //         new Set(academicData.map((a) => `${a.programid}-${a.campusid}`))
  //       );

  //       // 6. Fetch program and campus names for each pair
  //       const map: ProgramCampusMap = {};

  //       await Promise.all(
  //         uniquePairs.map(async (pair) => {
  //           const [programid, campusid] = pair.split("-");
  //           const infoRes = await fetch(
  //             `/api/program-campus-info?programid=${programid}&campusid=${campusid}`
  //           );
  //           const info = await infoRes.json();

  //           map[pair] = {
  //             programName: info.programName,
  //             courseName: info.courseName, // or campusName depending on naming
  //           };
  //         })
  //       );

  //       // 7. Store final map
  //       setProgramCampusMap(map);
  //     } catch (err) {
  //       console.error("Failed to load data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchGrievances();
  // }, []);
  useEffect(() => {
  const fetchGrievances = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/lodged");
      const data = await res.json();
      const grievances: Grievance[] = data.grievances;
      setGrievances(grievances);

      const rollNos = grievances.map((g) => g.roll_no);

      const [academicRes, studentRes] = await Promise.all([
        fetch("/api/academic-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roll_nos: rollNos }),
        }),
        fetch("/api/student-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roll_nos: rollNos }),
        }),
      ]);

      const academicData: AcademicInfo[] = await academicRes.json();
      const studentData: StudentInfo[] = await studentRes.json();

      const academicMap: Record<string, AcademicInfo> = {};
      academicData.forEach((a) => {
        academicMap[a.roll_no] = a;
      });
      setRollNoToAcademic(academicMap);

      const studentMap: Record<string, StudentInfo> = {};
      studentData.forEach((s) => {
        studentMap[s.roll_no] = s;
      });
      setRollNoToStudent(studentMap);

      const uniquePairs = Array.from(
        new Set(academicData.map((a) => `${a.programid}-${a.campusid}`))
      );

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
            courseName: info.courseName,
          };
        })
      );

      setProgramCampusMap(map);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchGrievances();
}, []);

 let content;
if (loading) {
  content = <div className="text-center text-slate-500 py-8">Loading...</div>;
} else if (grievances.length === 0) {
  content = (
    <div className="text-center text-slate-500 py-8">
      No new grievances found.
    </div>
  );
} else {
  content = grievances.map((g) => {
    const academic = rollNoToAcademic[g.roll_no];
    const student = rollNoToStudent[g.roll_no];

    const programid = academic?.programid ?? 0;
    const campusid = academic?.campusid ?? 0;

    const key = `${programid}-${campusid}`;
    const programName = programCampusMap[key]?.programName || `Program ID ${programid}`;
    const courseName = programCampusMap[key]?.courseName || `Campus ID ${campusid}`;

    return (
      <div
        key={g.issueId}
        className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border border-slate-200"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="font-semibold text-blue-800 text-lg">
            {g.subject}
          </div>
          <div className="text-xs text-slate-500">Issue ID: {g.issueId}</div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-8 gap-2 text-sm">
          <div>
            <span className="font-medium text-slate-700">Student:</span>{" "}
            {student?.name || "Unknown"} ({g.roll_no})
          </div>
          <div>
            <span className="font-medium text-slate-700">Program:</span>{" "}
            {programName}
          </div>
          <div>
            <span className="font-medium text-slate-700">Campus:</span>{" "}
            {courseName}
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
  });
}

return (
  <div>
    <h2 className="text-xl font-bold mb-4">New Grievances</h2>
    <div className="space-y-6">{content}</div>
  </div>
);
} 



function setProgramCampusMap(map: ProgramCampusMap) {
  throw new Error("Function not implemented.");
}
//   let content;
//   if (loading) {
//     content = <div className="text-center text-slate-500 py-8">Loading...</div>;
//   } else if (grievances.length === 0) {
//     content = (
//       <div className="text-center text-slate-500 py-8">
//         No new grievances found.
//       </div>
//     );
//   } else {
//     content = grievances.map((g) => {
//       // Use programid and campusid to get program and course names
//       // get from programCampusMap and academicInfo

//       const key = `${g.programid}-${g.campusid}`;
//       const programName = programCampusMap[key]?.programName || g.programid;
//       const courseName = programCampusMap[key]?.courseName || g.campusid;

//       return (
//         <div
//           key={g.issueId}
//           className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border border-slate-200"
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//             <div className="font-semibold text-blue-800 text-lg">
//               {g.subject}
//             </div>
//             <div className="text-xs text-slate-500">Issue ID: {g.issueId}</div>
//           </div>
//           <div className="flex flex-col md:flex-row md:gap-8 gap-2 text-sm">
//             <div>
//               <span className="font-medium text-slate-700">Student:</span>{" "}
//               {g.studentName} ({g.rollNo})
//             </div>
//             <div>
//               <span className="font-medium text-slate-700">Program:</span>{" "}
//               {programName}
//             </div>
//             <div>
//               <span className="font-medium text-slate-700">Course:</span>{" "}
//               {courseName}
//             </div>
//           </div>
//           <div className="mt-2 text-slate-700">
//             <span className="font-medium">Description:</span> {g.description}
//           </div>
//           <div className="mt-2">
//             <span className="font-medium text-slate-700">Attachment:</span>{" "}
//             {g.attachment ? (
//               <a
//                 href={g.attachment}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 View
//               </a>
//             ) : (
//               <span className="text-slate-400">—</span>
//             )}
//           </div>
//         </div>
//       );
//     });
//   }

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">New Grievances</h2>
//       <div className="space-y-6">{content}</div>
//     </div>
//   );
// };

// export default NewGrievance;
