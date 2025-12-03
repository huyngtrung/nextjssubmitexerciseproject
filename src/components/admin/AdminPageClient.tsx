// 'use client';

// import React, { useMemo, useState } from 'react';
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     PieChart,
//     Pie,
//     Cell,
// } from 'recharts';

// export interface ExerciseInfo {
//     id: string;
//     name: string | null;
//     description: string | null;
//     subject: string | null;
//     dueDate: Date | null;
//     maxScore: number | null;
//     s3key: string | null;
//     status: 'SUBMITTED_ON_TIME' | 'SUBMITTED_LATE' | null;
// }

// export interface StudentInfo {
//     id: string;
//     clerkUserId: string;
//     name: string | null;
//     firstName: string | null;
//     lastName: string | null;
//     role: 'user' | 'admin';
//     email: string;
//     exercises: ExerciseInfo[];
// }

// export interface ClassWithStudents {
//     id: string;
//     name: string;
//     description: string | null;
//     order: number;
//     students: StudentInfo[];
// }

// interface AdminPageClientProps {
//     classes: ClassWithStudents[];
//     lang: 'vi' | 'en';
// }

// const COLORS = ['#4caf50', '#ff9800', '#f44336', '#9e9e9e', '#2196f3', '#ab47bc'];

// const AdminPageClient: React.FC<AdminPageClientProps> = ({ classes, lang }) => {
//     const [selectedClassIndex, setSelectedClassIndex] = useState(0);
//     const [selectedSubject, setSelectedSubject] = useState<string | 'all'>('all');
//     const [selectedStudentId, setSelectedStudentId] = useState<string | 'all'>('all');

//     // Multi-select classes for comparison (default: all selected)
//     const [compareClassIds, setCompareClassIds] = useState<string[]>(classes.map((c) => c.id));

//     // All subjects across all classes
//     const allSubjects = useMemo(
//         () =>
//             Array.from(
//                 new Set(
//                     classes.flatMap((cls) =>
//                         cls.students.flatMap((s) =>
//                             s.exercises.map((ex) => ex.subject).filter(Boolean),
//                         ),
//                     ),
//                 ),
//             ),
//         [classes],
//     );

//     // Selected class
//     const selectedClass = classes[selectedClassIndex];

//     // Subjects in selected class
//     const subjectsInSelectedClass = useMemo(
//         () =>
//             Array.from(
//                 new Set(
//                     selectedClass.students.flatMap((student) =>
//                         student.exercises.map((ex) => ex.subject).filter(Boolean),
//                     ),
//                 ),
//             ),
//         [selectedClass],
//     );

//     // Helper: unique exercises in a class (by id)
//     const uniqueExercisesOfClass = (cls: ClassWithStudents) =>
//         Array.from(
//             new Map(cls.students.flatMap((s) => s.exercises).map((ex) => [ex.id, ex])).values(),
//         );

//     // ---------- BAR DATA: total or per-subject per class (used by top bar chart) ----------
//     const barData = useMemo(() => {
//         return classes
//             .filter((cls) => compareClassIds.includes(cls.id))
//             .map((cls, idx) => {
//                 const allEx = uniqueExercisesOfClass(cls);
//                 const filtered =
//                     selectedSubject === 'all'
//                         ? allEx
//                         : allEx.filter((e) => e.subject === selectedSubject);
//                 return {
//                     classId: cls.id,
//                     className: cls.name,
//                     total: Math.round(filtered.length), // integer
//                 };
//             });
//     }, [classes, selectedSubject, compareClassIds]);

