import CourseCard from "./CourseCard";
import { useEffect, useState } from "react";

export default function CourseList({ courses }: { courses: any[] }) {
  const [displayCourses, setDisplayCourses] = useState(courses);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const removingSet = new Set<string>();
    
    // Cari courses yang hilang dari list baru
    displayCourses.forEach((oldCourse) => {
      if (!courses.find((c) => String(c.id) === String(oldCourse.id))) {
        removingSet.add(String(oldCourse.id));
      }
    });

    if (removingSet.size > 0) {
      setRemovingIds(removingSet);
      const timer = setTimeout(() => {
        setDisplayCourses(courses);
        setRemovingIds(new Set());
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setDisplayCourses(courses);
    }
  }, [courses]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayCourses.map((c) => (
        <div
          key={String(c.id)}
          data-aos="fade-up"
          data-aos-duration="500"
          className={`transition-opacity duration-300 ${
            removingIds.has(String(c.id)) ? "opacity-0" : "opacity-100"
          }`}
        >
          <CourseCard course={c} />
        </div>
      ))}
    </div>
  );
}