//     // ---------- CLASS COMPARISON PIE: each slice = class completed count (for selectedBarSubject or all) ----------
//     const classComparisonPie = useMemo(() => {
//         // For each class included in compareClassIds compute completed count (doneOnTime+doneLate) across unique exercises filtered by selectedSubject (if any)
//         const arr = classes
//             .filter((cls) => compareClassIds.includes(cls.id))
//             .map((cls) => {
//                 const exs =
//                     selectedSubject === 'all'
//                         ? uniqueExercisesOfClass(cls)
//                         : uniqueExercisesOfClass(cls).filter((e) => e.subject === selectedSubject);
//                 // count how many submissions exist (sum of students who submitted each exercise)
//                 // But for class-level completed we define "exercise done count" as number of exercise submissions across all students (same as before). We'll sum student-level done for those exercise IDs.
//                 let completedCount = 0;
//                 const totalPossible = exs.length * cls.students.length;
//                 if (exs.length === 0) {
//                     completedCount = 0;
//                 } else {
//                     // count student-ex pairs done
//                     for (const s of cls.students) {
//                         for (const ex of exs) {
//                             const se = s.exercises.find((x) => x.id === ex.id);
//                             if (
//                                 se &&
//                                 (se.status === 'SUBMITTED_ON_TIME' ||
//                                     se.status === 'SUBMITTED_LATE')
//                             ) {
//                                 completedCount += 1;
//                             }
//                         }
//                     }
//                 }
//                 return {
//                     classId: cls.id,
//                     className: cls.name,
//                     completedCount,
//                     totalPossible,
//                 };
//             });
//         // Map to pie data: label by className and value = completedCount
//         const pie = arr.map((a, i) => ({
//             name: a.className,
//             value: a.completedCount,
//             color: COLORS[i % COLORS.length],
//         }));
//         if (pie.length === 0) return [{ name: 'No data', value: 1, color: '#e0e0e0' }];
//         return pie;
//     }, [classes, compareClassIds, selectedSubject]);

//     // ---------- CLASS COMPLETION RATE BAR: students who completed ALL exercises in that class ----------
//     const classFullCompletionBar = useMemo(() => {
//         return classes
//             .filter((cls) => compareClassIds.includes(cls.id))
//             .map((cls) => {
//                 // unique exercises for class (filter by selectedSubject? This metric usually should be for all exercises in class;
//                 // here we'll compute for selectedSubject==='all' => all exercises, else only exercises of that subject)
//                 const exs =
//                     selectedSubject === 'all'
//                         ? uniqueExercisesOfClass(cls)
//                         : uniqueExercisesOfClass(cls).filter((e) => e.subject === selectedSubject);

//                 const totalExercises = exs.length;
//                 // if no exercises, then 0 students completed all
//                 let fullCompletedStudents = 0;
//                 if (totalExercises > 0) {
//                     for (const s of cls.students) {
//                         // count how many of these exercises the student has submitted (any status)
//                         const doneCount = exs.reduce((acc, ex) => {
//                             const se = s.exercises.find((x) => x.id === ex.id);
//                             return (
//                                 acc +
//                                 (se &&
//                                 (se.status === 'SUBMITTED_ON_TIME' ||
//                                     se.status === 'SUBMITTED_LATE')
//                                     ? 1
//                                     : 0)
//                             );
//                         }, 0);
//                         if (doneCount === totalExercises) fullCompletedStudents += 1;
//                     }
//                 }
//                 const totalStudents = cls.students.length;
//                 const percent =
//                     totalStudents === 0
//                         ? 0
//                         : Math.round((fullCompletedStudents / totalStudents) * 100);
//                 return {
//                     classId: cls.id,
//                     className: cls.name,
//                     fullCompletedStudents,
//                     totalStudents,
//                     percent,
//                 };
//             });
//     }, [classes, compareClassIds, selectedSubject]);

//     // ---------- Selected class detailed stats ----------
//     const allExercisesInSelectedClass = uniqueExercisesOfClass(selectedClass);

//     // exercises in selected subject in selected class (if selectedSubject === 'all', we won't auto-show them)
//     const exercisesInClassOrSubject =
//         selectedSubject === 'all'
//             ? allExercisesInSelectedClass
//             : allExercisesInSelectedClass.filter((e) => e.subject === selectedSubject);

//     // Filter students list for selected class (or specific student)
//     const filteredStudents =
//         selectedStudentId === 'all'
//             ? selectedClass.students
//             : selectedClass.students.filter((s) => s.id === selectedStudentId);

//     // ---------- Per-student completion details (for selected class and subject) ----------
//     const studentCompletion = useMemo(() => {
//         const exercises =
//             selectedSubject === 'all' ? allExercisesInSelectedClass : exercisesInClassOrSubject;
//         return filteredStudents.map((student) => {
//             const doneOnTime = exercises.filter((ex) =>
//                 student.exercises.some(
//                     (se) => se.id === ex.id && se.status === 'SUBMITTED_ON_TIME',
//                 ),
//             ).length;
//             const doneLate = exercises.filter((ex) =>
//                 student.exercises.some((se) => se.id === ex.id && se.status === 'SUBMITTED_LATE'),
//             ).length;
//             const total = Math.round(exercises.length); // integer
//             const notDone = Math.max(0, total - doneOnTime - doneLate);
//             const done = doneOnTime + doneLate;
//             const completionRate = total === 0 ? 0 : done / total;
//             const problemRate = total === 0 ? 0 : (notDone + doneLate) / total;

//             // classify
//             let category: 'special' | 'need' | 'veryNeed' | 'good' | 'normal' = 'normal';
//             if (total === 0) {
//                 category = 'normal';
//             } else if (completionRate <= 0.1) {
//                 category = 'special';
//             } else if (problemRate >= 0.4) {
//                 category = 'need';
//             } else if (problemRate >= 0.25) {
//                 category = 'veryNeed';
//             } else if (completionRate >= 0.85) {
//                 category = 'good';
//             }

//             return {
//                 studentId: student.id,
//                 name: student.name ?? `${student.firstName ?? ''} ${student.lastName ?? ''}`,
//                 doneOnTime,
//                 doneLate,
//                 notDone,
//                 total,
//                 done,
//                 completionRate: Math.round(completionRate * 100), // integer percent
//                 problemRate: Math.round(problemRate * 100),
//                 category,
//             };
//         });
//     }, [filteredStudents, selectedSubject, allExercisesInSelectedClass, exercisesInClassOrSubject]);

//     // ---------- Class-level pie for selected class (done vs not done) ----------
//     const classPieData = useMemo(() => {
//         // sum across students but count per student-exercise pair (same approach as earlier)
//         const exercises =
//             selectedSubject === 'all' ? allExercisesInSelectedClass : exercisesInClassOrSubject;
//         const total = exercises.length * selectedClass.students.length;
//         let done = 0;
//         if (exercises.length > 0) {
//             for (const s of selectedClass.students) {
//                 for (const ex of exercises) {
//                     const se = s.exercises.find((x) => x.id === ex.id);
//                     if (se && (se.status === 'SUBMITTED_ON_TIME' || se.status === 'SUBMITTED_LATE'))
//                         done += 1;
//                 }
//             }
//         }
//         const notDone = Math.max(0, total - done);
//         const data = [
//             { name: 'Đã làm', value: done },
//             { name: 'Chưa làm', value: notDone },
//         ];
//         // if both 0 -> put placeholder to avoid label overlap
//         const sum = data.reduce((a, b) => a + b.value, 0);
//         if (sum === 0) return [{ name: 'No data', value: 1 }];
//         return data;
//     }, [selectedClass, selectedSubject, allExercisesInSelectedClass, exercisesInClassOrSubject]);

//     // ---------- Student min/max done stats in class ----------
//     const minMaxStudents = useMemo(() => {
//         const exs =
//             selectedSubject === 'all' ? allExercisesInSelectedClass : exercisesInClassOrSubject;
//         const totalsPerStudent = selectedClass.students.map((s) => {
//             const done = exs.reduce((acc, ex) => {
//                 const se = s.exercises.find((x) => x.id === ex.id);
//                 return (
//                     acc +
//                     (se && (se.status === 'SUBMITTED_ON_TIME' || se.status === 'SUBMITTED_LATE')
//                         ? 1
//                         : 0)
//                 );
//             }, 0);
//             return { student: s, done };
//         });
//         if (totalsPerStudent.length === 0) return { min: null, max: null };
//         const min = totalsPerStudent.reduce((a, b) => (a.done <= b.done ? a : b));
//         const max = totalsPerStudent.reduce((a, b) => (a.done >= b.done ? a : b));
//         return { min, max, totalExercises: exs.length };
//     }, [selectedClass, selectedSubject, allExercisesInSelectedClass, exercisesInClassOrSubject]);

//     // ---------- Class-level pie for comparison between classes might have sum=0 -> handle placeholder ----------
//     const classComparisonPieSafe = useMemo(() => {
//         const sum = classComparisonPie.reduce((a: number, b: any) => a + b.value, 0);
//         if (sum === 0) return [{ name: 'No data', value: 1, color: '#e0e0e0' }];
//         return classComparisonPie;
//     }, [classComparisonPie]);

//     // ---------- UI handlers ----------
//     const toggleCompareClass = (classId: string) => {
//         setCompareClassIds((prev) => {
//             if (prev.includes(classId)) {
//                 return prev.filter((id) => id !== classId);
//             }
//             return [...prev, classId];
//         });
//     };

//     const allExercisesInClass = Array.from(
//         new Map(
//             selectedClass.students.flatMap((s) => s.exercises).map((ex) => [ex.id, ex]),
//         ).values(),
//     );
//     // --- Bài làm nhiều/ít nhất theo môn được chọn ---
//     const exercisesInSelectedSubject = useMemo(() => {
//         // Nếu chọn 'all' thì lấy tất cả bài
//         if (selectedSubject === 'all') return allExercisesInClass;
//         return allExercisesInClass.filter((ex) => ex.subject === selectedSubject);
//     }, [allExercisesInClass, selectedSubject]);

//     const exercisesCountMap = useMemo(() => {
//         return exercisesInSelectedSubject.map((ex) => {
//             const countDone = selectedClass.students.filter((s) =>
//                 s.exercises.some(
//                     (se) =>
//                         se.id === ex.id &&
//                         (se.status === 'SUBMITTED_ON_TIME' || se.status === 'SUBMITTED_LATE'),
//                 ),
//             ).length;
//             return { exercise: ex.name ?? 'N/A', countDone };
//         });
//     }, [selectedClass, exercisesInSelectedSubject]);

//     const maxDoneExercise = useMemo(() => {
//         if (exercisesCountMap.length === 0) return null;
//         const maxCount = Math.max(...exercisesCountMap.map((x) => x.countDone));
//         // Có thể có nhiều bài cùng số lượng nhiều nhất
//         return exercisesCountMap.filter((x) => x.countDone === maxCount);
//     }, [exercisesCountMap]);

//     const minDoneExercise = useMemo(() => {
//         if (exercisesCountMap.length === 0) return null;
//         const minCount = Math.min(...exercisesCountMap.map((x) => x.countDone));
//         // Có thể có nhiều bài cùng số lượng ít nhất
//         return exercisesCountMap.filter((x) => x.countDone === minCount);
//     }, [exercisesCountMap]);

//     // ---------- Render ----------
//     return (
//         <div className="p-8 space-y-6">
//             <h1 className="text-3xl font-bold mb-4">Teacher Dashboard ({lang})</h1>

//             {/* ----- Multi-class compare filter ----- */}
//             <div className="border p-4 rounded">
//                 <h3 className="font-semibold mb-2">Chọn lớp để so sánh (mặc định tất cả)</h3>
//                 <div className="flex flex-wrap gap-2">
//                     {classes.map((cls) => {
//                         const active = compareClassIds.includes(cls.id);
//                         return (
//                             <button
//                                 key={cls.id}
//                                 onClick={() => toggleCompareClass(cls.id)}
//                                 className={`px-3 py-1 rounded border ${active ? 'bg-blue-600 text-white' : 'bg-white'}`}
//                             >
//                                 {cls.name}
//                             </button>
//                         );
//                     })}
//                 </div>
//             </div>
//             {/* ----- Top bar: number of exercises per class (or per-subject if selected) ----- */}
//             <div className="border p-4 rounded">
//                 <div className="flex items-center justify-between">
//                     <h3 className="font-semibold mb-2">
//                         {selectedSubject === 'all'
//                             ? 'Tổng số bài tập theo lớp (tất cả môn)'
//                             : `Số bài tập môn ${selectedSubject} theo lớp`}
//                     </h3>

//                     {/* subject selector for top bar */}
//                     <div>
//                         <label className="mr-2">Chọn môn cho biểu đồ cột:</label>
//                         <select
//                             value={selectedSubject}
//                             onChange={(e) => {
//                                 const v = e.target.value;
//                                 setSelectedSubject(v);
//                                 // when changing subject, keep compare selection
//                             }}
//                             className="border rounded px-2 py-1"
//                         >
//                             <option value="all">Tất cả</option>
//                             {allSubjects.map((subject) => (
//                                 <option key={subject} value={subject}>
//                                     {subject}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <ResponsiveContainer width="100%" height={260}>
//                     <BarChart data={barData}>
//                         <XAxis dataKey="className" />
//                         <YAxis allowDecimals={false} /> {/* ensure integers on axis */}
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="total" fill="#4caf50" name="Số bài (count)" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//             {/* ----- Class comparison pie: slices per class (completed counts) ----- */}
//             <div className="border p-4 rounded">
//                 <h3 className="font-semibold mb-2">So sánh số bài đã nộp giữa các lớp</h3>
//                 <ResponsiveContainer width="100%" height={220}>
//                     <PieChart>
//                         <Pie
//                             data={classComparisonPieSafe}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={80}
//                             labelLine={false}
//                         >
//                             {classComparisonPieSafe.map((entry: any, index: number) => (
//                                 <Cell
//                                     key={`cell-comp-${index}`}
//                                     fill={entry.color || COLORS[index % COLORS.length]}
//                                 />
//                             ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>
//             {/* ----- Class full-completion bar chart (students who completed ALL exercises) ----- */}
//             <div className="border p-4 rounded">
//                 <h3 className="font-semibold mb-2">Số học sinh hoàn thành tất cả bài (theo lớp)</h3>
//                 <ResponsiveContainer width="100%" height={220}>
//                     <BarChart data={classFullCompletionBar}>
//                         <XAxis dataKey="className" />
//                         <YAxis allowDecimals={false} />
//                         <Tooltip formatter={(v: any, name: any) => [`${v}`, name]} />
//                         <Legend />
//                         <Bar
//                             dataKey="fullCompletedStudents"
//                             fill="#2196f3"
//                             name="Hoàn tất tất cả bài (count)"
//                         />
//                         <Bar dataKey="percent" fill="#ab47bc" name="Tỉ lệ hoàn tất (%)" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//             {/* ----- Class detail controls ----- */}
//             <div className="flex gap-4 items-center">
//                 <div>
//                     <label className="font-semibold mr-2">Chọn lớp:</label>
//                     <select
//                         value={selectedClassIndex}
//                         onChange={(e) => {
//                             const index = parseInt(e.target.value, 10);
//                             setSelectedClassIndex(index);
//                             setSelectedSubject('all');
//                             setSelectedStudentId('all');
//                         }}
//                         className="border rounded px-2 py-1"
//                     >
//                         {classes.map((cls, idx) => (
//                             <option key={cls.id} value={idx}>
//                                 {cls.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <label className="font-semibold mr-2">Chọn học sinh:</label>
//                     <select
//                         value={selectedStudentId}
//                         onChange={(e) => setSelectedStudentId(e.target.value)}
//                         className="border rounded px-2 py-1"
//                     >
//                         <option value="all">Tất cả</option>
//                         {selectedClass.students.map((s) => (
//                             <option key={s.id} value={s.id}>
//                                 {s.name ?? `${s.firstName ?? ''} ${s.lastName ?? ''}`}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="font-semibold mr-2">Chọn môn:</label>
//                     <select
//                         value={selectedSubject}
//                         onChange={(e) => {
//                             setSelectedSubject(e.target.value);
//                             setSelectedStudentId('all');
//                         }}
//                         className="border rounded px-2 py-1"
//                     >
//                         <option value="all">Tất cả</option>
//                         {subjectsInSelectedClass.map((subject) => (
//                             <option key={subject} value={subject}>
//                                 {subject}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//             {/* ----- Class overview ----- */}
//             <div className="border p-4 rounded space-y-3">
//                 <h2 className="font-bold text-xl">{selectedClass.name}</h2>
//                 <p>Số học sinh: {Math.round(selectedClass.students.length)}</p>
//                 <p>Tổng số bài tập trong lớp: {Math.round(allExercisesInSelectedClass.length)}</p>
//                 {selectedSubject !== 'all' && (
//                     <p>
//                         Số bài tập môn {selectedSubject}:{' '}
//                         {Math.round(exercisesInClassOrSubject.length)}
//                     </p>
//                 )}
//                 <p>
//                     Bài làm nhiều nhất:{' '}
//                     {maxDoneExercise && maxDoneExercise.length > 0
//                         ? maxDoneExercise.map((ex) => `${ex.exercise} (${ex.countDone})`).join(', ')
//                         : 'Không có dữ liệu'}{' '}
//                     | Bài làm ít nhất:{' '}
//                     {minDoneExercise && minDoneExercise.length > 0
//                         ? minDoneExercise.map((ex) => `${ex.exercise} (${ex.countDone})`).join(', ')
//                         : 'Không có dữ liệu'}
//                 </p>

//                 {/* Class pie: done vs not done */}
//                 <div>
//                     <h4 className="font-semibold">Tỉ lệ nộp bài (lớp)</h4>
//                     <ResponsiveContainer width="100%" height={180}>
//                         <PieChart>
//                             <Pie
//                                 data={classPieData}
//                                 dataKey="value"
//                                 nameKey="name"
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={70}
//                                 labelLine={false}
//                             >
//                                 {classPieData.map((entry, i) => (
//                                     <Cell
//                                         key={`cell-class-${i}`}
//                                         fill={COLORS[i % COLORS.length]}
//                                     />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                             <Legend />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* Min / Max student in class */}
//                 <div>
//                     <h4 className="font-semibold">
//                         Học sinh làm ít nhất / nhiều nhất (số bài đã nộp)
//                     </h4>
//                     {minMaxStudents.min && minMaxStudents.max ? (
//                         <div>
//                             <p>
//                                 Làm ít nhất:{' '}
//                                 {minMaxStudents.min.student.name ??
//                                     `${minMaxStudents.min.student.firstName ?? ''} ${minMaxStudents.min.student.lastName ?? ''}`}{' '}
//                                 - {minMaxStudents.min.done}/{minMaxStudents.totalExercises}
//                             </p>
//                             <p>
//                                 Làm nhiều nhất:{' '}
//                                 {minMaxStudents.max.student.name ??
//                                     `${minMaxStudents.max.student.firstName ?? ''} ${minMaxStudents.max.student.lastName ?? ''}`}{' '}
//                                 - {minMaxStudents.max.done}/{minMaxStudents.totalExercises}
//                             </p>
//                         </div>
//                     ) : (
//                         <p>Không có dữ liệu bài tập</p>
//                     )}
//                 </div>
//             </div>
//             {/* ----- Student list + categories + per-student pie when chosen ----- */}
//             <div className="border p-4 rounded space-y-3">
//                 <h3 className="font-semibold">Danh sách học sinh & phân loại</h3>

//                 {/* Category lists */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <h4 className="font-semibold">
//                             Học sinh cần đặc biệt quan tâm (completion ≤ 10%)
//                         </h4>
//                         <ul>
//                             {studentCompletion
//                                 .filter((s) => s.category === 'special')
//                                 .map((s) => (
//                                     <li key={s.studentId}>
//                                         {s.name} — {s.done}/{s.total}
//                                     </li>
//                                 ))}
//                             {studentCompletion.filter((s) => s.category === 'special').length ===
//                                 0 && <li>Không có</li>}
//                         </ul>
//                     </div>

//                     <div>
//                         <h4 className="font-semibold">
//                             Học sinh cần quan tâm (notDone+late {'>'} 40%)
//                         </h4>
//                         <ul>
//                             {studentCompletion
//                                 .filter((s) => s.category === 'need')
//                                 .map((s) => (
//                                     <li key={s.studentId}>
//                                         {s.name} — Chưa làm + làm muộn: {s.notDone + s.doneLate}/
//                                         {s.total} ({s.problemRate}%)
//                                     </li>
//                                 ))}
//                             {studentCompletion.filter((s) => s.category === 'need').length ===
//                                 0 && <li>Không có</li>}
//                         </ul>
//                     </div>

//                     <div>
//                         <h4 className="font-semibold">
//                             Học sinh rất cần quan tâm (25% ≤ notDone+late & &lt; 40%)
//                         </h4>
//                         <ul>
//                             {studentCompletion
//                                 .filter((s) => s.category === 'veryNeed')
//                                 .map((s) => (
//                                     <li key={s.studentId}>
//                                         {s.name} — Chưa làm + làm muộn: {s.notDone + s.doneLate}/
//                                         {s.total} ({s.problemRate}%)
//                                     </li>
//                                 ))}
//                             {studentCompletion.filter((s) => s.category === 'veryNeed').length ===
//                                 0 && <li>Không có</li>}
//                         </ul>
//                     </div>

//                     <div>
//                         <h4 className="font-semibold">Học sinh tốt (completion ≥ 85%)</h4>
//                         <ul>
//                             {studentCompletion
//                                 .filter((s) => s.category === 'good')
//                                 .map((s) => (
//                                     <li key={s.studentId}>
//                                         {s.name} — Hoàn thành: {s.done}/{s.total} (
//                                         {s.completionRate}%)
//                                     </li>
//                                 ))}
//                             {studentCompletion.filter((s) => s.category === 'good').length ===
//                                 0 && <li>Không có</li>}
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Full student list with numeric breakdown */}
//                 <div className="mt-4">
//                     <h4 className="font-semibold">Chi tiết học sinh (số liệu)</h4>
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr>
//                                 <th className="border p-2">Học sinh</th>
//                                 <th className="border p-2">Tổng</th>
//                                 <th className="border p-2">Đã làm</th>
//                                 <th className="border p-2">Đúng hạn</th>
//                                 <th className="border p-2">Làm muộn</th>
//                                 <th className="border p-2">Chưa làm</th>
//                                 <th className="border p-2">Tỉ lệ hoàn thành</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {studentCompletion.map((s) => (
//                                 <tr key={s.studentId}>
//                                     <td className="border p-2">{s.name}</td>
//                                     <td className="border p-2">{s.total}</td>
//                                     <td className="border p-2">{s.done}</td>
//                                     <td className="border p-2">{s.doneOnTime}</td>
//                                     <td className="border p-2">{s.doneLate}</td>
//                                     <td className="border p-2">{s.notDone}</td>
//                                     <td className="border p-2">{s.completionRate}%</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Student pie (only when a student is selected) */}
//                 {selectedStudentId !== 'all' && studentCompletion.length > 0 && (
//                     <div className="mt-4">
//                         <h4 className="font-semibold">
//                             Biểu đồ tỉ lệ làm bài của học sinh đã chọn
//                         </h4>
//                         {studentCompletion.map((s, idx) => {
//                             // pie data with fallback if all zeros
//                             const pieData =
//                                 s.total === 0
//                                     ? [{ name: 'No data', value: 1 }]
//                                     : [
//                                           { name: 'Đã làm đúng hạn', value: s.doneOnTime },
//                                           { name: 'Làm muộn', value: s.doneLate },
//                                           { name: 'Chưa làm', value: s.notDone },
//                                       ];
//                             const totalVal = pieData.reduce((a, b) => a + b.value, 0);
//                             return (
//                                 <div key={s.studentId} className="mt-2 border p-2 rounded">
//                                     <h5 className="font-semibold">{s.name}</h5>
//                                     <p>
//                                         Tổng: {s.total} — Đã làm: {s.done} — Đúng hạn:{' '}
//                                         {s.doneOnTime} — Muộn: {s.doneLate} — Chưa làm: {s.notDone}
//                                     </p>
//                                     <ResponsiveContainer width="100%" height={180}>
//                                         <PieChart>
//                                             <Pie
//                                                 data={pieData}
//                                                 dataKey="value"
//                                                 nameKey="name"
//                                                 cx="50%"
//                                                 cy="50%"
//                                                 outerRadius={60}
//                                                 labelLine={false}
//                                                 label={({ name, percent, value }: any) =>
//                                                     value === 0 ? '' : `${name}: ${value}`
//                                                 }
//                                                 minAngle={totalVal === 0 ? 0 : 5}
//                                             >
//                                                 {pieData.map((entry, i) => (
//                                                     <Cell
//                                                         key={`cell-stu-${i}`}
//                                                         fill={
//                                                             i === 0
//                                                                 ? '#4caf50'
//                                                                 : i === 1
//                                                                   ? '#ff9800'
//                                                                   : i === 2
//                                                                     ? '#f44336'
//                                                                     : '#9e9e9e'
//                                                         }
//                                                     />
//                                                 ))}
//                                             </Pie>
//                                             <Tooltip />
//                                             <Legend />
//                                         </PieChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminPageClient;
